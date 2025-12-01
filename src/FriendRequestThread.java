
import java.util.concurrent.Semaphore;

public class FriendRequestThread implements Runnable {
    // Code obtained from Ayush's Lab Lecture video.

    private UniversityStudent receiver;
    private UniversityStudent sender;
    private static final Semaphore semaphore = new Semaphore(1);


    /**
     * 
     * @param sender User sending a friend request
     * @param receiver User receiving 
     */
    public FriendRequestThread(UniversityStudent sender, UniversityStudent receiver) {
        this.receiver = receiver;
        this.sender = sender;
    }

    @Override
    /**
     * Simulate a friend request being sent between two students using semaphores
     */
    public void run() {
        try {
            semaphore.acquire();

            System.out.println("Friend request sent to " + receiver.name + " from " + sender.name);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Friend request interrupted: " + e.getMessage());
        } finally {
            semaphore.release();
        }
    }
}
