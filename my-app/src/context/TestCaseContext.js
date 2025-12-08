import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const TestCaseContext = createContext();

export const useTestCase = () => {
  const context = useContext(TestCaseContext);
  if (!context) {
    throw new Error('useTestCase must be used within a TestCaseProvider');
  }
  return context;
};

export const TestCaseProvider = ({ children }) => {
  const [testCaseData, setTestCaseData] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [useBackend, setUseBackend] = useState(true); // Toggle to use backend or static files

  const loadTestCase = async (testCaseNumber) => {
    // If clicking the same test case, deselect it
    if (selectedTestCase === testCaseNumber) {
      setTestCaseData(null);
      setSelectedTestCase(null);
      return;
    }

    try {
      let data;
      if (useBackend) {
        // Use Java backend
        data = await api.getTestCase(testCaseNumber);
      } else {
        // Fallback to static JSON files
        const response = await fetch(`/testcase${testCaseNumber}.json`);
        if (!response.ok) {
          throw new Error('Failed to load test case data');
        }
        data = await response.json();
      }
      setTestCaseData(data);
      setSelectedTestCase(testCaseNumber);
    } catch (error) {
      console.error('Error loading test case data:', error);
      // Fallback to static files if backend fails
      if (useBackend) {
        try {
          const response = await fetch(`/testcase${testCaseNumber}.json`);
          if (response.ok) {
            const data = await response.json();
            setTestCaseData(data);
            setSelectedTestCase(testCaseNumber);
            console.warn('Backend unavailable, using static files');
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      setTestCaseData(null);
      setSelectedTestCase(null);
    }
  };

  return (
    <TestCaseContext.Provider value={{ testCaseData, selectedTestCase, loadTestCase }}>
      {children}
    </TestCaseContext.Provider>
  );
};

