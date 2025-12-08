import React, { useState, useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { api } from '../services/api';
import { useTestCase } from '../context/TestCaseContext';
import './StudentGraph.css';

function StudentGraph({ students, useJavaBackend = true }) {
  const { selectedTestCase } = useTestCase();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [hoverNode, setHoverNode] = useState(null);
  const graphWrapperRef = useRef(null);

  useEffect(() => {
    const loadGraphData = async () => {
      if (!selectedTestCase) {
        setGraphData({ nodes: [], links: [] });
        return;
      }

      if (useJavaBackend) {
        // Use Java backend (StudentGraph.java)
        setLoading(true);
        try {
          const data = await api.getGraph(selectedTestCase);
          setGraphData(data);
        } catch (error) {
          console.error('Error loading graph from backend, falling back to client-side calculation:', error);
          // Fallback to client-side calculation
          calculateGraphFromStudents(students);
        } finally {
          setLoading(false);
        }
      } else {
        // Calculate on client side (fallback)
        calculateGraphFromStudents(students);
      }
    };

    loadGraphData();
  }, [selectedTestCase, students, useJavaBackend]);

  // Fallback: Calculate connection strength between two students (matching Java logic)
  const calculateConnectionStrength = (s1, s2) => {
    let strength = 0;

    // Check if they are roommates (+4) - if roommate data exists in JSON
    if (s1.roommate === s2.name || s2.roommate === s1.name) {
      strength += 4;
    }

    // Check for shared internships (+3 for each shared internship)
    const s1Internships = s1.previousInternships || [];
    const s2Internships = s2.previousInternships || [];
    s1Internships.forEach(internship => {
      if (s2Internships.includes(internship) && internship !== "None") {
        strength += 3;
      }
    });

    // Check for same major (+2)
    if (s1.major === s2.major) {
      strength += 2;
    }

    // Check for same age (+1)
    if (s1.age === s2.age) {
      strength += 1;
    }

    return strength;
  };

  // Fallback: Build graph data structure on client side
  const calculateGraphFromStudents = (students) => {
    if (!students || students.length === 0) {
      setGraphData({ nodes: [], links: [] });
      return;
    }

    const nodes = students.map((student) => ({
      id: student.name,
      name: student.name,
      major: student.major,
      age: student.age,
      year: student.year,
      gpa: student.gpa
    }));

    const links = [];
    const processedPairs = new Set();

    // Create all possible pairs and calculate connection strength
    for (let i = 0; i < students.length; i++) {
      for (let j = i + 1; j < students.length; j++) {
        const s1 = students[i];
        const s2 = students[j];
        const weight = calculateConnectionStrength(s1, s2);

        // Only add edge if weight > 0 (matching Java logic)
        if (weight > 0) {
          const pairKey = `${s1.name}-${s2.name}`;
          if (!processedPairs.has(pairKey)) {
            links.push({
              source: s1.name,
              target: s2.name,
              weight: weight,
              value: weight
            });
            processedPairs.add(pairKey);
          }
        }
      }
    }

    setGraphData({ nodes, links });
  };

  if (loading) {
    return <div className="graph-placeholder">Loading graph from Java backend...</div>;
  }

  if (!graphData || graphData.nodes.length === 0) {
    return <div className="graph-placeholder">No graph data available</div>;
  }

  return (
    <div className="graph-container">
      <div className="graph-wrapper" ref={graphWrapperRef} style={{ position: 'relative' }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={() => null}
          nodeColor={node => {
            // Color nodes by major (different colors for different majors)
            const colors = [
              '#61dafb', '#4caf50', '#ff9800', '#9c27b0', 
              '#f44336', '#2196f3', '#ffeb3b', '#00bcd4'
            ];
            const majorHash = (node.major || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return colors[majorHash % colors.length];
          }}
          nodeVal={node => {
            // Node size based on number of connections
            const connections = (graphData.links || []).filter(
              link => link.source === node.id || link.target === node.id
            ).length;
            return 8 + connections * 2;
          }}
          linkLabel={link => `Connection Strength: ${link.weight}`}
          linkWidth={link => Math.max(2, link.weight / 2)}
          linkColor={link => {
            // Color edges based on weight
            if (link.weight >= 6) return '#4caf50'; // Green for strong connections
            if (link.weight >= 3) return '#ff9800'; // Orange for medium connections
            return '#9e9e9e'; // Gray for weak connections
          }}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
          cooldownTicks={100}
          onNodeHover={node => {
            setHoverNode(node);
          }}
          onBackgroundClick={() => {
            setHoverNode(null);
          }}
          onNodeDragEnd={node => {
            node.fx = node.x;
            node.fy = node.y;
          }}
        />
        
        {/* Enhanced hover tooltip - fixed in top right */}
        {hoverNode && (
          <div 
            className="node-tooltip"
            style={{
              position: 'absolute',
              right: '20px',
              top: '20px',
              pointerEvents: 'none',
              zIndex: 1000
            }}
          >
            <div className="tooltip-content">
              <h4>{hoverNode.name}</h4>
              <div className="tooltip-details">
                <p><strong>Age:</strong> {hoverNode.age}</p>
                <p><strong>Major:</strong> {hoverNode.major}</p>
                <p><strong>Year:</strong> {hoverNode.year}</p>
                {hoverNode.gpa && <p><strong>GPA:</strong> {hoverNode.gpa}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="graph-legend">
        <h3>Graph Legend</h3>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#61dafb' }}></div>
          <span>Node: Student</span>
        </div>
        <div className="legend-item">
          <div className="legend-line strong"></div>
          <span>Edge Weight ≥ 6 (Strong Connection)</span>
        </div>
        <div className="legend-item">
          <div className="legend-line medium"></div>
          <span>Edge Weight 3-5 (Medium Connection)</span>
        </div>
        <div className="legend-item">
          <div className="legend-line weak"></div>
          <span>Edge Weight 1-2 (Weak Connection)</span>
        </div>
        <div className="legend-note">
          <p><strong>Connection Strength Calculation:</strong></p>
          <ul>
            <li>+3 for each shared internship</li>
            <li>+2 for same major</li>
            <li>+1 for same age</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentGraph;

