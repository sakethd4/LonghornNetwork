**Project Demonstration**
THESE INSTRUCTIONS ARE FOR A WINDOWS ENVIRONMENT

**Prerequisites**
- **Java JDK:**: Install JDK 11 or later (JDK 17 or 21 recommended). Ensure `java` and `javac` are on your `PATH` and `JAVA_HOME` is set.

- **Node.js & npm:**: Install Node.js LTS (recommended >= 18). `npm` (comes with Node) is used to install and run the React app.

- **Windows shell note:**: These instructions use `cmd.exe` on Windows. Where commands are shown for macOS/Linux they are marked explicitly.

**Quick checklist (what you'll do)**
- Install Java (JDK) and Node.js
- Compile and run Java backend (starts HTTP server on `http://localhost:8080`)

- Install npm packages and start React frontend in `my-app/` (dev server on `http://localhost:3000`)

- Verify connectivity using sample browser or `curl` requests

**Verify prerequisites**
- **Java check**: In `cmd.exe`, run:
```cmd
java -version
javac -version
```
Expected: shows installed Java version and `javac` version. If these fail, install a JDK and update `PATH`/`JAVA_HOME`. This project was made on Java 25.0.1 2025-10-21 LTS.

- **Node/npm check**: In `cmd.exe`, run:
```cmd
node -v
npm -v
```
Expected: Node version (>=18 recommended) and npm version. This project was made using Node v22.14.0 and npm 11.6.4

**2 Java backend: compile & run**
This project includes a small HTTP server implemented in `src/NetworkServer.java`. It uses the JDK bundled `com.sun.net.httpserver` classes and the other Java classes in `src/` (e.g., `StudentGraph.java`, `UniversityStudent.java`, etc.).

- Option A — convenience (provided): use the included helper `run-server.bat` (Windows `cmd.exe`):
```cmd
cd "...\LonghornNetwork"
run-server.bat
```
This will compile `src\*.java` and run `NetworkServer` on port `8080`.

- Option B — manual: create a separate `bin` folder and keep sources separate from class files.
```cmd
cd "...\LonghornNetwork"
mkdir bin
javac -d bin src\*.java
if %errorlevel% neq 0 (
  echo Compilation failed
  exit /b 1
)
java -cp bin NetworkServer
```

- What to expect: After starting the server you should see a message like:
```
Server started on http://localhost:8080
Available endpoints:
  GET /api/testcase/{1|2|3} - Get test case student data
  GET /api/graph/{1|2|3} - Get graph data for test case
  GET /api/students/?testcase={1|2|3} - Get students for test case
  GET /api/roommates/{1|2|3} - Get roommate pairs graph (Gale-Shapley)
  GET /api/referral/?testcase={1|2|3}&student={name}&company={name} - Find referral path
```

- Notes & tips:
  - If the server fails with an exception about missing packages, ensure you're using a full JDK (not JRE-only) and `javac` compiled all files.
  - If port `8080` is already in use, stop the conflicting service or edit `src/NetworkServer.java` and change `private static final int PORT = 8080;` then recompile.

**3 React frontend: install dependencies & run**
The React app lives in `my-app/` and uses `react-scripts`. Follow these steps from `cmd.exe`:

```cmd
cd "...\LonghornNetwork\my-app"
npm install
npm start
```

- `npm install` will install dependencies; `npm start` runs the dev server (default `http://localhost:3000`).
- If `npm start` fails with node version issues, upgrade/downgrade Node to a compatible LTS release.

**4 Common troubleshooting**
- Backend fails to compile:
  - Ensure you're running a JDK (not only JRE).
  - Use `javac -d bin src\*.java` to find compile-time errors and fix missing imports/naming issues.
- `java` throws `NoClassDefFoundError` or cannot find `NetworkServer`:
  - Use `java -cp bin NetworkServer` when you compiled to `bin`.
  - If you used `javac src\*.java`, then the class files are in `src\` and `java -cp src NetworkServer` will work (as `run-server.bat` does).
- Port conflicts (server won't start):
  - On Windows, find the process using port 8080 and stop it:
```cmd
netstat -ano | findstr :8080
tasklist /FI "PID eq <pid>"
taskkill /PID <pid> /F
```
- React dev server won't start or hot reload fails:
  - Delete `node_modules` and `package-lock.json` and run `npm install` again.
  - If you have an old cached service worker, clear site data in browser or use incognito.



**5 Overview**
- When the tester unzips, they should:
  1. Install JDK + Node.js (if not installed)
  2. Compile and start Java server (see step 2)
  3. `cd my-app`, run `npm install` and `npm start` (see step 3)

**6 Verification checklist (what to verify after starting both servers)**
- Backend prints startup message and lists endpoints on `http://localhost:8080`.
- `curl http://localhost:8080/api/testcase/1` returns JSON array of students.
- `npm start` opens React app on `http://localhost:3000` and UI loads without network errors in the browser console.
- UI features (graph, roommate view, referral path) should fetch data from the backend endpoints and display results.

-- End of instructions --
