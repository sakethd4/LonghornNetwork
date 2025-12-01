import java.util.concurrent.Semaphore;

public class ChatThread implements Runnable {
    private UniversityStudent receiver;
    private UniversityStudent sender;
    private String message;
    private static final Semaphore semaphore = new Semaphore(1);
    /**
     * 
     * @param sender The user sending a message
     * @param receiver The user receiving the message
     * @param message The message being sent
     */
    public ChatThread(UniversityStudent sender, UniversityStudent receiver, String message) {
        this.receiver = receiver;
        this.sender = sender;
        this.message = message;
    }

    @Override
    public void run() {
        try {
            semaphore.acquire();

            System.out.println(sender.name + " said " + message + " to " + receiver.name);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Friend request interrupted: " + e.getMessage());
        } finally {
            semaphore.release();
        }
    }
}
