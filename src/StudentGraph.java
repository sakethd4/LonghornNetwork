import java.util.*;

public class StudentGraph{
    // Code obtained from Ayush's Lab Lecture video.

    public static class Edge {
        public UniversityStudent neighbor;
        public int weight;

        /**
         * 
         * @param neighbor A university student that shares an edge
         * @param weight The weight of the edge
         */
        public Edge (UniversityStudent neighbor, int weight) {
            this.neighbor = neighbor;
            this.weight = weight;
        }

        @Override
        /**
         * Displays the edge in a readable format.
         */
        public String toString() {
            return "(" + neighbor.name + ", " + weight + ")";
        }
    }

    private Map<UniversityStudent, List<Edge>> adjacencyList;

    /**
     * 
     * @param students A list of university students needed to create a graph
     */
    public StudentGraph(List<UniversityStudent> students) {
        adjacencyList = new HashMap<>();
        
        for (UniversityStudent s : students) {
            adjacencyList.put(s, new ArrayList<>());
        }

        // Creating all possible pairs of students and adding correspoonding edges.
        for (int i = 0; i < students.size(); i++) {
            for (int j = i + 1; j < students.size(); j++) {
                UniversityStudent s1 = students.get(i);
                UniversityStudent s2 = students.get(j);
                int weight = s1.calculateConnectionStrength(s2);
                if (weight > 0) {
                    addEdge(s1, s2, weight);
                }
            }
        }
    }

    /**
     * 
     * @param s1 A university student that shares an edge with s2
     * @param s2 A university student that shares an edge with s1
     * @param weight The weight of the edge between the two students
     */
    public void addEdge(UniversityStudent s1, UniversityStudent s2, int weight) {
        adjacencyList.get(s1).add(new Edge(s2, weight));
        adjacencyList.get(s2).add(new Edge(s1, weight));
    }

    /**
     * 
     * @param s The university student used to find respective neighbors.
     * @return A list of edges containing neighbors to the student.
     */
    public List<Edge> getNeighbors(UniversityStudent s){
        return adjacencyList.get(s);
    }

    /**
     * 
     * @return The whole set of students contained in the student graph.
     */
    public Set<UniversityStudent> getAllNodes() {
        return adjacencyList.keySet();
    }

    /**
     * Displays the student graph in a readable format.
     */
    public void displayGraph(){
        System.out.println("\nStudent Graph:");
        for (UniversityStudent s : adjacencyList.keySet()) {
            System.out.println(s.name +  " -> " + adjacencyList.get(s).toString());
        }
    }
}
