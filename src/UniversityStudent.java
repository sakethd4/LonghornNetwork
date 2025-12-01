import java.util.*;

public class UniversityStudent extends Student {
    private UniversityStudent roomate;

    public UniversityStudent (String name, int age, String gender, int year, String major, double gpa, List<String> roomates, List<String> internships) {
        this.name = name;
        this.age = age;
        this.year = year;
        this.major = major;
        this.gpa = gpa;
        this.roommatePreferences = roomates;
        this.previousInternships = internships;
        this.roomate = null;
    }

    public void setRoommate(UniversityStudent roomate) {
        this.roomate = roomate;
    }

    public UniversityStudent getRoommate() {
        return roomate;
    }

    @Override
    public int calculateConnectionStrength(Student other) {
        return 0;
    }

}

