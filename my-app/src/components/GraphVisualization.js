import React, { useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './GraphVisualization.css';

function GraphVisualization({ graphData, title, showWeights = true }) {
  const [hoverNode, setHoverNode] = useState(null);
  const graphWrapperRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0, transform: 'translateY(-100%)' });

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return <div className="graph-placeholder">No graph data available</div>;
  }

  return (
    <div className="graph-visualization-container">
      {title && <h3 className="graph-title">{title}</h3>}
      <div className="graph-wrapper" ref={graphWrapperRef}>
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
            if (node && graphWrapperRef.current) {
              const container = graphWrapperRef.current;
              const containerWidth = container.offsetWidth;
              const containerHeight = container.offsetHeight;
              const tooltipWidth = 400; // max-width of tooltip
              const tooltipHeight = 200; // approximate height
              const padding = 20;
              
              // ForceGraph2D uses center-origin coordinates, convert to top-left origin
              let left = (node.x || 0) + containerWidth / 2;
              let top = (node.y || 0) + containerHeight / 2;
              
              // Adjust to keep tooltip within bounds
              // Try to position above the node first
              let adjustedLeft = left + 10;
              let adjustedTop = top - 10;
              let transform = 'translateY(-100%)';
              
              // Check right boundary
              if (adjustedLeft + tooltipWidth > containerWidth - padding) {
                adjustedLeft = containerWidth - tooltipWidth - padding;
              }
              
              // Check left boundary
              if (adjustedLeft < padding) {
                adjustedLeft = padding;
              }
              
              // Check top boundary - if tooltip would go above, position below instead
              if (adjustedTop - tooltipHeight < padding) {
                adjustedTop = top + 30; // Position below node
                transform = 'translateY(0)';
              }
              
              // Check bottom boundary
              if (adjustedTop + tooltipHeight > containerHeight - padding) {
                adjustedTop = containerHeight - tooltipHeight - padding;
              }
              
              setTooltipPosition({
                left: adjustedLeft,
                top: adjustedTop,
                transform: transform
              });
            }
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
              left: `${tooltipPosition.left}px`,
              top: `${tooltipPosition.top}px`,
              transform: tooltipPosition.transform || 'translateY(-100%)',
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

