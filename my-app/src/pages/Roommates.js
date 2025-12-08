import React, { useState, useEffect } from 'react';
import { useTestCase } from '../context/TestCaseContext';
import { api } from '../services/api';
import GraphVisualization from '../components/GraphVisualization';
import './Roommates.css';

function Roommates() {
  const { selectedTestCase } = useTestCase();
  const [roommateGraph, setRoommateGraph] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRoommateGraph = async () => {
      if (!selectedTestCase) {
        setRoommateGraph({ nodes: [], links: [] });
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await api.getRoommates(selectedTestCase);
        setRoommateGraph(data);
      } catch (err) {
        console.error('Error loading roommate graph:', err);
        setError('Failed to load roommate data. Make sure the Java backend is running.');
      } finally {
        setLoading(false);
      }
    };

    loadRoommateGraph();
  }, [selectedTestCase]);

  if (!selectedTestCase) {
    return (
      <div className="roommates-container">
        <h1>Roommates</h1>
        <div className="roommates-message">
          <p>Please select a test case from the Home page first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="roommates-container">
      <h1>Roommates</h1>
      <p className="roommates-description">
        Roommate pairs calculated using the Gale-Shapley algorithm from Java backend.
      </p>

      {loading && (
        <div className="loading-message">Loading roommate pairs from Java backend...</div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      {!loading && !error && (
        <div className="roommate-graph-section">
          <GraphVisualization 
            graphData={roommateGraph} 
            title="Roommate Pairings (Gale-Shapley Algorithm)"
            showWeights={false}
          />
          
          {roommateGraph.links && roommateGraph.links.length > 0 && (
            <div className="roommate-pairs-list">
              <h3>Roommate Pairs</h3>
              <div className="pairs-grid">
                {roommateGraph.links.map((link, index) => {
                  const student1 = roommateGraph.nodes.find(n => n.id === link.source);
                  const student2 = roommateGraph.nodes.find(n => n.id === link.target);
                  return (
                    <div key={index} className="pair-card">
                      <div className="pair-student">
                        <strong>{student1?.name}</strong>
                        <span>{student1?.major}</span>
                      </div>
                      <div className="pair-connector">↔</div>
                      <div className="pair-student">
                        <strong>{student2?.name}</strong>
                        <span>{student2?.major}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {roommateGraph.links && roommateGraph.links.length === 0 && (
            <div className="no-pairs-message">
              <p>No roommate pairs found for this test case.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Roommates;
