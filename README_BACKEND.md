# Java Backend Server Setup

This guide explains how to connect your React app to use your existing Java code.

## Overview

The `NetworkServer.java` file creates a simple HTTP server that exposes your Java classes (StudentGraph, UniversityStudent, etc.) as REST API endpoints. Your React app can then call these endpoints instead of using static JSON files.

## Setup Instructions

### 1. Compile the Server

Navigate to the project root directory and compile the server:

```bash
cd "C:\Users\saket\OneDrive\Documents\422c labs\LonghornNetwork"
javac -d . src/NetworkServer.java src/*.java
```

Or compile all Java files:
```bash
javac src/*.java
```

### 2. Run the Server

```bash
java NetworkServer
```

The server will start on `http://localhost:8080`

### 3. Test the Endpoints

You can test the endpoints in your browser or using curl:

- **Get test case 1 students**: http://localhost:8080/api/testcase/1
- **Get test case 1 graph**: http://localhost:8080/api/graph/1
- **Get students**: http://localhost:8080/api/students/?testcase=1

## Available Endpoints

### GET `/api/testcase/{testCaseNumber}`
Returns JSON array of students for the specified test case (1, 2, or 3).

**Example**: `GET /api/testcase/1`

### GET `/api/graph/{testCaseNumber}`
Returns graph data (nodes and links) calculated using your `StudentGraph.java` class.

**Example**: `GET /api/graph/1`

**Response format**:
```json
{
  "nodes": [
    {"id": "Alice", "name": "Alice", "major": "Computer Science", ...},
    ...
  ],
  "links": [
    {"source": "Alice", "target": "Bob", "weight": 5, "value": 5},
    ...
  ]
}
```

### GET `/api/students/?testcase={testCaseNumber}`
Alternative endpoint to get students data.

## Updating React to Use the Backend

### Step 1: Update TestCaseContext

Modify `my-app/src/context/TestCaseContext.js` to fetch from the backend:

```javascript
const loadTestCase = async (testCaseNumber) => {
  try {
    // Fetch from Java backend instead of static JSON
    const response = await fetch(`http://localhost:8080/api/testcase/${testCaseNumber}`);
    if (!response.ok) {
      throw new Error('Failed to load test case data');
    }
    const data = await response.json();
    setTestCaseData(data);
    setSelectedTestCase(testCaseNumber);
  } catch (error) {
    console.error('Error loading test case data:', error);
    setTestCaseData(null);
    setSelectedTestCase(null);
  }
};
```

### Step 2: Update StudentGraph Component

Modify `my-app/src/components/StudentGraph.js` to fetch graph data from backend:

```javascript
const [graphData, setGraphData] = useState({ nodes: [], links: [] });

useEffect(() => {
  const fetchGraphData = async () => {
    if (selectedTestCase) {
      try {
        const response = await fetch(`http://localhost:8080/api/graph/${selectedTestCase}`);
        const data = await response.json();
        setGraphData(data);
      } catch (error) {
        console.error('Error loading graph data:', error);
      }
    }
  };
  fetchGraphData();
}, [selectedTestCase]);
```

## Running Both Servers

1. **Terminal 1**: Start the Java backend
   ```bash
   java NetworkServer
   ```

2. **Terminal 2**: Start the React app
   ```bash
   cd my-app
   npm start
   ```

## Benefits

- ✅ Use your actual Java `StudentGraph` class
- ✅ No need to duplicate logic in JavaScript
- ✅ All calculations done in Java
- ✅ Easy to extend with more endpoints
- ✅ Single source of truth for business logic

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, change the PORT constant in `NetworkServer.java`:
```java
private static final int PORT = 8081; // or any other port
```

### CORS Issues
The server already includes CORS headers. If you still have issues, make sure the React app is calling the correct URL.

### Compilation Errors
Make sure all Java files in `src/` are compiled. The server depends on:
- Main.java
- StudentGraph.java
- UniversityStudent.java
- Student.java
- And other related classes

