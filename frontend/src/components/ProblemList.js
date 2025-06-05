// frontend/src/components/ProblemList.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopicSection from './TopicSection';
import LoadingSpinner from './LoadingSpinner';

const ProblemList = () => {
  const [groupedByTopic, setGroupedByTopic] = useState({});
  const [notes, setNotes] = useState({});
  const [savingNotes, setSavingNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL.replace(/\/$/, '');

  // Read token + userId from localStorage
  const token = localStorage.getItem('jwt-token');
  const userId = localStorage.getItem('user-id');

  // Log them out so you can see exactly what you're working with
  console.log('ProblemList mounted: token=', token, 'user-id=', userId);

  useEffect(() => {
    // If there's no JWT at all, we can't fetch anything → send user back to /login
    if (!token) {
      console.warn('No JWT found in localStorage. Redirecting to /login.');
      navigate('/login', { replace: true });
      return;
    }

    // Attempt to fetch problems and notes
    const fetchData = async () => {
      setLoading(true);

      try {
        // 1) GET /api/problems
        const problemsResp = await axios.get(`${baseUrl}/api/problems`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // problemsResp.data is an array of objects like:
        // { id, title, difficulty, solved, starred, topic, … }
        // We need to add `isSolved` and `isStarred` so ProblemRow will pick it up:
        const allProblems = problemsResp.data.map((p) => ({
          ...p,
          isSolved: p.solved,
          isStarred: p.starred,
        }));

        // Group them by topic (unchanged):
        const byTopic = {};
        allProblems.forEach((p) => {
          if (!byTopic[p.topic]) byTopic[p.topic] = [];
          byTopic[p.topic].push(p);
        });

        // 2) Now fetch notes, but only if userId is present
        let notesMap = {};
        if (userId) {
          const notesResp = await axios.get(
            `${baseUrl}/api/users/${userId}/notes`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          notesMap = notesResp.data || {};
        } else {
          console.warn(
            'JWT is present but no "user-id" in localStorage. Skipping notes fetch for now.'
          );
        }

        setGroupedByTopic(byTopic);
        setNotes(notesMap);
      } catch (err) {
        console.error('Error fetching problems or notes:', err);

        // If backend returns 401/403, clear localStorage & redirect to /login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('jwt-token');
          localStorage.removeItem('user-id');
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // We only want this to run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, token, userId]);

  // Called whenever a ProblemRow toggles solved or starred:
  const handleToggle = (problemId, newIsSolved, newIsStarred) => {
    console.log('ProblemList.handleToggle:', problemId, newIsSolved, newIsStarred);
    setGroupedByTopic((prev) => {
      const updated = {};
      for (const [topic, probs] of Object.entries(prev)) {
        updated[topic] = probs.map((p) =>
          p.id === problemId
            ? { ...p, isSolved: newIsSolved, isStarred: newIsStarred }
            : p
        );
      }
      return updated;
    });
  };

  // Called whenever a ProblemRow’s note changes (onBlur):
  const handleNoteChange = async (problemId, newNote) => {
    setSavingNotes((prev) => ({ ...prev, [problemId]: true }));
    setNotes((prev) => ({ ...prev, [problemId]: newNote }));

    try {
      if (!userId) {
        throw new Error('Cannot save note: userId is missing.');
      }
      await axios.put(
        `${baseUrl}/api/users/${userId}/notes/${problemId}`,
        { note: newNote },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Error saving note:', err);
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        localStorage.removeItem('jwt-token');
        localStorage.removeItem('user-id');
        navigate('/login', { replace: true });
      }
    } finally {
      setSavingNotes((prev) => ({ ...prev, [problemId]: false }));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const topicNames = Object.keys(groupedByTopic).sort();

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {topicNames.map((topic) => (
        <TopicSection
          key={topic}
          topicName={topic}
          problems={groupedByTopic[topic]}
          notes={notes}
          savingNotes={savingNotes}
          onToggle={handleToggle}
          onNoteChange={handleNoteChange}
        />
      ))}
    </div>
  );
};

export default ProblemList;
