import React, { useState, useMemo } from 'react';
import { useTestCase } from '../context/TestCaseContext';
import './Page.css';
import './Chat.css';

function Chat() {
  const { testCaseData } = useTestCase();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  // Get available recipients (other students) for the selected student
  const availableRecipients = useMemo(() => {
    if (!selectedStudent || !testCaseData) return [];
    return testCaseData.filter(student => student.name !== selectedStudent.name);
  }, [selectedStudent, testCaseData]);

  // Get chat history between selected student and recipient
  const getChatHistory = () => {
    if (!selectedStudent || !selectedRecipient) return [];

    const studentChatHistory = selectedStudent.chatHistory || {};
    const recipientChatHistory = selectedRecipient.chatHistory || {};
    
    // Get messages sent by selected student to recipient (stored in recipient's chat history)
    const messagesFromStudent = (recipientChatHistory[selectedStudent.name] || []).map(msg => ({
      text: msg,
      sender: selectedStudent.name,
      isFromSelected: true
    }));

    // Get messages sent by recipient to selected student (stored in selected student's chat history)
    const messagesFromRecipient = (studentChatHistory[selectedRecipient.name] || []).map(msg => ({
      text: msg,
      sender: selectedRecipient.name,
      isFromSelected: false
    }));

    // Combine and sort messages (assuming they're in chronological order)
    const allMessages = [...messagesFromStudent, ...messagesFromRecipient];
    return allMessages;
  };

  const chatMessages = getChatHistory();

  const handleStudentSelect = (studentName) => {
    const student = testCaseData.find(s => s.name === studentName);
    setSelectedStudent(student);
    setSelectedRecipient(null);
  };

  const handleRecipientSelect = (recipientName) => {
    const recipient = testCaseData.find(s => s.name === recipientName);
    setSelectedRecipient(recipient);
  };

  if (!testCaseData) {
    return (
      <div className="page-container chat-container">
        <h1>Chat</h1>
        <div className="chat-message">
          <p>Please select a test case from the Home page first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container chat-container">
      <h1>Chat</h1>
      
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
            <h2>Viewing chat history for: {selectedStudent.name}</h2>
            <div className="recipient-dropdown-container">
              <label htmlFor="recipient-select">Select a student to view chat with:</label>
              <select
                id="recipient-select"
                value={selectedRecipient?.name || ''}
                onChange={(e) => handleRecipientSelect(e.target.value)}
                className="recipient-dropdown"
              >
                <option value="">-- Select a student --</option>
                {availableRecipients.map((student, index) => (
                  <option key={index} value={student.name}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {!selectedStudent && (
        <div className="chat-message">
          <p>Please select a student from the dropdown above to view their chat history.</p>
        </div>
      )}
    
      {selectedStudent && selectedRecipient && (
        <div className="chat-messages-container">
          {chatMessages.length === 0 ? (
            <div className="no-chat-message">
              <p>No chat history available between {selectedStudent.name} and {selectedRecipient.name}.</p>
            </div>
          ) : (
            <div className="messages-list">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.isFromSelected ? 'message-right' : 'message-left'}`}
                >
                  <div className="message-content">
                    <div className="message-sender">{message.sender}</div>
                    <div className="message-text">{message.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedStudent && !selectedRecipient && (
        <div className="chat-message">
          <p>Please select a student from the dropdown above to view chat history.</p>
        </div>
      )}
    </div>
  );
}

export default Chat;
