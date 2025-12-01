import java.util.*;

public class UniversityStudent extends Student {
    // Code obtained from Ayush's Lab Lecture video.

    private UniversityStudent roommate;

    /**
     * 
     * @param name name of the student
     * @param age age of the student
     * @param gender gender of the student
     * @param year academic year of the student
     * @param major academic major of the student
     * @param gpa gpa of the student
     * @param roommates roommate preferences of the student
     * @param internships previous internships of the student
     */
    public UniversityStudent (String name, int age, String gender, int year, String major, double gpa, List<String> roommates, List<String> internships) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.year = year;
        this.major = major;
        this.gpa = gpa;
        this.roommatePreferences = roommates;
        this.previousInternships = internships;
        this.roommate = null;
    }

    /**
     * 
     * @param roommate student to be the roommate of current student
     */
    public void setRoommate(UniversityStudent roommate) {
        this.roommate = roommate;
    }

    /**
     * 
     * @return current roommate of the student
     */ 
    public UniversityStudent getRoommate() {
        return roommate;
    }


    @Override
    /**
     * +4 connection strength for shared roommates
     * +3 connection strength for each shared internships
     * +2 connection strength for same major
     * +1 connection strength for same age
     * @param other student to compare connection strength to
     * @return the value of the connection strength between the two students
     */ 
    public int calculateConnectionStrength(Student other) {
        int strength = 0;
        if (other instanceof UniversityStudent) {
            UniversityStudent s = (UniversityStudent) other;

            if (this.roommate != null && this.roommate.equals(s)) {
                strength += 4;
            }

            for (String internship : this.previousInternships) {
                if (s.previousInternships.contains(internship)) {
                    strength += 3;
                }
            }

            if (this.major.equals(s.major)) {
                strength += 2;
            }

            if (this.age == s.age) {
                strength += 1;
            }
        }
        return strength;
    }

    @Override
    /**
     * Displays the student in a readable format.
     */
    public String toString() {
        return "UniversityStudent{" + "name='" + name + "'" + ", " + "age=" + age + ", " + "gender='" + gender + "'" + ", " + "year=" + year + ", " + "major='" + major + "'" + ", " + "GPA=" + gpa + ", " + "roommatePreferences=" + roommatePreferences + ", " + "previousInternships=" + previousInternships + "}";
    }
 
}

