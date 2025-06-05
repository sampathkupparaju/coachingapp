// frontend/src/components/ProblemFilter.js
import React from "react";
import PropTypes from 'prop-types';

const ProblemFilter = ({ topics, selectedTopic, onSelectTopic }) => {
  return (
    <div style={{
      marginBottom: '25px',
      padding: '15px 20px', // Adjusted padding
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      boxShadow: '0 2px 4px rgba(0,0,0,0.04)' // Softer shadow
    }}>
      <label
        htmlFor="topic-filter-select"
        style={{
          marginRight: '12px',
          fontWeight: '600',
          fontSize: '1rem', // Standardize font size
          color: '#343a40'
        }}
      >
        Filter by topic:
      </label>
      <select
        id="topic-filter-select"
        value={selectedTopic} // Expects "" for "All Topics"
        onChange={(e) => onSelectTopic(e.target.value)}
        style={{
          marginLeft: '8px',
          padding: '10px 15px',
          borderRadius: '6px',
          border: '1px solid #ced4da',
          minWidth: '220px', // Slightly wider
          fontSize: '0.95rem',
          backgroundColor: '#fff',
          cursor: 'pointer',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)', // Inner shadow for depth
          transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out'
        }}
      >
        <option value="">All Topics</option> {/* Value is empty string for "All" */}
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic.charAt(0).toUpperCase() + topic.slice(1)} {/* Capitalize topic names */}
          </option>
        ))}
      </select>
    </div>
  );
};

ProblemFilter.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTopic: PropTypes.string.isRequired,
  onSelectTopic: PropTypes.func.isRequired,
};

export default ProblemFilter;
