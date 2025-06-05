// frontend/src/components/NotesSidePanel.js
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const NotesSidePanel = ({ problem, currentNote, isOpen, onClose, onSaveNote, isSaving }) => {
  const [editedNote, setEditedNote] = useState('');
  const textareaRef = useRef(null);

  // Log props on every render for debugging
  useEffect(() => {
    console.log("NotesSidePanel Props: isOpen:", isOpen, "Problem:", problem, "CurrentNote:", currentNote, "isSaving:", isSaving);
  });

  useEffect(() => {
    if (problem && isOpen) {
      setEditedNote(currentNote || '');
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [problem, currentNote, isOpen]);

  if (!isOpen) { // Keep this check: if not open, don't render anything from the panel.
    return null;
  }

  const handleSave = () => {
    if (onSaveNote && problem) {
      onSaveNote(problem.id, editedNote);
    }
  };

  const panelStyle = {
    position: 'fixed', top: 0, right: 0, width: '450px', maxWidth: '95vw', height: '100vh',
    backgroundColor: '#ffffff', boxShadow: '-6px 0px 18px rgba(0,0,0,0.12)', zIndex: 1100,
    transform: 'translateX(0)', // Assumes isOpen is true if this component renders past the null check
    transition: 'transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
    display: 'flex', flexDirection: 'column', padding: '25px', boxSizing: 'border-box',
  };

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1090,
    opacity: 1, visibility: 'visible', // Assumes isOpen is true
    transition: 'opacity 0.35s ease-in-out, visibility 0.35s ease-in-out',
  };

  const headerStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #e9ecef',
  };

  const titleStyle = { fontSize: '22px', fontWeight: '600', color: '#212529', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
  const textareaStyle = {
    flexGrow: 1, width: '100%', padding: '15px', border: '1px solid #ced4da',
    borderRadius: '6px', fontSize: '1rem',
    fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    lineHeight: '1.7', resize: 'none', minHeight: '300px', marginBottom: '25px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
    transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out',
  };
  const buttonBaseStyle = {
    padding: '12px 20px', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer',
    border: 'none', fontWeight: '500', transition: 'background-color 0.2s ease, opacity 0.2s ease',
  };
  const saveButtonStyle = { ...buttonBaseStyle, backgroundColor: isSaving ? '#adb5bd' : '#007bff', color: 'white', marginRight: '12px', opacity: isSaving ? 0.7 : 1 };
  const closeButtonStyle = { ...buttonBaseStyle, backgroundColor: '#6c757d', color: 'white' };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} aria-hidden="true"></div>
      <div style={panelStyle} role="dialog" aria-labelledby="notes-panel-title" aria-modal="true">
        <div style={headerStyle}>
          <h3 id="notes-panel-title" style={titleStyle}>
            Notes: {problem ? problem.title : 'Loading problem...'}
          </h3>
          <button onClick={onClose} style={{...buttonBaseStyle, backgroundColor: 'transparent', color: '#495057', fontSize: '28px', padding: '0 8px', lineHeight: '1' }} title="Close panel" aria-label="Close notes panel">
            &times;
          </button>
        </div>

        {problem ? (
          <>
            <textarea ref={textareaRef} style={textareaStyle} value={editedNote} onChange={(e) => setEditedNote(e.target.value)} placeholder={`Enter your notes for "${problem.title || ''}" here...`} disabled={isSaving} aria-label={`Notes for problem ${problem.title || ''}`} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
              <button onClick={handleSave} style={saveButtonStyle} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Notes'}
              </button>
              <button onClick={onClose} style={closeButtonStyle} disabled={isSaving}>
                Close
              </button>
            </div>
          </>
        ) : (
          <p style={{flexGrow: 1, textAlign: 'center', color: '#6c757d', marginTop: '30px'}}>Details not available for selected problem.</p>
        )}
      </div>
    </>
  );
};

NotesSidePanel.propTypes = {
  problem: PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, title: PropTypes.string }),
  currentNote: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaveNote: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

NotesSidePanel.defaultProps = { problem: null, currentNote: '', isSaving: false };

export default NotesSidePanel;
