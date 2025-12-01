import java.io.*;
import java.util.*;

public class DataParser {
    /**
     * 
     * @param filename the name of the input file
     * @return A list of students with their associated data
     * @throws IOException
     */
    public static List<UniversityStudent> parseStudents(String filename) throws IOException {
        String line;
        List<UniversityStudent> students = new ArrayList<>();
        FileReader file = new FileReader(filename);
        try {
            BufferedReader reader = new BufferedReader(file);
            while ((line = reader.readLine()) != null) {
                line = line.trim();

                if (line.equals("Student:")) {
                    Map<String, String> studentData = new HashMap<>();

                    while ((line = reader.readLine()) != null) {
                        line = line.trim();

                        if (line.isBlank()) {
                            break;
                        }

                        if (line.contains(":")) {
                            String[] parsed = line.split(":", 2);
                            String key = parsed[0].trim();
                            String value = parsed[1].trim();
                            studentData.put(key, value);
                        }
                    }

                    UniversityStudent s = createStudentFromMap(studentData);
                    if (s != null) {
                        students.add(s);
                    }
                }
            }
        } catch (IOException e) {
                System.err.println("Error reading file: " + e.getMessage());
        }
        return students;
    }

    private static UniversityStudent createStudentFromMap(Map<String, String> data) {

        if (!data.containsKey("Name") || data.get("Name").isBlank()) {
            System.err.println("Missing required field 'Name'");
            return null;
        }
        String name = data.get("Name");

        if (!data.containsKey("Age") || data.get("Age").isBlank()) {
            System.err.println("Missing required field 'Age' in student entry " + name);
            return null;
        }
        int age = 0;
        try {
            age = Integer.parseInt(data.get("Age"));
        } catch (NumberFormatException e) {
            System.err.println("Error: Invalid age for " + name);
            return null;
        }

        if (!data.containsKey("Gender") || data.get("Gender").isBlank()) {
            System.err.println("Missing required field 'Gender' in student entry " + name);
            return null;
        }
        String gender = data.get("Gender");

        if (!data.containsKey("Year") || data.get("Year").isBlank()) {
            System.err.println("Missing required field 'Year' in student entry " + name);
            return null;
        }
        int year = 0;
        try {
            year = Integer.parseInt(data.get("Year"));
        } catch (NumberFormatException e) {
            System.err.println("Error: Invalid year for " + name);
            return null;
        }

        if (!data.containsKey("Major") || data.get("Major").isBlank()) {
            System.err.println("Missing required field 'Major' in student entry " + name);
            return null;
        }
        String major = data.get("Major");

        if (!data.containsKey("GPA") || data.get("GPA").isBlank()) {
            System.err.println("Missing required field 'GPA' in student entry " + name);
            return null;
        }
        double gpa = 0;
        try {
            gpa = Double.parseDouble(data.get("GPA"));
        } catch (NumberFormatException e) {
            System.err.println("Error: Invalid GPA for " + name);
            return null;
        }

        List<String> roommates = new ArrayList<>();
        if (!data.containsKey("RoommatePreferences") || data.get("RoommatePreferences").isBlank()) {
            System.err.println("Missing required field 'Roommate Preferences' in student entry " + name);
            return null;
        }
        String[] roomies = data.get("RoommatePreferences").split(", ");
        for (String s : roomies) {
            roommates.add(s);
        }

        List<String> internships = new ArrayList<>();
        if (!data.containsKey("PreviousInternships") || data.get("PreviousInternships").isBlank()) {
            System.err.println("Missing required field 'Previous Internships' in student entry " + name);
            return null;
        }
        String[] interns = data.get("PreviousInternships").split(", ");
        for (String s : roomies) {
            roommates.add(s);
        }

        return new UniversityStudent(name, age, gender, year, major, gpa, roommates, internships);
    }
}
