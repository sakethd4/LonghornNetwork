// API service to communicate with Java backend
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Get test case data (from Main.java)
  getTestCase: async (testCaseNumber) => {
    const response = await fetch(`${API_BASE_URL}/testcase/${testCaseNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to load test case ${testCaseNumber}`);
    }
    return response.json();
  },

  // Get graph data (uses StudentGraph.java)
  getGraph: async (testCaseNumber) => {
    const response = await fetch(`${API_BASE_URL}/graph/${testCaseNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to load graph for test case ${testCaseNumber}`);
    }
    return response.json();
  },

  // Get roommate pairs graph (uses GaleShapley.java)
  getRoommates: async (testCaseNumber) => {
    const response = await fetch(`${API_BASE_URL}/roommates/${testCaseNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to load roommates for test case ${testCaseNumber}`);
    }
    return response.json();
  },

  // Get students
  getStudents: async (testCaseNumber) => {
    const response = await fetch(`${API_BASE_URL}/students/?testcase=${testCaseNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to load students for test case ${testCaseNumber}`);
    }
    return response.json();
  },

  // Find referral path (uses ReferralPathFinder.java)
  findReferralPath: async (testCaseNumber, studentName, companyName) => {
    const encodedStudent = encodeURIComponent(studentName);
    const encodedCompany = encodeURIComponent(companyName);
    try {
      const response = await fetch(`${API_BASE_URL}/referral/?testcase=${testCaseNumber}&student=${encodedStudent}&company=${encodedCompany}`);
      if (!response.ok) {
        let errorMessage = `Failed to find referral path (Status: ${response.status})`;
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (error) {
      if (error.message.includes('fetch')) {
        throw new Error('Failed to connect to backend. Make sure the Java server is running on http://localhost:8080');
      }
      throw error;
    }
  }
};

