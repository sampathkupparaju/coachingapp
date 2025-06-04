// src/components/TopicSection.js
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ProblemRow from './ProblemRow';

const TopicSection = ({
  topicName,
  problems,
  notes,
  savingNotes,
  onNoteChange,
  onToggle,
}) => {
  const solvedCount = useMemo(
    () => problems.filter((p) => p.isSolved).length,
    [problems]
  );
  const total = problems.length;
  const percent = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

  return (
    <div style={{ marginBottom: '40px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#eef6ff',
          padding: '12px 16px',
          borderRadius: '4px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '8px',
        }}
      >
        <div style={{ fontSize: '18px' }}>{topicName}</div>
        <div style={{ fontSize: '16px' }}>
          ({solvedCount} / {total})
        </div>
      </div>

      <div
        style={{
          height: '8px',
          backgroundColor: '#ddd',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: '#4caf50',
          }}
        />
      </div>

      <div>
        {problems.map((p) => (
          <ProblemRow
            key={p.id}
            problem={p}
            note={notes[p.id] || ''}
            savingNote={!!savingNotes[p.id]}
            onNoteChange={onNoteChange}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};

TopicSection.propTypes = {
  topicName: PropTypes.string.isRequired,
  problems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      leetcodeUrl: PropTypes.string.isRequired,
      neetCodeUrl: PropTypes.string.isRequired,
      difficulty: PropTypes.oneOf(['EASY', 'MEDIUM', 'HARD']).isRequired,
      isSolved: PropTypes.bool.isRequired,
      isStarred: PropTypes.bool.isRequired,
    })
  ).isRequired,
  notes: PropTypes.object.isRequired,
  savingNotes: PropTypes.object.isRequired,
  onNoteChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default TopicSection;
