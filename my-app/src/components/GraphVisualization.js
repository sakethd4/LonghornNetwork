import React, { useState, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './GraphVisualization.css';

function GraphVisualization({ graphData, title, showWeights = true }) {
  const [hoverNode, setHoverNode] = useState(null);
  const graphWrapperRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (!logoRef.current) {
      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}/longhorn-logo.png`;
      logoRef.current = img;
    }
  }, []);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return <div className="graph-placeholder">No graph data available</div>;
  }

  return (
    <div className="graph-visualization-container">
      {title && <h3 className="graph-title">{title}</h3>}
      <div className="graph-wrapper" ref={graphWrapperRef}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={() => null}
          nodeCanvasObject={(node, ctx) => {
            const connections = (graphData.links || []).filter(
              link => link.source === node.id || link.target === node.id
            ).length;
            const size = 18 + connections * 2;
            const img = logoRef.current;

            if (img && img.complete) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
              ctx.clip();
              ctx.drawImage(img, node.x - size / 2, node.y - size / 2, size, size);
              ctx.restore();
            } else {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
              ctx.fillStyle = '#BF5700';
              ctx.fill();
            }
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            const connections = (graphData.links || []).filter(
              link => link.source === node.id || link.target === node.id
            ).length;
            const size = 18 + connections * 2;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size / 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();
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
        
        {/* Hover tooltip - fixed in top right */}
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

