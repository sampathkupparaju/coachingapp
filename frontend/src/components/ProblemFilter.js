import React from "react";

const ProblemFilter = ({ topics, selectedTopic, onSelectTopic }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <label>Filter by topic: </label>
      <select
        value={selectedTopic}
        onChange={(e) => onSelectTopic(e.target.value)}
        style={{ marginLeft: 8 }}
      >
        <option value="">All</option>
        {topics.map((topic) => (
          <option key={topic} value={topic}>
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProblemFilter;
