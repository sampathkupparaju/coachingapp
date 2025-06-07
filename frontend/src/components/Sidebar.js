// frontend/src/components/Sidebar.js
import React from 'react';
import PropTypes from 'prop-types';

// Simple SVG icons for demonstration. You can replace these with a library like react-icons.
const TrackerIcon = ({ color = "currentColor" }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
const TipsIcon = ({ color = "currentColor" }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>;
const NotesIcon = ({ color = "currentColor" }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const SettingsIcon = ({ color = "currentColor" }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

const Sidebar = ({ activeSection, onSectionChange }) => {
  const sections = [
    { name: "Problem Tracker", icon: <TrackerIcon /> },
    { name: "DSA Tips & Tricks", icon: <TipsIcon /> },
    { name: "Course Notes", icon: <NotesIcon /> },
    { name: "Settings", icon: <SettingsIcon /> }
  ];

  const sidebarStyle = {
    width: '240px',
    height: 'calc(100vh - 65px)', // Assuming Header is 65px tall
    // New background: A modern, dark charcoal gradient
    background: 'linear-gradient(to bottom, #1f2937, #111827)', // From Tailwind gray-800 to gray-900
    color: '#d1d5db', // A light gray for default text/icon color
    position: 'fixed',
    top: '65px', // Position below the header
    left: 0,
    paddingTop: '20px', // Space at the top of the nav list
    borderRight: '1px solid #374151', // A slightly lighter border (gray-700)
    display: 'flex',
    flexDirection: 'column',
  };

  const linkStyle = (sectionName) => {
    const isActive = activeSection === sectionName;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '13px 25px',
      // Active link is white, inactive is a softer gray
      color: isActive ? '#ffffff' : '#9ca3af', // gray-400 for inactive
      // Active background is a very subtle overlay
      backgroundColor: isActive ? 'rgba(75, 85, 99, 0.2)' : 'transparent', // gray-600 with opacity
      textDecoration: 'none',
      fontWeight: isActive ? '600' : '500',
      // Active accent border is a bright blue
      borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent', // blue-500
      transition: 'background-color 0.2s ease, color 0.2s ease',
      cursor: 'pointer',
      fontSize: '15px',
      // Adjust padding to account for border
      paddingLeft: isActive ? '21px' : '25px',
    };
  };

  return (
    <aside style={sidebarStyle}>
      <nav>
        {sections.map(section => (
          <div
            key={section.name}
            style={linkStyle(section.name)}
            onClick={(e) => { e.preventDefault(); onSectionChange(section.name); }}
            // We can't use :hover in inline styles, so this is a simple JS alternative
            onMouseOver={(e) => {
              if (activeSection !== section.name) {
                e.currentTarget.style.backgroundColor = 'rgba(55, 65, 81, 0.4)'; // gray-600 with higher opacity
                e.currentTarget.style.color = '#f9fafb'; // gray-50
              }
            }}
            onMouseOut={(e) => {
              if (activeSection !== section.name) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9ca3af'; // Reset to inactive color
              }
            }}
            role="link"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') onSectionChange(section.name); }}
          >
            {/* The icon's color will be inherited from the parent div's color style */}
            {section.icon}
            <span>{section.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
};

export default Sidebar;
