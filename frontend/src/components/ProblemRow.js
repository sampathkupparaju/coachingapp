// frontend/src/components/ProblemRow.js
import React, { useState, useEffect } from "react";
import { FaRegCircle, FaCheckCircle, FaRegStar, FaStar, FaStickyNote } from "react-icons/fa";
import PropTypes from "prop-types";
// Import your API functions for toggling solve/star status
import { toggleProblemSolved, toggleProblemStarred } from "../api/problems"; // Path should be correct if api.js is in src/api/

const ProblemRow = ({
  problem,
  onToggle, // Callback: (problemId, newSolvedStatus, newStarredStatus)
  onOpenNotesPanel // Callback: (problemId)
}) => {
  const {
    id,
    title,
    // topic, // Not directly used in this component's render output
    difficulty: initialDifficulty,
    isSolved: initialIsSolvedProp, // Prop for solved status
    isStarred: initialIsStarredProp, // Prop for starred status
    leetcodeUrl,
    neetCodeUrl,
  } = problem;

  // Local UI state, synced with props
  const [isSolved, setIsSolved] = useState(initialIsSolvedProp);
  const [isStarred, setIsStarred] = useState(initialIsStarredProp);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Sync local state if the incoming problem prop changes
  useEffect(() => {
    setIsSolved(initialIsSolvedProp);
    setIsStarred(initialIsStarredProp);
  }, [initialIsSolvedProp, initialIsStarredProp]);

  const handleApiInteraction = async (type) => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);

    let promise;
    if (type === "solve") {
      promise = toggleProblemSolved(id);
    } else if (type === "star") {
      promise = toggleProblemStarred(id);
    } else {
      setIsUpdatingStatus(false);
      console.warn("ProblemRow: Unknown interaction type:", type);
      return;
    }

    try {
      const response = await promise;
      if (response && response.data) {
        const updatedProblemFromServer = response.data;
        // Backend sends 'solved' and 'starred' fields
        const newSolvedStatus = updatedProblemFromServer.solved;
        const newStarredStatus = updatedProblemFromServer.starred;

        // Update local UI state
        setIsSolved(newSolvedStatus);
        setIsStarred(newStarredStatus);

        // Notify parent (ProblemList) about the change
        onToggle(id, newSolvedStatus, newStarredStatus);
        console.log(`ProblemRow: ${type} successful for problem ${id}.`);
      } else {
        throw new Error("Invalid response from server while updating status.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || "An unknown error occurred.";
      console.error(`ProblemRow: Error toggling ${type} for problem ${id}:`, errorMessage);
      // Optionally, you can use a global toast notification here if you implement one
      // For now, an alert can be used, or simply log the error.
      // alert(`Failed to update ${type} status: ${errorMessage}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const displayDifficulty = initialDifficulty ? initialDifficulty.charAt(0).toUpperCase() + initialDifficulty.slice(1).toLowerCase() : 'N/A';
  let diffColor = "#6c757d", diffTextColor = "#ffffff";
  if (initialDifficulty === "EASY") diffColor = "#28a745";
  else if (initialDifficulty === "MEDIUM") { diffColor = "#ffc107"; diffTextColor = "#212529"; }
  else if (initialDifficulty === "HARD") diffColor = "#dc3545";

  const cellStyle = { padding: '12px 10px', verticalAlign: 'middle', fontSize: '14px', lineHeight: '1.5' };
  const iconCellStyle = { ...cellStyle, textAlign: 'center', width: '45px' };
  const titleCellStyle = { ...cellStyle, textAlign: 'left', fontWeight: '500', color: '#212529' };
  const linkCellStyle = { ...cellStyle, textAlign: 'center', width: '80px' };
  const difficultyCellStyle = { ...cellStyle, textAlign: 'center', width: '100px' };
  const videoCellStyle = { ...cellStyle, textAlign: 'center', width: '60px' };
  const notesButtonStyleCell = { ...cellStyle, textAlign: 'center', width: '100px' };

  const actionButtonCellStyle = {
    padding: '7px 12px', // Slightly more padding
    fontSize: '13px',
    fontWeight: '500',
    borderRadius: '5px',
    border: '1px solid #007bff',
    backgroundColor: 'rgba(0, 123, 255, 0.07)', // Very light blue
    color: '#007bff',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px', // Increased gap
    transition: 'background-color 0.2s, color 0.2s, box-shadow 0.2s',
  };
  actionButtonCellStyle[':hover'] = { // Note: Pseudo-selectors don't work in inline styles.
                                     // You'd need CSS classes or JS event handlers for hover.
    backgroundColor: 'rgba(0, 123, 255, 0.15)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };


  return (
    <tr style={{
        backgroundColor: isUpdatingStatus ? '#f8f9fa' : '#ffffff',
        opacity: isUpdatingStatus ? 0.75 : 1, // Slightly less opacity when updating
        transition: 'background-color 0.2s ease, opacity 0.2s ease',
        borderBottom: '1px solid #e9ecef'
      }}>
      <td style={iconCellStyle}>
        <div
          onClick={() => handleApiInteraction('solve')}
          style={{ cursor: isUpdatingStatus ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '5px', borderRadius: '50%' }}
          title={isSolved ? "Mark as not done" : "Mark as done"}
        >
          {isSolved ? <FaCheckCircle color="#28a745" size={21}/> : <FaRegCircle color="#6c757d" size={21}/>}
        </div>
      </td>
      <td style={iconCellStyle}>
        <div
          onClick={() => handleApiInteraction('star')}
          style={{ cursor: isUpdatingStatus ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '5px', borderRadius: '50%' }}
          title={isStarred ? "Unstar" : "Star"}
        >
          {isStarred ? <FaStar color="#ffc107" size={21}/> : <FaRegStar color="#6c757d" size={21}/>}
        </div>
      </td>
      <td style={titleCellStyle}>
        <a href={leetcodeUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#007bff", fontSize: '1rem', fontWeight: '500' }}>
          {title || 'Untitled Problem'}
        </a>
      </td>
      <td style={linkCellStyle}>
        <a href={leetcodeUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", fontSize: '0.9rem', textDecoration: 'underline' }} title={`Open ${title || ''} on LeetCode`}>
          Visit
        </a>
      </td>
      <td style={difficultyCellStyle}>
        <span style={{
          color: diffTextColor,
          fontWeight: '500',
          fontSize: '0.85rem', // Slightly smaller
          padding: '5px 12px', // Adjusted padding
          borderRadius: '15px',
          backgroundColor: diffColor,
          display: 'inline-block',
          minWidth: '75px', // Adjusted min-width
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          {displayDifficulty}
        </span>
      </td>
      <td style={videoCellStyle}>
        {neetCodeUrl && neetCodeUrl.trim() !== "" ? (
          <a href={neetCodeUrl} target="_blank" rel="noopener noreferrer" title="Watch solution video" style={{ textDecoration: 'none' }}>
            <span style={{ cursor: "pointer", fontSize: 28, color: '#007bff' }}>🎥</span>
          </a>
        ) : (
          <span style={{ color: "#adb5bd", fontSize: '14px' }}>–</span>
        )}
      </td>
      <td style={notesButtonStyleCell}>
        <button
          onClick={() => onOpenNotesPanel(id)} // Pass problem ID
          style={actionButtonCellStyle}
          title={`View/Edit notes for ${title || 'this problem'}`}
        >
          <FaStickyNote size={15} /> Notes
        </button>
      </td>
    </tr>
  );
};

ProblemRow.propTypes = {
  problem: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    topic: PropTypes.string, // Topic is part of problem data, even if not rendered here
    difficulty: PropTypes.oneOf(["EASY", "MEDIUM", "HARD"]),
    isSolved: PropTypes.bool,
    isStarred: PropTypes.bool,
    leetcodeUrl: PropTypes.string,
    neetCodeUrl: PropTypes.string,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onOpenNotesPanel: PropTypes.func.isRequired,
};

ProblemRow.defaultProps = {
  problem: {
    title: 'N/A',
    leetcodeUrl: '#',
    neetCodeUrl: '',
    difficulty: 'EASY',
    isSolved: false,
    isStarred: false,
  }
};

export default ProblemRow;
