import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Simple HTTP server to expose Java functionality to React frontend
 * This server uses your existing Java classes (StudentGraph, UniversityStudent, etc.)
 */
public class NetworkServer {
    private static final int PORT = 8080;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        
        // Test case endpoints
        server.createContext("/api/testcase/", new TestCaseHandler());
        server.createContext("/api/graph/", new GraphHandler());
        server.createContext("/api/students/", new StudentsHandler());
        server.createContext("/api/roommates/", new RoommatesHandler());
        
        server.setExecutor(null);
        server.start();
        System.out.println("Server started on http://localhost:" + PORT);
        System.out.println("Available endpoints:");
        System.out.println("  GET /api/testcase/{1|2|3} - Get test case student data");
        System.out.println("  GET /api/graph/{1|2|3} - Get graph data for test case");
        System.out.println("  GET /api/students/?testcase={1|2|3} - Get students for test case");
        System.out.println("  GET /api/roommates/{1|2|3} - Get roommate pairs graph (Gale-Shapley)");
    }

    // Handler for test case data
    static class TestCaseHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            handleCors(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 200, "");
                return;
            }

            String path = exchange.getRequestURI().getPath();
            String testCaseNum = path.substring(path.lastIndexOf("/") + 1);
            
            try {
                List<UniversityStudent> students = getTestCaseStudents(Integer.parseInt(testCaseNum));
                String json = studentsToJson(students);
                sendJsonResponse(exchange, 200, json);
            } catch (Exception e) {
                e.printStackTrace();
                sendJsonResponse(exchange, 500, "{\"error\": \"" + e.getMessage().replace("\"", "\\\"") + "\"}");
            }
        }
    }

    // Handler for graph data
    static class GraphHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            handleCors(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 200, "");
                return;
            }

            String path = exchange.getRequestURI().getPath();
            String testCaseNum = path.substring(path.lastIndexOf("/") + 1);
            
            try {
                List<UniversityStudent> students = getTestCaseStudents(Integer.parseInt(testCaseNum));
                StudentGraph graph = new StudentGraph(students);
                String json = graphToJson(graph, students);
                sendJsonResponse(exchange, 200, json);
            } catch (Exception e) {
                e.printStackTrace();
                sendJsonResponse(exchange, 500, "{\"error\": \"" + e.getMessage().replace("\"", "\\\"") + "\"}");
            }
        }
    }

    // Handler for all students
    static class StudentsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            handleCors(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 200, "");
                return;
            }

            try {
                String query = exchange.getRequestURI().getQuery();
                int testCaseNum = 1;
                if (query != null && query.contains("testcase=")) {
                    testCaseNum = Integer.parseInt(query.split("=")[1]);
                }
                
                List<UniversityStudent> students = getTestCaseStudents(testCaseNum);
                String json = studentsToJson(students);
                sendJsonResponse(exchange, 200, json);
            } catch (Exception e) {
                e.printStackTrace();
                sendJsonResponse(exchange, 500, "{\"error\": \"" + e.getMessage().replace("\"", "\\\"") + "\"}");
            }
        }
    }

    // Handler for roommate pairs graph (using Gale-Shapley)
    static class RoommatesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            handleCors(exchange);
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                sendResponse(exchange, 200, "");
                return;
            }

            String path = exchange.getRequestURI().getPath();
            String testCaseNum = path.substring(path.lastIndexOf("/") + 1);
            
            try {
                List<UniversityStudent> students = getTestCaseStudents(Integer.parseInt(testCaseNum));
                
                // Create a copy to avoid modifying the original
                List<UniversityStudent> studentsCopy = new ArrayList<>();
                for (UniversityStudent s : students) {
                    studentsCopy.add(new UniversityStudent(
                        s.name, s.age, s.gender, s.year, s.major, s.gpa,
                        new ArrayList<>(s.roommatePreferences),
                        new ArrayList<>(s.previousInternships)
                    ));
                }
                
                // Run Gale-Shapley algorithm
                GaleShapley.assignRoommates(studentsCopy);
                
                // Build graph data for roommate pairs
                String json = roommatesToJson(studentsCopy);
                sendJsonResponse(exchange, 200, json);
            } catch (Exception e) {
                e.printStackTrace();
                sendJsonResponse(exchange, 500, "{\"error\": \"" + e.getMessage().replace("\"", "\\\"") + "\"}");
            }
        }
    }

    // Get students for a test case
    private static List<UniversityStudent> getTestCaseStudents(int testCaseNum) {
        switch (testCaseNum) {
            case 1:
                return Main.generateTestCase1();
            case 2:
                return Main.generateTestCase2();
            case 3:
                return Main.generateTestCase3();
            default:
                throw new IllegalArgumentException("Invalid test case number: " + testCaseNum);
        }
    }

    // Convert students to JSON (manual JSON serialization)
    private static String studentsToJson(List<UniversityStudent> students) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < students.size(); i++) {
            UniversityStudent student = students.get(i);
            if (i > 0) json.append(",");
            json.append("{");
            json.append("\"name\":\"").append(escapeJson(student.name)).append("\",");
            json.append("\"age\":").append(student.age).append(",");
            json.append("\"gender\":\"").append(escapeJson(student.gender)).append("\",");
            json.append("\"year\":").append(student.year).append(",");
            json.append("\"major\":\"").append(escapeJson(student.major)).append("\",");
            json.append("\"gpa\":").append(student.gpa).append(",");
            
            // Roommate preferences
            json.append("\"roommatePreferences\":[");
            for (int j = 0; j < student.roommatePreferences.size(); j++) {
                if (j > 0) json.append(",");
                json.append("\"").append(escapeJson(student.roommatePreferences.get(j))).append("\"");
            }
            json.append("],");
            
            // Previous internships
            json.append("\"previousInternships\":[");
            for (int j = 0; j < student.previousInternships.size(); j++) {
                if (j > 0) json.append(",");
                json.append("\"").append(escapeJson(student.previousInternships.get(j))).append("\"");
            }
            json.append("],");
            
            // Roommate
            if (student.getRoommate() != null) {
                json.append("\"roommate\":\"").append(escapeJson(student.getRoommate().name)).append("\",");
            }
            
            // Chat history
            json.append("\"chatHistory\":{");
            Map<UniversityStudent, ArrayList<String>> chatHistory = student.getChatHistory();
            if (chatHistory != null && !chatHistory.isEmpty()) {
                boolean first = true;
                for (Map.Entry<UniversityStudent, ArrayList<String>> entry : chatHistory.entrySet()) {
                    if (!first) json.append(",");
                    first = false;
                    json.append("\"").append(escapeJson(entry.getKey().name)).append("\":[");
                    ArrayList<String> messages = entry.getValue();
                    if (messages != null) {
                        for (int j = 0; j < messages.size(); j++) {
                            if (j > 0) json.append(",");
                            json.append("\"").append(escapeJson(messages.get(j))).append("\"");
                        }
                    }
                    json.append("]");
                }
            }
            json.append("},");
            
            // Friends
            json.append("\"friends\":[");
            Map<UniversityStudent, UniversityStudent> friends = student.getFriends();
            if (friends != null && !friends.isEmpty()) {
                boolean first = true;
                for (UniversityStudent friend : friends.keySet()) {
                    if (!first) json.append(",");
                    first = false;
                    json.append("\"").append(escapeJson(friend.name)).append("\"");
                }
            }
            json.append("]");
            
            json.append("}");
        }
        json.append("]");
        return json.toString();
    }

    // Convert graph to JSON
    private static String graphToJson(StudentGraph graph, List<UniversityStudent> students) {
        StringBuilder json = new StringBuilder("{");
        
        // Nodes
        json.append("\"nodes\":[");
        for (int i = 0; i < students.size(); i++) {
            UniversityStudent student = students.get(i);
            if (i > 0) json.append(",");
            json.append("{");
            json.append("\"id\":\"").append(escapeJson(student.name)).append("\",");
            json.append("\"name\":\"").append(escapeJson(student.name)).append("\",");
            json.append("\"major\":\"").append(escapeJson(student.major)).append("\",");
            json.append("\"age\":").append(student.age).append(",");
            json.append("\"year\":").append(student.year).append(",");
            json.append("\"gpa\":").append(student.gpa);
            json.append("}");
        }
        json.append("],");
        
        // Links
        json.append("\"links\":[");
        Set<String> processedPairs = new HashSet<>();
        boolean firstLink = true;
        for (UniversityStudent student : graph.getAllNodes()) {
            List<StudentGraph.Edge> edges = graph.getNeighbors(student);
            for (StudentGraph.Edge edge : edges) {
                String pairKey1 = student.name + "-" + edge.neighbor.name;
                String pairKey2 = edge.neighbor.name + "-" + student.name;
                
                if (!processedPairs.contains(pairKey1) && !processedPairs.contains(pairKey2)) {
                    if (!firstLink) json.append(",");
                    firstLink = false;
                    json.append("{");
                    json.append("\"source\":\"").append(escapeJson(student.name)).append("\",");
                    json.append("\"target\":\"").append(escapeJson(edge.neighbor.name)).append("\",");
                    json.append("\"weight\":").append(edge.weight).append(",");
                    json.append("\"value\":").append(edge.weight);
                    json.append("}");
                    processedPairs.add(pairKey1);
                }
            }
        }
        json.append("]");
        
        json.append("}");
        return json.toString();
    }

    // Convert roommate pairs to graph JSON
    private static String roommatesToJson(List<UniversityStudent> students) {
        StringBuilder json = new StringBuilder("{");
        
        // Nodes
        json.append("\"nodes\":[");
        for (int i = 0; i < students.size(); i++) {
            UniversityStudent student = students.get(i);
            if (i > 0) json.append(",");
            json.append("{");
            json.append("\"id\":\"").append(escapeJson(student.name)).append("\",");
            json.append("\"name\":\"").append(escapeJson(student.name)).append("\",");
            json.append("\"major\":\"").append(escapeJson(student.major)).append("\",");
            json.append("\"age\":").append(student.age).append(",");
            json.append("\"year\":").append(student.year).append(",");
            json.append("\"gpa\":").append(student.gpa).append(",");
            json.append("\"gender\":\"").append(escapeJson(student.gender)).append("\"");
            json.append("}");
        }
        json.append("],");
        
        // Links (roommate pairs)
        json.append("\"links\":[");
        Set<String> processedPairs = new HashSet<>();
        boolean firstLink = true;
        for (UniversityStudent student : students) {
            UniversityStudent roommate = student.getRoommate();
            if (roommate != null) {
                String pairKey1 = student.name + "-" + roommate.name;
                String pairKey2 = roommate.name + "-" + student.name;
                
                if (!processedPairs.contains(pairKey1) && !processedPairs.contains(pairKey2)) {
                    if (!firstLink) json.append(",");
                    firstLink = false;
                    json.append("{");
                    json.append("\"source\":\"").append(escapeJson(student.name)).append("\",");
                    json.append("\"target\":\"").append(escapeJson(roommate.name)).append("\",");
                    json.append("\"weight\":1,");
                    json.append("\"value\":1");
                    json.append("}");
                    processedPairs.add(pairKey1);
                }
            }
        }
        json.append("]");
        
        json.append("}");
        return json.toString();
    }

    private static String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }

    private static void handleCors(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        sendResponse(exchange, statusCode, json);
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String body) throws IOException {
        byte[] response = body.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, response.length);
        OutputStream os = exchange.getResponseBody();
        os.write(response);
        os.close();
    }
}
