# Sources and References

This document cites all sources, libraries, frameworks, and documentation used in the development of the Longhorn Network React web application.

## Core Frameworks and Libraries

### React
- **Library**: React
- **Version**: ^19.2.1
- **Source**: https://react.dev/
- **License**: MIT
- **Usage**: Core framework for building the user interface

### React DOM
- **Library**: React DOM
- **Version**: ^19.2.1
- **Source**: https://react.dev/
- **License**: MIT
- **Usage**: DOM rendering for React components

### React Router DOM
- **Library**: react-router-dom
- **Version**: ^7.10.1
- **Source**: https://reactrouter.com/
- **License**: MIT
- **Usage**: Client-side routing and navigation between pages (Home, Chat, Friends, Roommates, Internships)
- **Documentation**: https://reactrouter.com/en/main

### React Force Graph 2D
- **Library**: react-force-graph-2d
- **Version**: ^1.29.0
- **Source**: https://github.com/vasturiano/react-force-graph
- **License**: MIT
- **Usage**: Interactive force-directed graph visualization for displaying student connections and roommate pairs
- **Documentation**: https://github.com/vasturiano/react-force-graph
- **Author**: Vasco Asturiano

### Web Vitals
- **Library**: web-vitals
- **Version**: ^2.1.4
- **Source**: https://github.com/GoogleChrome/web-vitals
- **License**: Apache-2.0
- **Usage**: Measuring web performance metrics (included by Create React App)
- **Documentation**: https://web.dev/vitals/

## Build Tools

### React Scripts
- **Tool**: react-scripts
- **Version**: 5.0.1
- **Source**: https://github.com/facebook/create-react-app
- **License**: MIT
- **Usage**: Build toolchain and development server for Create React App
- **Documentation**: https://create-react-app.dev/

### Create React App
- **Tool**: Create React App (CRA)
- **Source**: https://create-react-app.dev/
- **License**: MIT
- **Usage**: Project scaffolding and build configuration
- **Documentation**: https://create-react-app.dev/docs/getting-started

## Testing Libraries

### React Testing Library
- **Library**: @testing-library/react
- **Version**: ^16.3.0
- **Source**: https://testing-library.com/react
- **License**: MIT
- **Usage**: Component testing utilities

### Jest DOM
- **Library**: @testing-library/jest-dom
- **Version**: ^6.9.1
- **Source**: https://github.com/testing-library/jest-dom
- **License**: MIT
- **Usage**: Custom Jest matchers for DOM testing

### User Event
- **Library**: @testing-library/user-event
- **Version**: ^13.5.0
- **Source**: https://github.com/testing-library/user-event
- **License**: MIT
- **Usage**: Simulating user interactions in tests

## Backend Technologies

### Java HTTP Server
- **Technology**: com.sun.net.httpserver.HttpServer
- **Source**: Java Standard Library (JDK)
- **License**: Oracle Binary Code License Agreement / GPL v2
- **Usage**: Built-in HTTP server for creating REST API endpoints
- **Documentation**: https://docs.oracle.com/javase/8/docs/jre/api/net/httpserver/spec/

### Java Standard Libraries
- **Technology**: Java Collections Framework, java.util.concurrent
- **Source**: Java Standard Library (JDK)
- **Usage**: Data structures and concurrency utilities for backend server

## Design Patterns and Concepts

### React Hooks
- **Pattern**: useState, useEffect, useMemo, useContext, useRef
- **Source**: React Documentation
- **Reference**: https://react.dev/reference/react
- **Usage**: State management, side effects, memoization, context API, DOM references

### Context API
- **Pattern**: React Context for global state
- **Source**: React Documentation
- **Reference**: https://react.dev/reference/react/createContext
- **Usage**: Sharing test case data across components

### Component Composition
- **Pattern**: Reusable component architecture
- **Source**: React Best Practices
- **Reference**: https://react.dev/learn/passing-props-to-a-component
- **Usage**: Modular component structure (Navbar, StudentGraph, GraphVisualization, etc.)

