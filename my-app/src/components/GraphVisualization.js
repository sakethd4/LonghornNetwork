import React, { useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './GraphVisualization.css';

function GraphVisualization({ graphData, title, showWeights = true }) {
  const [hoverNode, setHoverNode] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return <div className="graph-placeholder">No graph data available</div>;
  }

  return (
    <div className="graph-visualization-container">
      {title && <h3 className="graph-title">{title}</h3>}
      <div className="graph-wrapper">
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={node => `${node.name}\n${node.major}\nAge: ${node.age}, Year: ${node.year}`}
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
          linkLabel={link => showWeights ? `Connection Strength: ${link.weight}` : 'Roommate Pair'}
          linkWidth={link => showWeights ? Math.max(2, link.weight / 2) : 3}
          linkColor={link => {
            if (showWeights) {
              // Color edges based on weight
              if (link.weight >= 6) return '#4caf50'; // Green for strong connections
              if (link.weight >= 3) return '#ff9800'; // Orange for medium connections
              return '#9e9e9e'; // Gray for weak connections
            } else {
              // For roommate pairs, use a distinct color
              return '#2196f3'; // Blue for roommate connections
            }
          }}
          linkDirectionalArrowLength={showWeights ? 3 : 0}
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
        
        {/* Hover tooltip */}
        {hoverNode && (
          <div 
            className="node-tooltip"
            style={{
              position: 'absolute',
              left: `${(hoverNode.x || 0) + 10}px`,
              top: `${(hoverNode.y || 0) - 10}px`,
              transform: 'translateY(-100%)',
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
                {hoverNode.gender && <p><strong>Gender:</strong> {hoverNode.gender}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GraphVisualization;

