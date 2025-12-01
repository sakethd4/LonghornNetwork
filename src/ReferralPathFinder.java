import java.util.*;
import javax.xml.crypto.dsig.TransformService;

public class ReferralPathFinder {
    private StudentGraph graph;
    /**
     * 
     * @param graph Graph of students to find referral path
     */
    public ReferralPathFinder(StudentGraph graph) {
        this.graph = graph;
    }

    /**
     * 
     * @param start Student to start path-finding
     * @param targetCompany Target company for student internship
     * @return List of students
     */
    public List<UniversityStudent> findReferralPath(UniversityStudent start, String targetCompany) {
        Map<UniversityStudent, Double> dist = new HashMap<>();
        Map<UniversityStudent, UniversityStudent> prev = new HashMap<>();
        Set<UniversityStudent> visited = new HashSet<>();

        for (UniversityStudent s : graph.getAllNodes()) {
            dist.put(s, Double.MAX_VALUE);
            prev.put(s, null);
        }
        dist.put(start, 0.0);

        PriorityQueue<UniversityStudent> pq = new PriorityQueue<>(Comparator.comparingDouble(dist::get));
        pq.add(start);

        while(!pq.isEmpty()) {
            UniversityStudent u = pq.poll();
            if (visited.contains(u)) {
                continue;
            }
            visited.add(u);

            for (String internship : u.previousInternships) {
                if (internship.equalsIgnoreCase(targetCompany)) {   
                    List<UniversityStudent> path = new ArrayList<>();
                    UniversityStudent curr = u;

                    while (curr != null) {
                        path.add(curr);
                        curr = prev.get(curr);
                    }
                    Collections.reverse(path);
                    return path;
                }
            }

            for (StudentGraph.Edge edge : graph.getNeighbors(u)) {
                UniversityStudent v = edge.neighbor;

                if (visited.contains(v)) {
                    continue;
                }

                double newDist = dist.get(u) + (1.0 / edge.weight);
                if (newDist < dist.get(v)) {
                    dist.put(v, newDist);
                    prev.put(v, u);
                    pq.add(v);
                }
            }    
        }    
        
        return new ArrayList<>();
    }
}
