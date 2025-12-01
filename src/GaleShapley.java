import java.util.*;

public class GaleShapley {
    // Code obtained from Ayush's Lab Lecture video.

    /**
     * 
     * @param students List of students to be matched with roommates
     */
    public static void assignRoommates(List<UniversityStudent> students) {
        Map<UniversityStudent, UniversityStudent> roommatePairs = new HashMap<>();
        Map<UniversityStudent, Integer> nextProposalIndex = new HashMap<>();
        Map<String, UniversityStudent> nameToStudent = new HashMap<>();

        for (UniversityStudent s : students) {
            nameToStudent.put(s.name, s);
            nextProposalIndex.put(s, 0);
        }

        // Adding students with roommate preferences to free queue
        Queue<UniversityStudent> freeStudents = new LinkedList<>();
        for (UniversityStudent s : students) {
            if (!s.roommatePreferences.isEmpty()) {
                freeStudents.offer(s);
            }
        }
        
        while(!freeStudents.isEmpty()) {
            UniversityStudent s = freeStudents.poll();

            if (s.getRoommate() != null) {
                continue;
            }

            // Check if we've reached the end of the students roommate preferences.
            int index = nextProposalIndex.get(s);
            if (index >= s.roommatePreferences.size()) {
                continue;
            }

            // If not, store preference, increment proposal index, and check that prefered roommate exists.
            String preferredName = s.roommatePreferences.get(index);
            nextProposalIndex.put(s, index + 1);
            UniversityStudent t = nameToStudent.get(preferredName);

            // Otherwise, requeue student into free students
            if (t == null) {
                if (nextProposalIndex.get(s) < s.roommatePreferences.size()) {
                    freeStudents.offer(s);
                }
                continue;
            }

            // Skip non-preferred roommates and requeue
            if (!t.roommatePreferences.contains(s.name)) {
                if (nextProposalIndex.get(s) < s.roommatePreferences.size()) {
                    freeStudents.offer(s);
                }
                continue;
            }

            // If preferred roommate doesnt also have a roommate, pair them up.
            // If preferred roommate already has a roommate, compare prefrences from current roommate and potential roommate to choose best preference.
            if (t.getRoommate() == null) {
                roommatePairs.put(s, t);
                roommatePairs.put(t, s);
                s.setRoommate(t);
                t.setRoommate(s);
            } else {
                UniversityStudent currentPartner = t.getRoommate();
                int currentIndex = t.roommatePreferences.indexOf(currentPartner.name);
                int newIndex = t.roommatePreferences.indexOf(s.name);
                if (newIndex < currentIndex) {
                    roommatePairs.put(s, t);
                    roommatePairs.put(t, s);
                    roommatePairs.remove(currentPartner);
                    freeStudents.offer(currentPartner);
                    currentPartner.setRoommate(null);
                    s.setRoommate(t);
                    t.setRoommate(s);
                } else {
                    if (nextProposalIndex.get(s) < s.roommatePreferences.size()) {
                    freeStudents.offer(s);
                    }
                }
            }
        }

        // Printing out roommate pairs found with algorithm
        System.out.println("\n Roommate Pairings (Gale-Shapely):");
        Set<UniversityStudent> printed = new HashSet<>();
        for (UniversityStudent s : roommatePairs.keySet()) {
            UniversityStudent partner = roommatePairs.get(s);
            if (!printed.contains(s) && !printed.contains(partner)) {
                System.out.println(s.name + " paired with " + partner.name);
                printed.add(s);
                printed.add(partner);
            }
        }
    }
}
