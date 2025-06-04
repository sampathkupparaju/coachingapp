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
    isSolved: initialSolved,
    isStarred: initialStarred,
  } = problem;

  const [isSolved, setIsSolved] = useState(initialSolved);
  const [isStarred, setIsStarred] = useState(initialStarred);
  const [localNote, setLocalNote] = useState(note);

  useEffect(() => {
    setIsSolved(initialSolved);
    setIsStarred(initialStarred);
  }, [initialSolved, initialStarred]);

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const baseUrl = process.env.REACT_APP_API_URL.replace(/\/$/, '');
  const token = localStorage.getItem('jwt-token');

  const handleToggleSolved = async () => {
    try {
      const resp = await axios.put(
        `${baseUrl}/api/problems/${id}/solve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsSolved(resp.data.isSolved);
      onToggle(id, resp.data.isSolved, resp.data.isStarred);
    } catch (err) {
      console.error('Error toggling solved:', err);
    }
  };

  const handleToggleStar = async () => {
    try {
      const resp = await axios.put(
        `${baseUrl}/api/problems/${id}/star`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsStarred(resp.data.isStarred);
      onToggle(id, resp.data.isSolved, resp.data.isStarred);
    } catch (err) {
      console.error('Error toggling starred:', err);
    }
  };

  const handleNoteBlur = () => {
    if (localNote !== note) {
      onNoteChange(id, localNote);
    }
  };

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
      <div
        style={{ textAlign: 'center', cursor: 'pointer' }}
        onClick={handleToggleSolved}
        title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
      >
        {isSolved ? (
          <FaCheckCircle color='green' />
        ) : (
          <FaRegCircle color='#bbb' />
        )}
      </div>

      <div
        style={{ textAlign: 'center', cursor: 'pointer' }}
        onClick={handleToggleStar}
        title={isStarred ? 'Unstar this problem' : 'Star this problem'}
      >
        {isStarred ? <FaStar color='gold' /> : <FaRegStar color='#bbb' />}
      </div>

      <div style={{ margin: '0 8px' }}>
        <a
          href={leetcodeUrl}
          target='_blank'
          rel='noopener noreferrer'
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontWeight: '500',
          }}
        >
          {title}
        </a>
      </div>

      <div
        style={{
          textAlign: 'center',
          color: difficultyColor,
          fontWeight: '500',
        }}
      >
        {displayDifficulty}
      </div>

      <div style={{ textAlign: 'center' }}>
        <a
          href={neetCodeUrl}
          target='_blank'
          rel='noopener noreferrer'
          title='Watch solution video'
          style={{ fontSize: '18px', color: '#0070f3' }}
        >
          🎥
        </a>
      </div>

      <div>
        <textarea
          style={{ width: '100%', minHeight: 40 }}
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value)}
          onBlur={handleNoteBlur}
          placeholder='Your notes…'
        />
        {savingNote && (
          <div style={{ fontSize: 12, color: '#777' }}>Saving…</div>
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
  }).isRequired,
  note: PropTypes.string,
  savingNote: PropTypes.bool.isRequired,
  onNoteChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ProblemRow;
