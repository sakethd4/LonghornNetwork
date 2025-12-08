import React, { useState, useEffect, useMemo } from 'react';
import { useTestCase } from '../context/TestCaseContext';
import { api } from '../services/api';
import './Internships.css';

function Internships() {
  const { testCaseData, selectedTestCase } = useTestCase();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedInternship, setSelectedInternship] = useState('');
  const [referralPath, setReferralPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all unique internships from all students
  const allInternships = useMemo(() => {
    if (!testCaseData) return [];
    const internships = new Set();
    testCaseData.forEach(student => {
      (student.previousInternships || []).forEach(internship => {
        if (internship && internship !== "None") {
          internships.add(internship);
        }
      });
    });
    return Array.from(internships).sort();
  }, [testCaseData]);

  // Find referral path when both student and internship are selected
  useEffect(() => {
    const findPath = async () => {
      if (!selectedStudent || !selectedInternship || !selectedTestCase) {
        setReferralPath(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await api.findReferralPath(selectedTestCase, selectedStudent, selectedInternship);
        console.log('Referral path data received:', data);
        setReferralPath(data);
        // If path is empty, show a message
        if (data.path && data.path.length === 0) {
          setError(`No referral path found from ${selectedStudent} to someone who worked at ${selectedInternship}.`);
        }
      } catch (err) {
        console.error('Error finding referral path:', err);
        setError(err.message || 'Failed to find referral path. Make sure the Java backend is running.');
        setReferralPath(null);
      } finally {
        setLoading(false);
      }
    };

    findPath();
  }, [selectedStudent, selectedInternship, selectedTestCase]);

  if (!testCaseData || !selectedTestCase) {
    return (
      <div className="internships-container">
        <h1>Internships</h1>
        <div className="internships-message">
          <p>Please select a test case from the Home page first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="internships-container">
      <h1>Internships</h1>
      <p className="internships-description">
        Find the optimal referral path from a student to someone who has worked at a specific company.
      </p>

      <div className="internships-controls">
        <div className="control-group">
          <label htmlFor="student-select">Select a Student:</label>
          <select
            id="student-select"
            value={selectedStudent}
            onChange={(e) => {
              setSelectedStudent(e.target.value);
              setReferralPath(null);
              setError(null);
            }}
            className="internship-dropdown"
          >
            <option value="">-- Select a student --</option>
            {testCaseData.map((student, index) => (
              <option key={index} value={student.name}>
                {student.name} ({student.major})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="internship-select">Select an Internship:</label>
          <select
            id="internship-select"
            value={selectedInternship}
            onChange={(e) => {
              setSelectedInternship(e.target.value);
              setReferralPath(null);
              setError(null);
            }}
            className="internship-dropdown"
          >
            <option value="">-- Select an internship --</option>
            {allInternships.map((internship, index) => (
              <option key={index} value={internship}>
                {internship}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading-message">Finding optimal referral path...</div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      {referralPath && !loading && (
        <div className="referral-path-section">
          {referralPath.path && Array.isArray(referralPath.path) && referralPath.path.length > 0 ? (
            <>
              <h2>Referral Path Found!</h2>
              <p className="path-info">
                Path length: {referralPath.length} {referralPath.length === 1 ? 'student' : 'students'}
              </p>
              <div className="path-visualization">
                {referralPath.path.map((student, index) => (
                  <React.Fragment key={index}>
                    <div className="path-student-card">
                      <div className="student-header">
                        <h3>{student.name}</h3>
                        {index === 0 && <span className="path-label start">START</span>}
                        {index === referralPath.path.length - 1 && (
                          <span className="path-label end">TARGET</span>
                        )}
                      </div>
                      <div className="student-details">
                        <p><strong>Major:</strong> {student.major}</p>
                        <p><strong>Age:</strong> {student.age}</p>
                        <p><strong>Year:</strong> {student.year}</p>
                        <p><strong>GPA:</strong> {student.gpa}</p>
                        <div className="internships-list">
                          <strong>Previous Internships:</strong>
                          <ul>
                            {student.previousInternships && student.previousInternships.length > 0 ? (
                              student.previousInternships.map((internship, i) => (
                                <li key={i} className={internship === selectedInternship ? 'highlight' : ''}>
                                  {internship}
                                  {internship === selectedInternship && ' ✓'}
                                </li>
                              ))
                            ) : (
                              <li>None</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {index < referralPath.path.length - 1 && (
                      <div className="path-arrow">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : (
            <div className="no-path-message">
              <h2>No Referral Path Found</h2>
              <p>There is no connection path from {selectedStudent} to someone who has worked at {selectedInternship}.</p>
            </div>
          )}
        </div>
      )}

      {!selectedStudent && !selectedInternship && !loading && (
        <div className="info-message">
          <p>Please select both a student and an internship to find the referral path.</p>
        </div>
      )}
    </div>
  );
}

export default Internships;
