import React, { useState } from 'react';
import { useTestCase } from '../context/TestCaseContext';
import StudentGraph from '../components/StudentGraph';
import './Home.css';

function Home() {
  const { testCaseData, selectedTestCase, loadTestCase } = useTestCase();
  const [loading, setLoading] = useState(false);

  const handleTestCaseSelect = async (testCaseNumber) => {
    setLoading(true);
    await loadTestCase(testCaseNumber);
    setLoading(false);
  };

  const backgroundStyle = {
    '--home-bg': `url(${process.env.PUBLIC_URL}/campus-background.jpg)`,
  };

  return (
    <div className="home-container" style={backgroundStyle}>
      <h1 className="home-title">Longhorn Network</h1>
      
      <div className="testcase-bar">
        <button
          className={`testcase-button ${selectedTestCase === 1 ? 'selected' : ''}`}
          onClick={() => handleTestCaseSelect(1)}
        >
          Testcase 1
        </button>
        <button
          className={`testcase-button ${selectedTestCase === 2 ? 'selected' : ''}`}
          onClick={() => handleTestCaseSelect(2)}
        >
          Testcase 2
        </button>
        <button
          className={`testcase-button ${selectedTestCase === 3 ? 'selected' : ''}`}
          onClick={() => handleTestCaseSelect(3)}
        >
          Testcase 3
        </button>
      </div>

      {loading && (
        <div className="loading-message">Loading test case data...</div>
      )}

      {testCaseData && !loading && (
        <div className="testcase-data-container">
          <h2 className="testcase-data-title">Test Case {selectedTestCase} Data</h2>
          
          <div className="graph-section">
            <h3 className="graph-section-title">Student Connection Graph</h3>
            <StudentGraph students={testCaseData} />
          </div>

          <div className="students-list">
            {testCaseData.map((student, index) => (
              <div key={index} className="student-card">
                <h3>{student.name}</h3>
                <div className="student-details">
                  <p><strong>Age:</strong> {student.age}</p>
                  <p><strong>Gender:</strong> {student.gender}</p>
                  <p><strong>Year:</strong> {student.year}</p>
                  <p><strong>Major:</strong> {student.major}</p>
                  <p><strong>GPA:</strong> {student.gpa}</p>
                  <p><strong>Roommate Preferences:</strong> {student.roommatePreferences.join(', ') || 'None'}</p>
                  <p><strong>Previous Internships:</strong> {student.previousInternships.join(', ') || 'None'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

