import java.util.*;

public class UniversityStudent extends Student {
    private UniversityStudent roommate;

    public UniversityStudent (String name, int age, String gender, int year, String major, double gpa, List<String> roomates, List<String> internships) {
        this.name = name;
        this.age = age;
        this.year = year;
        this.major = major;
        this.gpa = gpa;
        this.roommatePreferences = roomates;
        this.previousInternships = internships;
        this.roommate = null;
    }

    public void setRoommate(UniversityStudent roommate) {
        this.roommate = roommate;
    }

    public UniversityStudent getRoommate() {
        return roommate;
    }

    @Override
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

}

