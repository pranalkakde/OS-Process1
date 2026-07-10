/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VivaQuestion } from '../types';

export const vivaQuestions: VivaQuestion[] = [
  {
    id: 1,
    question: "What is CPU Scheduling?",
    answer: "CPU Scheduling is the process by which the operating system decides which process in the ready queue should be allocated the CPU for execution next. It is critical for maximizing CPU utilization, minimizing waiting and turnaround times, and ensuring system fairness."
  },
  {
    id: 2,
    question: "What is the difference between Preemptive and Non-Preemptive scheduling?",
    answer: "In Non-Preemptive scheduling, once a process gets CPU control, it runs until it terminates or blocks (for I/O). In Preemptive scheduling, the OS can interrupt and suspend a currently running process to allocate the CPU to another process (e.g., when a higher priority process arrives or its time slice expires)."
  },
  {
    id: 3,
    question: "What is the Ready Queue?",
    answer: "The Ready Queue is a data structure maintained by the OS containing all processes that are currently resident in main memory, in a ready state, and waiting to be allocated CPU execution time."
  },
  {
    id: 4,
    question: "What is Context Switching and why is it considered overhead?",
    answer: "Context Switching is the process of saving the execution state (CPU registers, program counter, memory maps) of a running process and loading the saved state of the next scheduled process. It is considered 'overhead' because the CPU does no useful application work while switching contexts; it wastes CPU cycles on administrative OS tasks."
  },
  {
    id: 5,
    question: "What is the difference between Waiting Time and Turnaround Time?",
    answer: "Turnaround Time (TAT) is the total elapsed time from when a process enters the system until it completes (TAT = Completion Time - Arrival Time). Waiting Time (WT) is the portion of that time the process spent sitting passively in the ready queue waiting for the CPU (WT = Turnaround Time - Burst Time)."
  },
  {
    id: 6,
    question: "Explain the 'Convoy Effect' in FCFS scheduling.",
    answer: "The Convoy Effect occurs when a CPU-bound process with a huge burst time executes first, and multiple short, I/O-bound processes arrive shortly after and must wait behind it. This results in extremely high average waiting times and poor resource utilization."
  },
  {
    id: 7,
    question: "Why is Shortest Job First (SJF) scheduling considered optimal?",
    answer: "SJF is optimal because it mathematically minimizes the average waiting time for a constant set of processes. Scheduling shorter jobs first clears them from the system rapidly, reducing the wait times of all subsequent processes."
  },
  {
    id: 8,
    question: "What is 'Starvation' in CPU Scheduling and which algorithms suffer from it?",
    answer: "Starvation occurs when a process is ready but is indefinitely postponed from receiving the CPU because other processes are repeatedly favored. Algorithms like SJF, SRTF, and Priority Scheduling suffer from starvation if short or high-priority processes keep arriving."
  },
  {
    id: 9,
    question: "What is 'Aging' and how does it prevent starvation?",
    answer: "Aging is a mitigation technique where the OS gradually increases the priority of processes that have been waiting in the ready queue for a long time. Over time, even a low-priority process's priority rises high enough to claim the CPU, preventing indefinite starvation."
  },
  {
    id: 10,
    question: "What is a 'Time Quantum' (or Time Slice) in Round Robin?",
    answer: "A Time Quantum is a small, constant interval of time (typically 10ms to 100ms) that a process is allowed to run in the Round Robin scheduler before the OS generates a clock interrupt, preempts it, and switches to the next process in queue."
  },
  {
    id: 11,
    question: "How does the size of the Time Quantum affect Round Robin performance?",
    answer: "If the Time Quantum is extremely large, Round Robin degenerates into FCFS. If the Time Quantum is extremely small, it leads to excessive context switching overhead, wasting CPU cycles. The quantum should be balanced so that ~80% of CPU bursts are completed within it."
  },
  {
    id: 12,
    question: "What is Response Time and why is it important in interactive systems?",
    answer: "Response Time is the time elapsed from when a process is submitted (arrival) to when it starts executing on the CPU for the first time. In interactive systems (like GUI applications or web servers), rapid response time is critical for a smooth user experience, even if the total completion takes longer."
  },
  {
    id: 13,
    question: "What is CPU Utilization and how is it calculated?",
    answer: "CPU Utilization is the percentage of total time the CPU is actively executing user processes instead of being idle. It is calculated as: (Total Simulation Time - Idle Time) / Total Simulation Time * 100."
  },
  {
    id: 14,
    question: "Define 'Throughput' in CPU scheduling.",
    answer: "Throughput is the number of processes completed by the CPU per unit of time (e.g., processes per millisecond). Higher throughput indicates that more work is being accomplished by the system."
  },
  {
    id: 15,
    question: "What is Multilevel Queue (MLQ) scheduling?",
    answer: "MLQ partitions the ready queue into several separate queues based on process criteria (e.g., system vs user, foreground vs background). Each queue has its own scheduling algorithm, and there is high-level scheduling between queues, usually preemptive priority."
  },
  {
    id: 16,
    question: "What is Multilevel Feedback Queue (MLFQ) scheduling?",
    answer: "MLFQ is an extension of MLQ where processes can dynamically move between queues. A process that uses too much CPU time is demoted to a lower priority queue, while processes that wait too long are aged and promoted to higher queues. This dynamically optimizes interactive performance."
  },
  {
    id: 17,
    question: "What is the difference between MLQ and MLFQ?",
    answer: "In Multilevel Queue (MLQ), processes are statically and permanently assigned to a queue. In Multilevel Feedback Queue (MLFQ), processes can move dynamically between queues based on their CPU usage and waiting history."
  },
  {
    id: 18,
    question: "What is the dispatcher in an operating system?",
    answer: "The dispatcher is the module that actually gives control of the CPU to the process selected by the short-term scheduler. It handles switching context, switching to user mode, and jumping to the proper location in the program to resume execution."
  },
  {
    id: 19,
    question: "What is Dispatch Latency?",
    answer: "Dispatch Latency is the time taken by the dispatcher to stop one process, save its context, and start another process. Lower dispatch latency is essential for fast system performance and real-time responsiveness."
  },
  {
    id: 20,
    question: "What is the role of a Short-term Scheduler (CPU Scheduler)?",
    answer: "The short-term scheduler selects from among the processes in memory that are ready to execute and allocates the CPU to one of them. It runs very frequently (millisecond intervals) and must be extremely fast."
  },
  {
    id: 21,
    question: "What is the difference between a Long-term and Short-term scheduler?",
    answer: "The Long-term Scheduler (Job Scheduler) selects processes from a pool (disk) and loads them into memory for execution, controlling the degree of multiprogramming. The Short-term Scheduler (CPU Scheduler) selects which in-memory ready process runs next."
  },
  {
    id: 22,
    question: "What is Medium-term Scheduling?",
    answer: "Medium-term Scheduling involves swapping processes out of main memory into virtual memory disk storage (and back) to reduce the degree of multiprogramming when memory is over-committed, resolving thrashing."
  },
  {
    id: 23,
    question: "What is a 'CPU-bound' process vs an 'I/O-bound' process?",
    answer: "A CPU-bound process spends most of its time performing mathematical or logical calculations on the processor. An I/O-bound process spends most of its time waiting for input/output operations (disk, keyboard, network) to complete, using very little CPU burst time."
  },
  {
    id: 24,
    question: "What is Priority Inversion?",
    answer: "Priority Inversion is a hazard where a low-priority process holds a shared resource needed by a high-priority process, blocking it. If a medium-priority process preempts the low-priority process, the high-priority process is indirectly blocked by the medium-priority process."
  },
  {
    id: 25,
    question: "How can Priority Inversion be resolved?",
    answer: "It can be resolved using the 'Priority Inheritance Protocol' where the low-priority process holding the resource temporarily inherits the high priority of the waiting process until it releases the resource."
  },
  {
    id: 26,
    question: "What is a 'Gantt Chart' in Operating Systems?",
    answer: "A Gantt Chart is a visual horizontal timeline chart that represents the sequence and duration of process executions on the CPU. It is a standard tool for demonstrating and teaching CPU scheduling execution orders."
  },
  {
    id: 27,
    question: "Can SJF be implemented in general purpose OS? Why or why not?",
    answer: "No, SJF cannot be perfectly implemented in general-purpose OS because it is impossible to know the exact duration of a future CPU burst. Instead, operating systems estimate future bursts using exponential smoothing of historical bursts."
  },
  {
    id: 28,
    question: "What scheduling algorithm is commonly used in modern operating systems like Windows or Linux?",
    answer: "Modern operating systems use complex, preemptive, priority-based, multilevel feedback scheduling. For example, Linux uses the Completely Fair Scheduler (CFS) which uses red-black trees to balance CPU shares, while Windows uses a priority-based preemptive feedback queue structure."
  },
  {
    id: 29,
    question: "What is the 'nice' value in UNIX/Linux systems?",
    answer: "The 'nice' value is a user-space parameter (-20 to 19) used to adjust a process's scheduling priority. A higher nice value makes the process 'nice' to others by lowering its priority, while a negative nice value increases its priority."
  },
  {
    id: 30,
    question: "What is Hard Real-time vs Soft Real-time scheduling?",
    answer: "In Hard Real-time systems, meeting critical deadlines is absolute; missing a deadline means complete system failure (e.g., pacemaker, pac-lock brakes). In Soft Real-time systems, meeting deadlines is preferred but missing one is tolerable with degraded service (e.g., video streaming)."
  }
];
