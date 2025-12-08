import React, { useState, useMemo } from 'react';
import { useTestCase } from '../context/TestCaseContext';
import './Chat.css';

function Friends() {
  const { testCaseData } = useTestCase();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleStudentSelect = (studentName) => {
    const student = testCaseData.find(s => s.name === studentName);
    setSelectedStudent(student);
  };

  // Get friends list for the selected student
  const getFriendsList = () => {
    if (!selectedStudent) return [];
    return selectedStudent.friends || [];
  };

  const friendsList = getFriendsList();

  if (!testCaseData) {
    return (
      <div className="chat-container">
        <div className="chat-message">
          <p>Please select a test case from the Home page first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <h1>Friends</h1>
      
      <div className="chat-search-section">
        <div className="student-dropdown-container">
          <label htmlFor="student-select">Select a student:</label>
          <select
            id="student-select"
            value={selectedStudent?.name || ''}
            onChange={(e) => handleStudentSelect(e.target.value)}
            className="student-dropdown"
          >
            <option value="">-- Select a student --</option>
            {testCaseData && testCaseData.map((student, index) => (
              <option key={index} value={student.name}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedStudent && (
        <div className="selected-student-section">
          <div className="selected-student-info">
            <h2>Friends of {selectedStudent.name}</h2>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="chat-messages-container">
          {friendsList.length === 0 ? (
            <div className="no-chat-message">
              <p>No friends available for {selectedStudent.name}.</p>
            </div>
          ) : (
            <div className="friends-list">
              {friendsList.map((friendName, index) => {
                const friend = testCaseData.find(s => s.name === friendName);
                if (!friend) return null;
                
                return (
                  <div key={index} className="friend-card">
                    <h3>{friend.name}</h3>
                    <div className="friend-details">
                      <p><strong>Age:</strong> {friend.age}</p>
                      <p><strong>Gender:</strong> {friend.gender}</p>
                      <p><strong>Year:</strong> {friend.year}</p>
                      <p><strong>Major:</strong> {friend.major}</p>
                      <p><strong>GPA:</strong> {friend.gpa}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!selectedStudent && (
        <div className="chat-message">
          <p>Please select a student from the dropdown above to view their friends.</p>
        </div>
      )}
    </div>
  );
}

export default Friends;