## Graph Visualization Concepts

### Force-Directed Graph Layout
- **Algorithm**: Force-directed graph drawing
- **Concept**: Physics-based node positioning
- **Reference**: 
  - https://en.wikipedia.org/wiki/Force-directed_graph_drawing
  - D3.js force simulation concepts
- **Usage**: Automatic layout of student connection graphs

## CSS and Styling

### CSS Flexbox
- **Technology**: CSS Flexible Box Layout
- **Source**: W3C CSS Specification
- **Reference**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout
- **Usage**: Layout and alignment of components

### CSS Grid
- **Technology**: CSS Grid Layout
- **Source**: W3C CSS Specification
- **Reference**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- **Usage**: Responsive grid layouts for student cards and friend lists

### CSS Transitions and Animations
- **Technology**: CSS Transitions
- **Source**: W3C CSS Specification
- **Reference**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions
- **Usage**: Smooth hover effects and animations

## Web Standards

### Fetch API
- **Technology**: Fetch API
- **Source**: Web Standards (WHATWG)
- **Reference**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **Usage**: HTTP requests to Java backend

### JSON
- **Technology**: JSON (JavaScript Object Notation)
- **Source**: ECMA-404 Standard
- **Reference**: https://www.json.org/
- **Usage**: Data serialization between frontend and backend

### CORS (Cross-Origin Resource Sharing)
- **Technology**: CORS headers
- **Source**: W3C CORS Specification
- **Reference**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Usage**: Enabling cross-origin requests between React app and Java backend

# Images
 - **Reference** :https://www.utexas.edu/, main menu background
 - **Reference**: https://en.wikipedia.org/wiki/File:Texas_Longhorns_logo.svg, graph nodes
 

## Development Tools

### npm (Node Package Manager)
- **Tool**: npm
- **Source**: https://www.npmjs.com/
- **License**: Artistic License 2.0
- **Usage**: Package management and dependency installation

### Node.js
- **Runtime**: Node.js
- **Source**: https://nodejs.org/
- **License**: MIT
- **Usage**: JavaScript runtime for development server

## Documentation and Learning Resources

### React Documentation
- **Source**: https://react.dev/
- **Usage**: Component development, hooks, best practices

### React Router Documentation
- **Source**: https://reactrouter.com/en/main
- **Usage**: Routing implementation

### MDN Web Docs
- **Source**: https://developer.mozilla.org/
- **Usage**: CSS, JavaScript, and Web API references

### Stack Overflow
- **Source**: https://stackoverflow.com/
- **Usage**: Problem-solving and community solutions

## Code Structure and Architecture

### Component-Based Architecture
- **Pattern**: React component hierarchy
- **Reference**: React best practices
- **Usage**: Organized component structure (pages/, components/, context/, services/)

### Separation of Concerns
- **Pattern**: MVC-like separation
- **Reference**: Software engineering best practices
- **Usage**: Separate API service layer, context for state, components for UI

## License Summary

All open-source libraries used in this project are licensed under MIT or compatible licenses, allowing for commercial and private use. The Java Standard Library is subject to Oracle's licensing terms.

## Project-Specific Implementation Notes

### Custom Components Created
- **Navbar**: Navigation bar component with routing links
- **StudentGraph**: Graph visualization component for student connections
- **GraphVisualization**: Reusable graph component for roommate visualization
- **TestCaseContext**: React Context for sharing test case data across pages

### Custom Pages Created
- **Home**: Main page with test case selection and student graph visualization
- **Chat**: Chat history viewing page with search and messaging interface
- **Friends**: Friends list viewing page
- **Roommates**: Roommate pairs visualization using Gale-Shapley algorithm
- **Internships**: Referral path finder using Dijkstra's algorithm

### Backend Integration
- **NetworkServer.java**: Custom HTTP server exposing Java functionality as REST APIs
- **API Service**: JavaScript service layer for communicating with Java backend