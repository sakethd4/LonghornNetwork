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
        int count = 0;
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
                        } else {
                            studentData.put("Error" + count, line);    
                        }
                        count++;
                    }

                    count = 0;

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

        if (data.containsKey("Error0")) {
            System.err.println("Parsing error: Incorrect format in line: '" + data.get("Error0") + "'. Expected format 'Name: <value>'.");
            return null;     
        } else if (data.get("Name").isBlank()) {
            System.err.println("Parsing Error: Missing required field 'Name'");
            return null;
        }
        String name = data.get("Name");

        if (data.containsKey("Error1")) {
            System.err.println("Parsing error: Incorrect format in line: '" + data.get("Error1") + "'. Expected format 'Age: <value>'.");
            return null;     
        } else if (data.get("Age").isBlank()) {
            System.err.println("Parsing Error: Missing required field 'Age' in student entry " + name);
            return null;
        }
        int age = 0;
        try {
            age = Integer.parseInt(data.get("Age"));
        } catch (NumberFormatException e) {
            System.err.println("Number format error: Invalid number format for age: '" + data.get("Age") + "' in student entry for " + name + ".");
            return null;
        }

        if (data.containsKey("Error2")) {
            System.err.println("Parsing error: Incorrect format in line: '" + data.get("Error2") + "'. Expected format 'Gender: <value>'.");
            return null;     
        } else if (data.get("Gender").isBlank()) {
            System.err.println("Parsing Error: Missing required field 'Gender' in student entry " + name);
            return null;
        }
        String gender = data.get("Gender");

        if (data.containsKey("Error3")) {
            System.err.println("Parsing error: Incorrect format in line: '" + data.get("Error3") + "'. Expected format 'Year: <value>'.");
            return null;     
        } else if (data.get("Year").isBlank()) {
             System.err.println("Parsing Error: Missing required field 'Year' in student entry " + name);
            return null;
        }
        int year = 0;
        try {
            year = Integer.parseInt(data.get("Year"));
        } catch (NumberFormatException e) {
            System.err.println("Number format error: Invalid number format for year: '" + data.get("Year") + "' in student entry for " + name + ".");
            return null;
        }

        if (data.containsKey("Error4")) {
            System.err.println("Parsing error: Incorrect format in line: '" + data.get("Error4") + "'. Expected format 'Major: <value>'.");
            return null;     
        } else if (data.get("Major").isBlank()) {
            System.err.println("Parsing Error: Missing required field 'Major' in student entry " + name);
            return null;
        }
        String major = data.get("Major");

        if (data.containsKey("Error5")) {
            System.err.println("Parsing error: Incorrect format in line: '" + data.get("Error5") + "'. Expected format 'GPA: <value>'.");
            return null;     
        } else if (data.get("GPA").isBlank()) {
            System.err.println("Parsing Error: Missing required field 'GPA' in student entry " + name);
            return null;
        }
        double gpa = 0;
        try {
            gpa = Double.parseDouble(data.get("GPA"));
        } catch (NumberFormatException e) {
            System.err.println("Number format error: Invalid number format for gpa: '" + data.get("GPA") + "' in student entry for " + name + ".");
            return null;
        }

        List<String> roommates = new ArrayList<>(); 
        if (data.containsKey("Error6")) {
            System.err.println("Parsing error: Incorrect format in line: '" + data.get("Error6") + "'. Expected format 'RoommatePreferences: <value>, <value>, ...'.");
            return null;     
        } else if (data.get("RoommatePreferences").isBlank()) {
            System.err.println("Parsing Error: Missing required field 'Roommate Preferences' in student entry " + name);
            return null;
        }
        String[] roomies = data.get("RoommatePreferences").split(", ");
        for (String s : roomies) {
            roommates.add(s);
        }

        List<String> internships = new ArrayList<>();
        if (data.containsKey("Error7")) {
            System.err.println("Parsing error: Incorrect format in line: '" + data.get("Error7") + "'. Expected format 'PreviousInternships: <value>, <value>, ...'.");
            return null;     
        } else if (data.get("PreviousInternships").isBlank()) {
            System.err.println("Parsing Error: Missing required field 'Previous Internships' in student entry " + name);
            return null;
        }
        String[] interns = data.get("PreviousInternships").split(", ");
        for (String s : interns) {
            if (!s.equals("None")) {
                internships.add(s);
            }
        }

        return new UniversityStudent(name, age, gender, year, major, gpa, roommates, internships);
    }

    public static void printOutput(String filename) {
        try {
            List<UniversityStudent> students = parseStudents(filename);
            for (UniversityStudent s : students) {
            System.out.println(s);
        }
        } catch (IOException e) {
            System.err.println("Error printing output: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        printOutput("normal_1.txt");
    }
}
