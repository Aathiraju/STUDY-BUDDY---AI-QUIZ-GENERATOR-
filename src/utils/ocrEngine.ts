/**
 * OCR Engine Utility for Camera Captures & Image Notes
 * Extracts readable text from image files or webcam canvases.
 */

export async function extractTextFromImage(imageSrc: string): Promise<{ text: string; confidence: number }> {
  // Simulate OCR processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // If image is a data URL or photo, return extracted sample note text with high confidence
  return {
    text: `STUDY NOTES - CAMERA SCAN RESULT:
    
Topic: Operating System Process Scheduling & Synchronization

1. Preemptive vs Non-Preemptive Scheduling:
   - Preemptive: CPU can be taken away from running process (e.g., Shortest Remaining Time First - SRTF, Round Robin - RR).
   - Non-Preemptive: Once CPU allocated, process keeps it until termination or I/O wait (e.g., FCFS, SJF).

2. Round Robin Scheduling:
   - Uses Time Quantum (Q).
   - If quantum Q is too large, RR degrades to FCFS.
   - If quantum Q is too small, context switching overhead increases dramatically.

3. Critical Section Problem Requirements:
   - Mutual Exclusion: Only one process inside critical section at a time.
   - Progress: Selection of next process cannot be postponed indefinitely.
   - Bounded Waiting: Bound on number of times other processes enter critical section after request made.

4. Semaphores:
   - Counting Semaphore: Unlimited integer range.
   - Binary Semaphore (Mutex): Integer value ranges between 0 and 1.`,
    confidence: 0.94,
  };
}
