// frontend/src/components/ProblemList.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProblemFilter from "./ProblemFilter";
import ProblemRow from "./ProblemRow";
import LoadingSpinner from "./LoadingSpinner";
import NotesSidePanel from "./NotesSidePanel";
import { fetchAllProblems, fetchUserNotes, updateUserNote } from "../api/problems";

const Toast = ({ message, type, onClose }) => { /* ... Toast component remains the same ... */
  if (!message) return null;
  const toastStyle = { position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', padding: '12px 25px', borderRadius: '8px', color: 'white', backgroundColor: type === 'success' ? '#28a745' : '#dc3545', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '300px', maxWidth: '90%', fontSize: '1rem', };
  const closeButtonStyle = { background: 'transparent', border: 'none', color: 'white', fontSize: '22px', marginLeft: '20px', cursor: 'pointer', lineHeight: '1', padding: '0 5px' };
  return ( <div style={toastStyle}><span>{message}</span><button onClick={onClose} style={closeButtonStyle} aria-label="Close toast">&times;</button></div> );
};

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [notes, setNotes] = useState({});
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [expandedTopics, setExpandedTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingNotesStatus, setSavingNotesStatus] = useState({});

  const [isNotesPanelOpen, setIsNotesPanelOpen] = useState(false);
  const [selectedProblemForNotesPanel, setSelectedProblemForNotesPanel] = useState(null);
  const [toastInfo, setToastInfo] = useState({ message: '', type: '', key: 0 });

  const userId = localStorage.getItem("user-id");

  const displayToast = useCallback((message, type = 'info') => {
    setToastInfo({ message, type, key: Date.now() });
  }, []);

  useEffect(() => {
    let timer;
    if (toastInfo.message) { timer = setTimeout(() => setToastInfo({ message: '', type: '', key: 0 }), 3500); }
    return () => clearTimeout(timer);
  }, [toastInfo.key]);

  const loadInitialData = useCallback(async () => {
    if (!userId) { setError("User not identified. Please log in to view problems."); setLoading(false); setProblems([]); setNotes({}); setTopics([]); return; }
    setLoading(true); setError(null);
    try {
      const [problemsResponse, notesResponse] = await Promise.all([ fetchAllProblems(), fetchUserNotes(userId) ]);
      const fetchedProblems = (problemsResponse.data || []).map(p => ({ ...p, isSolved: p.solved, isStarred: p.starred, }));
      setProblems(fetchedProblems);
      const uniqueTopics = Array.from(new Set(fetchedProblems.map(p => p.topic || "Uncategorized"))).sort();
      setTopics(uniqueTopics);
      const initialExpandedState = {};
      uniqueTopics.forEach(t => { initialExpandedState[t] = true; });
      setExpandedTopics(initialExpandedState);
      setNotes(notesResponse.data || {});
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || err.message || "Failed to load problem data.";
      console.error("ProblemList: Error loading initial data:", errMsg, err); setError(errMsg);
      displayToast(`Error: ${errMsg.substring(0, 100)}`, 'error');
      setProblems([]); setNotes({}); setTopics([]);
    } finally { setLoading(false); }
  }, [userId, displayToast]);

  useEffect(() => { loadInitialData(); }, [loadInitialData]);

  const handleToggleProblemStatusInList = useCallback((problemId, newSolvedStatus, newStarredStatus) => {
    setProblems(prev => prev.map(p => p.id === problemId ? { ...p, isSolved: newSolvedStatus, isStarred: newStarredStatus } : p ));
  }, []);

  const handleSaveNoteFromSidePanel = useCallback(async (problemId, newNoteText) => {
    if (!userId) { displayToast("Authentication error. Please log in again to save notes.", "error"); return; }
    setSavingNotesStatus(prev => ({ ...prev, [problemId]: true }));
    try {
      await updateUserNote(userId, problemId, newNoteText);
      setNotes(prev => ({ ...prev, [problemId.toString()]: newNoteText }));
      displayToast("Note saved successfully!", "success");
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || err.message || "Failed to save the note.";
      console.error(`ProblemList: Error saving note for problem ${problemId}:`, errMsg);
      displayToast(`Error saving note: ${errMsg}`, "error");
    } finally { setSavingNotesStatus(prev => ({ ...prev, [problemId]: false })); }
  }, [userId, displayToast]);

  const handleOpenNotesPanelForProblem = useCallback((problemId) => {
    console.log("[ProblemList DEBUG] handleOpenNotesPanelForProblem called with ID:", problemId); // DEBUG LOG
    const problemToView = problems.find(p => p.id === problemId);
    console.log("[ProblemList DEBUG] Found problem to view:", problemToView); // DEBUG LOG
    if (problemToView) {
      setSelectedProblemForNotesPanel(problemToView);
      setIsNotesPanelOpen(true);
      console.log("[ProblemList DEBUG] Panel state set to open. Selected problem title:", problemToView.title); // DEBUG LOG
    } else {
      console.error("[ProblemList DEBUG] Problem not found for ID:", problemId); // DEBUG LOG
      displayToast("Could not find problem details to open notes.", "error");
    }
  }, [problems, displayToast]);

  const handleCloseNotesSidePanel = useCallback(() => {
    console.log("[ProblemList DEBUG] handleCloseNotesSidePanel called."); // DEBUG LOG
    setIsNotesPanelOpen(false);
    setSelectedProblemForNotesPanel(null);
  }, []);

  const toggleTopicGroupExpansion = (topicName) => { /* ... */ setExpandedTopics(prev => ({ ...prev, [topicName]: !prev[topicName] })); };
  const filteredProblemsByTopic = useMemo(() => { /* ... */ const topicsToDisplay = selectedTopic === "" ? topics : topics.filter(t => t === selectedTopic); return topicsToDisplay.reduce((acc, topicName) => { acc[topicName] = problems.filter(p => p.topic === topicName); return acc; }, {}); }, [problems, selectedTopic, topics]);
  const orderedTopicsToRender = selectedTopic === "" ? topics : (topics.includes(selectedTopic) ? [selectedTopic] : []);

  if (loading) return <LoadingSpinner />;
  if (error && problems.length === 0) return <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545', fontSize: '1.1rem' }}>Error loading data: {error}</div>;
  if (!userId && !loading && !error) { /* ... No user message ... */ return ( <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#fff', margin: '30px auto', maxWidth: '600px', borderRadius: '8px', boxShadow: '0 3px 12px rgba(0,0,0,0.08)' }}><h2 style={{color: '#343a40', marginBottom: '15px', fontSize: '1.5rem'}}>Welcome!</h2><p style={{color: '#495057', fontSize: '1rem', lineHeight: '1.6'}}>Please log in to view and manage your coding problems list.</p></div> ); }
  if (userId && problems.length === 0 && !loading && !error) { /* ... No problems message ... */ return <div style={{ textAlign: 'center', padding: '30px', fontSize: '1.1rem', color: '#6c757d' }}>No problems found. You can start by adding some!</div>; }

  const thBaseStyle = { textAlign: "center", padding: "14px 10px", fontWeight: '600', color: '#343a40', fontSize: '0.9rem', backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6', textTransform: 'uppercase', letterSpacing: '0.5px'};
  const thIconCellStyle = { ...thBaseStyle, width: "50px" }; const thStyleTitle = { ...thBaseStyle, textAlign: "left", paddingLeft: '18px', width: 'auto'}; const thStyleLink = { ...thBaseStyle, width: "90px" }; const thStyleDiff = { ...thBaseStyle, width: "110px" }; const thStyleVideo = { ...thBaseStyle, width: "70px" }; const thStyleActions = { ...thBaseStyle, width: "110px" };

  return (
    <div style={{ maxWidth: '1150px', margin: "30px auto", padding: "0 20px" }}>
      <ProblemFilter topics={topics} selectedTopic={selectedTopic} onSelectTopic={setSelectedTopic} />
      {error && problems.length > 0 && <div style={{ textAlign: 'center', padding: '10px', color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', marginBottom: '15px' }}>Warning: {error}. Displaying currently available data.</div>}
      <div style={{ marginTop: '25px', border: '1px solid #dee2e6', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
        <table style={{ width: "100%", minWidth:'900px', borderCollapse: "collapse" }}>
          <thead><tr><th style={thIconCellStyle}>Done</th><th style={thIconCellStyle}>Star</th><th style={thStyleTitle}>Problem</th><th style={thStyleLink}>LeetCode</th><th style={thStyleDiff}>Difficulty</th><th style={thStyleVideo}>Video</th><th style={thStyleActions}>Actions</th></tr></thead>
          <tbody>
            {orderedTopicsToRender.map(topicName => {
              const problemListForTopic = filteredProblemsByTopic[topicName] || []; if (problemListForTopic.length === 0) return null;
              const solvedCount = problemListForTopic.filter(p => p.isSolved).length; const totalCount = problemListForTopic.length;
              return (
                <React.Fragment key={topicName}>
                  <tr onClick={() => toggleTopicGroupExpansion(topicName)} style={{ backgroundColor: "#f1f3f5", cursor: "pointer", userSelect: "none", borderBottom: '1px solid #dee2e6', borderTop: expandedTopics[topicName] ? 'none' : '1px solid #dee2e6' }}>
                    <td colSpan={7} style={{ padding: "15px 20px" }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#212529' }}>{topicName.charAt(0).toUpperCase() + topicName.slice(1)}</span><span style={{ fontWeight: '500', fontSize: '0.9rem', color: '#495057', backgroundColor: '#e9ecef', padding: '5px 12px', borderRadius: '12px' }}>{expandedTopics[topicName] ? '▼ Collapse' : '► Expand'} ({solvedCount} / {totalCount})</span></div>
                      {totalCount > 0 && ( <div style={{ marginTop: '12px', height: '10px', backgroundColor: "#e0e0e0", borderRadius: '5px', overflow: 'hidden' }}><div style={{ height: "100%", width: `${(solvedCount / totalCount) * 100}%`, backgroundColor: "#28a745", transition: 'width 0.5s ease-in-out', borderRadius: '5px 0 0 5px' }} /></div> )}
                    </td>
                  </tr>
                  {expandedTopics[topicName] && problemListForTopic.map(prob => ( <ProblemRow key={prob.id} problem={prob} onToggle={handleToggleProblemStatusInList} onOpenNotesPanel={handleOpenNotesPanelForProblem}/> ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <NotesSidePanel isOpen={isNotesPanelOpen} problem={selectedProblemForNotesPanel} currentNote={selectedProblemForNotesPanel ? (notes[selectedProblemForNotesPanel.id.toString()] || '') : ''} onClose={handleCloseNotesSidePanel} onSaveNote={handleSaveNoteFromSidePanel} isSaving={selectedProblemForNotesPanel ? !!savingNotesStatus[selectedProblemForNotesPanel.id] : false} />
      <Toast message={toastInfo.message} type={toastInfo.type} onClose={() => setToastInfo({ message: '', type: '', key: 0 })} />
    </div>
  );
};

export default ProblemList;
