// src/components/ProblemRow.js
import React, { useState, useEffect } from 'react';
import {
  FaCheckCircle,
  FaRegCircle,
  FaRegStar,
  FaStar,
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import axios from 'axios';

const ProblemRow = ({
  problem,
  note,
  onNoteChange,
  savingNote,
  onToggle,
}) => {
  const {
    id,
    title,
    leetcodeUrl,
    neetCodeUrl,
    difficulty,

    // NOTE: we still read `isSolved`/`isStarred` from props, since your parent
    // is passing those names down. If your GET /api/problems actually sends
    // JSON keys "solved" and "starred", then `problem.isSolved` here will
    // already be undefined and you'll need to rename this destructuring to
    // `const { solved: initialSolved, starred: initialStarred } = problem;`
    // and change your PropTypes accordingly. But in your original code you
    // said “GET all problems now returns ... isSolved, isStarred”, so we’ll
    // assume the parent is indeed passing `problem.isSolved` & `problem.isStarred`.
    isSolved: initialSolved,
    isStarred: initialStarred,
  } = problem;

  // Local copies of “solved” and “starred” for immediate UI feedback
  const [isSolved, setIsSolved] = useState(initialSolved);
  const [isStarred, setIsStarred] = useState(initialStarred);
  const [localNote, setLocalNote] = useState(note || '');

  // Whenever the parent re-sends new props, overwrite local state:
  useEffect(() => {
    setIsSolved(initialSolved);
    setIsStarred(initialStarred);
  }, [initialSolved, initialStarred]);

  useEffect(() => {
    setLocalNote(note || '');
  }, [note]);

  // Build base URL and read JWT token
  const baseUrl = process.env.REACT_APP_API_URL.replace(/\/$/, '');
  const token = localStorage.getItem('jwt-token');

  /**
   * 1) Toggle “solved” on the backend.
   *    PUT /api/problems/{id}/solve
   *    Then read resp.data.solved / resp.data.starred (not resp.data.isSolved),
   *    update local state, and bubble it up via onToggle(...)
   */
  const handleToggleSolved = async () => {
    try {
      const resp = await axios.put(
        `${baseUrl}/api/problems/${id}/solve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // IMPORTANT: use resp.data.solved and resp.data.starred
      const updatedSolved = resp.data.solved;
      const updatedStarred = resp.data.starred;

      setIsSolved(updatedSolved);
      // Tell the parent: problemId, newSolved, newStarred
      onToggle(id, updatedSolved, updatedStarred);
    } catch (err) {
      console.error('Error toggling solved:', err);
    }
  };

  /**
   * 2) Toggle “starred” on the backend.
   *    PUT /api/problems/{id}/star
   *    Then read resp.data.starred / resp.data.solved (not resp.data.isStarred),
   *    update local state, and bubble it up via onToggle(...)
   */
  const handleToggleStar = async () => {
    try {
      const resp = await axios.put(
        `${baseUrl}/api/problems/${id}/star`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // IMPORTANT: use resp.data.starred and resp.data.solved
      const updatedStarred = resp.data.starred;
      const updatedSolved = resp.data.solved;

      setIsStarred(updatedStarred);
      onToggle(id, updatedSolved, updatedStarred);
    } catch (err) {
      console.error('Error toggling starred:', err);
    }
  };

  /**
   * 3) Whenever the <textarea> loses focus, if the note changed, inform parent via onNoteChange(...)
   */
  const handleNoteBlur = () => {
    if (localNote !== (note || '')) {
      onNoteChange(id, localNote);
    }
  };

  // Display “Easy” / “Medium” / “Hard” from uppercase difficulty
  const displayDifficulty =
    difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
  const difficultyColor =
    difficulty === 'EASY'
      ? 'green'
      : difficulty === 'MEDIUM'
      ? 'orange'
      : 'red';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 40px 1fr 100px 60px 200px',
        alignItems: 'start',
        padding: '12px 0',
        borderBottom: '1px solid #eee',
      }}
    >
      {/* Solved checkbox icon as a button */}
      <button
        onClick={handleToggleSolved}
        title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          margin: 0,
          outline: 'none',
          color: isSolved ? 'green' : '#bbb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onMouseDown={(e) => e.preventDefault()} // prevent focus outline
      >
        {isSolved ? <FaCheckCircle size={20} /> : <FaRegCircle size={20} />}
      </button>

      {/* Star icon as a button */}
      <button
        onClick={handleToggleStar}
        title={isStarred ? 'Unstar this problem' : 'Star this problem'}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          margin: 0,
          outline: 'none',
          color: isStarred ? 'gold' : '#bbb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {isStarred ? <FaStar size={18} /> : <FaRegStar size={18} />}
      </button>

      {/* Problem title + LeetCode link */}
      <div style={{ margin: '0 8px' }}>
        <a
          href={leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontWeight: '500',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </a>
      </div>

      {/* Difficulty label */}
      <div
        style={{
          textAlign: 'center',
          color: difficultyColor,
          fontWeight: '500',
          textTransform: 'capitalize',
        }}
      >
        {displayDifficulty}
      </div>

      {/* NeetCode video link */}
      <div style={{ textAlign: 'center' }}>
        <a
          href={neetCodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Watch solution video"
          style={{ fontSize: '18px', color: '#0070f3' }}
        >
          🎥
        </a>
      </div>

      {/* Notes textarea */}
      <div>
        <textarea
          style={{
            width: '100%',
            minHeight: 40,
            fontFamily: 'inherit',
            fontSize: '14px',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value)}
          onBlur={handleNoteBlur}
          placeholder="Your notes…"
        />
        {savingNote && (
          <div style={{ fontSize: 12, color: '#777', marginTop: '4px' }}>
            Saving…
          </div>
        )}
      </div>
    </div>
  );
};

ProblemRow.propTypes = {
  problem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    leetcodeUrl: PropTypes.string.isRequired,
    neetCodeUrl: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(['EASY', 'MEDIUM', 'HARD']).isRequired,
    isSolved: PropTypes.bool.isRequired,
    isStarred: PropTypes.bool.isRequired,
    // if your Problem object has a `topic` field, add it here:
    topic: PropTypes.string,
  }).isRequired,
  note: PropTypes.string,
  savingNote: PropTypes.bool.isRequired,
  onNoteChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ProblemRow;
