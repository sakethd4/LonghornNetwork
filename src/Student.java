import java.util.*;

public abstract class Student {
    protected String name;
    protected int age;
    protected String gender;
    protected int year;
    protected String major;
    protected double gpa;
    protected List<String> roommatePreferences;
    protected List<String> previousInternships;

    /**
     * 
     * @param other Second student to compare connection strength to
     * @return Number determined by how string their connection is
     */
    public abstract int calculateConnectionStrength(Student other);
}
