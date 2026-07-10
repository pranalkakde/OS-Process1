/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is CPU scheduling?",
    options: [
      "The process of allocating main memory to active processes",
      "The process of selecting which process in the ready queue is to be allocated the CPU",
      "The process of saving and restoring the CPU registers",
      "The process of loading programs from disk into main memory"
    ],
    correctAnswerIndex: 1,
    explanation: "CPU Scheduling is the process by which the operating system selects a process from the ready queue and allocates the CPU to it for execution."
  },
  {
    id: 2,
    question: "Which of the following scheduling algorithms is strictly non-preemptive?",
    options: [
      "Round Robin",
      "First Come First Serve (FCFS)",
      "Shortest Remaining Time First (SRTF)",
      "Preemptive Priority"
    ],
    correctAnswerIndex: 1,
    explanation: "First Come First Serve (FCFS) is strictly non-preemptive. Once a process gets control of the CPU, it runs until it terminates or blocks for I/O."
  },
  {
    id: 3,
    question: "What is the 'Convoy Effect' in FCFS scheduling?",
    options: [
      "Many short processes wait behind a single long process, leading to high average waiting times",
      "Processes are continuously preempted due to clock interrupts",
      "High priority processes block lower priority processes indefinitely",
      "CPU remains idle because no processes are in the ready queue"
    ],
    correctAnswerIndex: 0,
    explanation: "The Convoy Effect occurs when a CPU-bound process with a long burst time gets the CPU, and all other short I/O-bound processes have to wait behind it, dragging down average waiting time."
  },
  {
    id: 4,
    question: "Which scheduling algorithm yields the mathematically minimum average waiting time for a constant set of non-preemptive processes?",
    options: [
      "First Come First Serve",
      "Round Robin",
      "Shortest Job First (SJF)",
      "Priority Scheduling"
    ],
    correctAnswerIndex: 2,
    explanation: "Shortest Job First (SJF) is mathematically optimal because scheduling the shortest job next minimizes the waiting time of subsequent processes in queue."
  },
  {
    id: 5,
    question: "Shortest Remaining Time First (SRTF) is the preemptive version of:",
    options: [
      "First Come First Serve",
      "Shortest Job First",
      "Round Robin",
      "Priority Scheduling"
    ],
    correctAnswerIndex: 1,
    explanation: "SRTF is the preemptive version of SJF. When a new process arrives with a shorter remaining time than the executing process, preemption occurs."
  },
  {
    id: 6,
    question: "What does 'Starvation' (or indefinite blocking) mean in OS scheduling?",
    options: [
      "The CPU runs out of electrical power",
      "A process terminates abruptly due to memory leak",
      "A process waits indefinitely in the ready queue because other processes are continuously chosen ahead of it",
      "The system enters a deadlock where two processes hold resources needed by each other"
    ],
    correctAnswerIndex: 2,
    explanation: "Starvation occurs when a process is ready to execute but is continuously bypassed by the scheduler in favor of other processes (e.g., short or high-priority processes)."
  },
  {
    id: 7,
    question: "How does the 'Aging' technique solve starvation in Priority and SJF scheduling?",
    options: [
      "By terminating older processes to clear queue space",
      "By gradually increasing the priority of processes that wait in the ready queue for a long time",
      "By allocating more RAM to older processes",
      "By automatically decreasing the time quantum of CPU-bound tasks"
    ],
    correctAnswerIndex: 1,
    explanation: "Aging is a technique where the priority of a process waiting in the ready queue is periodically increased. This ensures that even the lowest-priority process will eventually become the highest-priority and run."
  },
  {
    id: 8,
    question: "Which of the following parameters is mandatory for implementing Round Robin (RR) scheduling?",
    options: [
      "Process priority value",
      "Remaining burst ratio",
      "Time Quantum (or Time Slice)",
      "Context switch interval delay"
    ],
    correctAnswerIndex: 2,
    explanation: "Round Robin requires a Time Quantum, which is the fixed, maximum duration a process is allowed to run before being preempted and placed at the end of the queue."
  },
  {
    id: 9,
    question: "If the Time Quantum in a Round Robin scheduling system is extremely large (e.g., larger than any burst time), the algorithm behaves exactly like:",
    options: [
      "Shortest Job First",
      "First Come First Serve",
      "Shortest Remaining Time First",
      "Priority Scheduling"
    ],
    correctAnswerIndex: 1,
    explanation: "If the Time Quantum is greater than any process's burst time, no process will ever be preempted. It will execute to completion in arrival order, making it behave exactly like FCFS."
  },
  {
    id: 10,
    question: "What is the formula to calculate Turnaround Time (TAT)?",
    options: [
      "TAT = Waiting Time - Burst Time",
      "TAT = Completion Time - Arrival Time",
      "TAT = Arrival Time + Burst Time",
      "TAT = Completion Time - Waiting Time"
    ],
    correctAnswerIndex: 1,
    explanation: "Turnaround Time (TAT) is the total time spent by a process in the system from arrival to completion. Formula: TAT = Completion Time (CT) - Arrival Time (AT)."
  },
  {
    id: 11,
    question: "What is the formula to calculate Waiting Time (WT)?",
    options: [
      "WT = Turnaround Time + Burst Time",
      "WT = Completion Time - Arrival Time",
      "WT = Turnaround Time - Burst Time",
      "WT = Completion Time - Response Time"
    ],
    correctAnswerIndex: 2,
    explanation: "Waiting Time is the time a process spends waiting in the ready queue. Formula: WT = Turnaround Time (TAT) - Burst Time (BT)."
  },
  {
    id: 12,
    question: "What is Response Time in CPU scheduling?",
    options: [
      "The total time from process arrival to its complete termination",
      "The time interval between process submission and the first CPU response (start of execution)",
      "The time taken by the CPU to switch from one process context to another",
      "The execution speed of the arithmetic logic unit"
    ],
    correctAnswerIndex: 1,
    explanation: "Response Time is the time from when a process enters the ready queue (AT) until it first gets allocated the CPU (Start Time). Formula: RT = Start Time - Arrival Time."
  },
  {
    id: 13,
    question: "What is Context Switching?",
    options: [
      "Placing a process from RAM into Virtual Memory swap space",
      "Changing the priority of a process dynamically",
      "The process of saving the state of a running process and loading the state of another process on the CPU",
      "Switching between user modes and kernel modes during an interrupt"
    ],
    correctAnswerIndex: 2,
    explanation: "Context Switching is the mechanism of saving the state (context) of a CPU-active process so that it can be resumed later, and loading the saved state of the next process scheduled to run."
  },
  {
    id: 14,
    question: "Which of the following is an advantage of Multilevel Feedback Queue (MLFQ) scheduling?",
    options: [
      "It is incredibly simple and requires no configuration parameters",
      "It completely eliminates context switching overhead",
      "It dynamically separates interactive processes from CPU-heavy computation processes",
      "It does not require any CPU hardware timer interrupts"
    ],
    correctAnswerIndex: 2,
    explanation: "MLFQ is highly adaptive. Interactive jobs (which have short bursts) stay in higher-priority queues with small quantum slices, while computation-heavy jobs sink to lower-priority queues."
  },
  {
    id: 15,
    question: "Which metric represents the number of processes completed by the CPU per unit of time?",
    options: [
      "Throughput",
      "CPU Utilization",
      "Turnaround ratio",
      "Slab Allocation Rate"
    ],
    correctAnswerIndex: 0,
    explanation: "Throughput is defined as the number of processes completed per unit time. High throughput indicates an efficient operating system."
  },
  {
    id: 16,
    question: "If a system performs excessive context switching, what is the negative impact?",
    options: [
      "Waiting time decreases to 0",
      "Throughput and CPU efficiency drop because valuable CPU cycles are wasted on overhead tasks",
      "Memory leak crashes the storage drives",
      "The system automatically changes all algorithms to FCFS"
    ],
    correctAnswerIndex: 1,
    explanation: "Context switching requires saving/restoring registers and flushing caches. If done too frequently (e.g., with an extremely small Round Robin quantum), the CPU spends more time on scheduler overhead than executing user processes."
  },
  {
    id: 17,
    question: "In Priority Scheduling, what does 'Priority Inversion' mean?",
    options: [
      "A low priority process gets executed before a high priority process",
      "All process priorities are reversed when dark mode is toggled",
      "A lower-priority process holds a resource needed by a higher-priority process, indirectly blocking it",
      "A process changes its priority dynamically"
    ],
    correctAnswerIndex: 2,
    explanation: "Priority Inversion is a scenario where a low-priority process holds a resource (e.g., a mutex) needed by a high-priority process. If a medium-priority process preempts the low-priority process, the high-priority process is indirectly blocked by the medium-priority process."
  },
  {
    id: 18,
    question: "In Multilevel Queue (MLQ) scheduling, can processes move between queues?",
    options: [
      "Yes, always",
      "No, processes are permanently assigned to one queue upon arrival",
      "Only if they undergo aging",
      "Only if the user manually overrides queue settings"
    ],
    correctAnswerIndex: 1,
    explanation: "In standard Multilevel Queue (MLQ) scheduling, processes are permanently assigned to a queue (e.g., interactive vs background). In contrast, Multilevel Feedback Queue (MLFQ) allows processes to move dynamically between queues."
  },
  {
    id: 19,
    question: "Which of the following is a real-world example of Priority-based preemption?",
    options: [
      "A customer service desk serving callers in exact receipt order",
      "A teacher answering the questions of the quietest student first",
      "An ambulance with sirens active getting priority lane access over standard traffic",
      "Dividing a pizza into equal slices for a family"
    ],
    correctAnswerIndex: 2,
    explanation: "An emergency vehicle (ambulance) acts as a high-priority interrupt that preempts other ongoing standard vehicle processes on a road."
  },
  {
    id: 20,
    question: "Under what condition does Round Robin suffer from poor performance?",
    options: [
      "When the Time Quantum is equal to the longest burst time",
      "When the processes have vastly different burst times",
      "When the Time Quantum is extremely small, causing excessive context switching",
      "When there are no arrival time overlaps"
    ],
    correctAnswerIndex: 2,
    explanation: "If the Time Quantum is too small, the scheduler generates a huge number of context switches. The CPU spends most of its time swapping processes, which degrades user-level performance."
  }
];
