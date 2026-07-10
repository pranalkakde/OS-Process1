/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AlgorithmDetail {
  id: string;
  name: string;
  fullName: string;
  definition: string;
  characteristics: string[];
  advantages: string[];
  disadvantages: string[];
  steps: string[];
  formulas: {
    waitingTime: string;
    turnaroundTime: string;
  };
  complexity: {
    time: string;
    space: string;
  };
  realLifeExample: string;
  academicExample: {
    processes: { id: string; arrival: number; burst: number; priority?: number }[];
    gantt: { id: string; duration: number }[];
    waitingTimes: { [id: string]: number };
    turnaroundTimes: { [id: string]: number };
    avgWaiting: number;
    avgTurnaround: number;
  };
}

export const algorithmsData: AlgorithmDetail[] = [
  {
    id: 'FCFS',
    name: 'FCFS',
    fullName: 'First Come First Serve',
    definition: 'FCFS is the simplest scheduling algorithm that executes processes in the order they arrive in the ready queue. It is non-preemptive, meaning once a process gets CPU allocation, it keeps it until it completes or blocks.',
    characteristics: [
      'Non-preemptive algorithm',
      'Based on FIFO (First-In, First-Out) queue',
      'Simple to understand and implement',
      'Suffers from the Convoy Effect'
    ],
    advantages: [
      'Extremely easy to program and maintain.',
      'No starvation possible; every process eventually gets executed.',
      'Fair in terms of request order.'
    ],
    disadvantages: [
      'Convoy Effect: Short processes wait behind a very long process, resulting in high average waiting times.',
      'No priority consideration.',
      'Poor choice for interactive or time-sharing systems.'
    ],
    steps: [
      'Maintain a FIFO queue of arriving processes.',
      'When the CPU is free, assign it to the process at the head of the queue.',
      'Let the process run to completion (or until it yields).',
      'Remove the completed process and fetch the next process from the queue.',
      'Repeat until all processes are executed.'
    ],
    formulas: {
      waitingTime: 'Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)  [OR]  Start Time - Arrival Time',
      turnaroundTime: 'Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)'
    },
    complexity: {
      time: 'O(N) where N is the number of processes (if sorted by arrival time)',
      space: 'O(N) to store process state in the ready queue'
    },
    realLifeExample: 'People waiting in a single queue at a supermarket checkout. The cashier serves the customer at the front, and others wait behind in order of arrival.',
    academicExample: {
      processes: [
        { id: 'P1', arrival: 0, burst: 4 },
        { id: 'P2', arrival: 1, burst: 3 },
        { id: 'P3', arrival: 2, burst: 1 }
      ],
      gantt: [
        { id: 'P1', duration: 4 },
        { id: 'P2', duration: 3 },
        { id: 'P3', duration: 1 }
      ],
      waitingTimes: { 'P1': 0, 'P2': 3, 'P3': 5 },
      turnaroundTimes: { 'P1': 4, 'P2': 6, 'P3': 6 },
      avgWaiting: 2.67,
      avgTurnaround: 5.33
    }
  },
  {
    id: 'SJF',
    name: 'SJF',
    fullName: 'Shortest Job First (Non-Preemptive)',
    definition: 'SJF schedules the process with the shortest burst time next. If two processes have the same remaining burst time, FCFS is used as a tie-breaker. It is non-preemptive; once allocated, it runs to completion.',
    characteristics: [
      'Non-preemptive algorithm',
      'Requires prior knowledge of burst times',
      'Provides optimal average waiting time for static workloads',
      'Can lead to starvation of longer processes'
    ],
    advantages: [
      'Guarantees the lowest possible average waiting time for a set of non-preemptive processes.',
      'Highly efficient for environments where process lengths are known.'
    ],
    disadvantages: [
      'Impossible to know the exact CPU burst time of a process in advance; must be estimated using exponential smoothing.',
      'Starvation (indefinite postponement): Long-running processes may never execute if short processes keep arriving.'
    ],
    steps: [
      'When the CPU becomes idle, inspect all processes currently in the ready queue.',
      'Select the process with the smallest burst time.',
      'In case of a tie, select the process that arrived first (FCFS tie-breaker).',
      'Execute the selected process to completion without preemption.'
    ],
    formulas: {
      waitingTime: 'Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)',
      turnaroundTime: 'Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)'
    },
    complexity: {
      time: 'O(N log N) or O(N^2) depending on the search/sorting implementation of the ready queue',
      space: 'O(N) to store processes'
    },
    realLifeExample: 'A busy surgeon performing operations. The surgeon chooses to perform the shortest minor surgeries first to clear patients quickly, while the complex, long operations wait.',
    academicExample: {
      processes: [
        { id: 'P1', arrival: 0, burst: 6 },
        { id: 'P2', arrival: 2, burst: 2 },
        { id: 'P3', arrival: 3, burst: 8 },
        { id: 'P4', arrival: 4, burst: 3 }
      ],
      gantt: [
        { id: 'P1', duration: 6 }, // runs to completion because no other process is present at t=0
        { id: 'P2', duration: 2 }, // at t=6, ready are P2, P3, P4. P2 has burst 2 (shortest)
        { id: 'P4', duration: 3 }, // at t=8, ready are P3, P4. P4 has burst 3
        { id: 'P3', duration: 8 }  // at t=11, only P3 remains
      ],
      waitingTimes: { 'P1': 0, 'P2': 4, 'P3': 8, 'P4': 4 },
      turnaroundTimes: { 'P1': 6, 'P2': 6, 'P3': 16, 'P4': 7 },
      avgWaiting: 4.0,
      avgTurnaround: 8.75
    }
  },
  {
    id: 'SRTF',
    name: 'SRTF',
    fullName: 'Shortest Remaining Time First (Preemptive SJF)',
    definition: 'SRTF is the preemptive version of Shortest Job First. If a new process arrives with a CPU burst time less than the remaining execution time of the currently running process, the running process is preempted and the new process is allocated CPU.',
    characteristics: [
      'Preemptive algorithm',
      'Preempts when a shorter remaining time job arrives',
      'Provides minimum average waiting time for preemptive cases',
      'Frequent context switching overhead'
    ],
    advantages: [
      'Highly responsive for short processes arriving dynamically.',
      'Optimal scheduling algorithm for minimizing average waiting and turnaround times.'
    ],
    disadvantages: [
      'High context-switching overhead because the scheduler has to compare burst times upon every arrival.',
      'Starvation of longer processes if short processes continue to arrive sequentially.'
    ],
    steps: [
      'At any time t, select the process with the minimum remaining burst time.',
      'If a new process arrives, compare its burst time with the remaining burst time of the running process.',
      'If the new process is shorter, preempt the running process; save its state, and load the new process.',
      'Update remaining burst time of the running process at each step.'
    ],
    formulas: {
      waitingTime: 'Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)',
      turnaroundTime: 'Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)'
    },
    complexity: {
      time: 'O(N^2) or O(N log N) using priority heaps updated on arrival/completion',
      space: 'O(N)'
    },
    realLifeExample: 'An executive answering emails. While writing a 2-hour report, a 5-minute approval email arrives. The executive immediately stops the report, replies to the email, and then resumes the report.',
    academicExample: {
      processes: [
        { id: 'P1', arrival: 0, burst: 8 },
        { id: 'P2', arrival: 1, burst: 4 },
        { id: 'P3', arrival: 2, burst: 9 },
        { id: 'P4', arrival: 3, burst: 5 }
      ],
      gantt: [
        { id: 'P1', duration: 1 }, // P1 starts. At t=1, P2 arrives (burst 4). P1 remaining is 7. P2 is shorter, so P1 preempts.
        { id: 'P2', duration: 4 }, // P2 runs to completion from t=1 to t=5. At t=2, P3 (9) arrives, t=3, P4 (5) arrives, but P2 remains shortest.
        { id: 'P4', duration: 5 }, // At t=5, P2 is done. Ready: P1 (rem 7), P3 (9), P4 (5). P4 is shortest.
        { id: 'P1', duration: 7 }, // At t=10, P4 is done. Ready: P1 (rem 7), P3 (9). P1 runs.
        { id: 'P3', duration: 9 }  // At t=17, P1 is done. P3 runs.
      ],
      waitingTimes: { 'P1': 9, 'P2': 0, 'P3': 15, 'P4': 2 },
      turnaroundTimes: { 'P1': 17, 'P2': 4, 'P3': 24, 'P4': 7 },
      avgWaiting: 6.5,
      avgTurnaround: 13.0
    }
  },
  {
    id: 'PRIORITY',
    name: 'Priority',
    fullName: 'Priority Scheduling (Preemptive & Non-Preemptive)',
    definition: 'Priority scheduling assigns a priority level to each process. The CPU is allocated to the process with the highest priority. It can be preemptive (preempts if a higher-priority process arrives) or non-preemptive.',
    characteristics: [
      'Available in Preemptive and Non-Preemptive modes',
      'Usually lower number represents higher priority (e.g., 1 is highest)',
      'Addresses urgency/importance directly',
      'Suffers from Starvation (Indefinite blocking) solved via Aging'
    ],
    advantages: [
      'Allows administrative control over process importance (e.g., system processes get higher priority than user processes).',
      'Provides support for real-time systems.'
    ],
    disadvantages: [
      'Starvation: Low-priority processes may never run if high-priority processes keep arriving.',
      'Implementation of Priority Aging (gradually increasing priority over time) adds overhead.'
    ],
    steps: [
      'Assign an integer priority level to each process.',
      'Check the ready queue and select the process with the highest priority (lowest priority number).',
      'If Preemptive: If a process with higher priority arrives, immediately preempt the current process.',
      'If Non-Preemptive: Allow the current process to finish before re-evaluating priorities.'
    ],
    formulas: {
      waitingTime: 'Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)',
      turnaroundTime: 'Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)'
    },
    complexity: {
      time: 'O(N^2) or O(N log N) using heaps',
      space: 'O(N)'
    },
    realLifeExample: 'An emergency room triage. A patient with a life-threatening injury is treated immediately, ahead of someone with a minor fracture, regardless of who arrived first.',
    academicExample: {
      processes: [
        { id: 'P1', arrival: 0, burst: 4, priority: 3 },
        { id: 'P2', arrival: 1, burst: 3, priority: 1 },
        { id: 'P3', arrival: 2, burst: 1, priority: 4 },
        { id: 'P4', arrival: 3, burst: 5, priority: 2 }
      ],
      gantt: [
        { id: 'P1', duration: 4 }, // Non-preemptive sample: P1 starts at t=0. Runs to t=4.
        { id: 'P2', duration: 3 }, // At t=4, ready: P2 (prio 1), P3 (prio 4), P4 (prio 2). P2 runs.
        { id: 'P4', duration: 5 }, // At t=7, ready: P3 (prio 4), P4 (prio 2). P4 runs.
        { id: 'P3', duration: 1 }  // At t=12, P3 runs.
      ],
      waitingTimes: { 'P1': 0, 'P2': 3, 'P3': 10, 'P4': 4 },
      turnaroundTimes: { 'P1': 4, 'P2': 6, 'P3': 11, 'P4': 9 },
      avgWaiting: 4.25,
      avgTurnaround: 7.5
    }
  },
  {
    id: 'RR',
    name: 'Round Robin',
    fullName: 'Round Robin Scheduling (RR)',
    definition: 'Round Robin is designed specifically for time-sharing systems. It assigns a small, fixed unit of time called a Time Quantum (or time slice) to each process in circular order. If a process does not complete within its quantum, it is preempted and put at the tail of the ready queue.',
    characteristics: [
      'Preemptive algorithm based on clock interrupts',
      'Cyclic execution structure',
      'Highly fair; equal opportunity for all processes',
      'Performance heavily depends on the Time Quantum value'
    ],
    advantages: [
      'Excellent response time for interactive processes; no process waits more than (N-1)*Quantum.',
      'No starvation; every process progresses in small, fair bursts.',
      'Easy to implement with a simple circular queue.'
    ],
    disadvantages: [
      'Context switching overhead is high if the Time Quantum is very small.',
      'Large Turnaround Times compared to SJF/SRTF when burst times are uniform.',
      'If Time Quantum is too large, it degenerates into FCFS.'
    ],
    steps: [
      'Create a FIFO ready queue and set a constant Time Quantum.',
      'Load the first arrived process from the queue and run it for up to Time Quantum units.',
      'If the process completes before the quantum expires, release the CPU.',
      'If it exceeds the quantum, preempt it, record its remaining burst time, and append it to the tail of the ready queue.',
      'Simultaneously, queue any newly arrived processes during this time.',
      'Run the next process from the queue head. Repeat.'
    ],
    formulas: {
      waitingTime: 'Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)',
      turnaroundTime: 'Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)'
    },
    complexity: {
      time: 'O(N) with circular queue operations',
      space: 'O(N) queue storage'
    },
    realLifeExample: 'A teacher grading exams in a classroom. The teacher spends exactly 2 minutes on each student\'s paper. If not finished in 2 minutes, they move the paper to the bottom of the pile and grade the next student\'s, ensuring everyone gets some progress.',
    academicExample: {
      processes: [
        { id: 'P1', arrival: 0, burst: 5 },
        { id: 'P2', arrival: 1, burst: 3 },
        { id: 'P3', arrival: 2, burst: 1 }
      ],
      gantt: [
        { id: 'P1', duration: 2 }, // P1 runs t=0..2 (rem 3). P2, P3 arrive. Queue: [P2, P3, P1]
        { id: 'P2', duration: 2 }, // P2 runs t=2..4 (rem 1). Queue: [P3, P1, P2]
        { id: 'P3', duration: 1 }, // P3 runs t=4..5 (done). Queue: [P1, P2]
        { id: 'P1', duration: 2 }, // P1 runs t=5..7 (rem 1). Queue: [P2, P1]
        { id: 'P2', duration: 1 }, // P2 runs t=7..8 (done). Queue: [P1]
        { id: 'P1', duration: 1 }  // P1 runs t=8..9 (done)
      ],
      waitingTimes: { 'P1': 4, 'P2': 4, 'P3': 2 },
      turnaroundTimes: { 'P1': 9, 'P2': 7, 'P3': 3 },
      avgWaiting: 3.33,
      avgTurnaround: 6.33
    }
  },
  {
    id: 'MLQ',
    name: 'Multilevel Queue',
    fullName: 'Multilevel Queue Scheduling',
    definition: 'Multilevel Queue scheduling partitions the ready queue into several separate queues based on process characteristics (e.g., system vs. user processes, interactive vs. batch). Each queue has its own scheduling algorithm, and there is scheduling among the queues, usually preemptive high-priority-first.',
    characteristics: [
      'Static division of processes into classes',
      'Different queues have different scheduling priorities and algorithms (e.g., RR for foreground, FCFS for background)',
      'Processes are permanently assigned to a queue upon entry',
      'High risk of starvation for lower-priority queues'
    ],
    advantages: [
      'Allows matching specific scheduling algorithms to the nature of different process queues.',
      'Saves overhead for systems with clear, fixed divisions of workloads.'
    ],
    disadvantages: [
      'Inflexible: Processes cannot change queues once assigned.',
      'Low priority queues (like Batch/Background) can suffer absolute starvation if interactive queues are constantly active.'
    ],
    steps: [
      'Define multiple sub-queues (e.g., System, Interactive, Batch).',
      'Permanently assign each incoming process to its designated queue based on attributes.',
      'Assign absolute priority levels to the queues (e.g., Queue 1 > Queue 2).',
      'Schedule Queue 1 processes. Lower queues are scheduled only when higher queues are completely empty.'
    ],
    formulas: {
      waitingTime: 'Varies based on sub-algorithms used inside each queue (e.g., FCFS, RR).',
      turnaroundTime: 'Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)'
    },
    complexity: {
      time: 'O(N) to dispatch from high-priority non-empty queues',
      space: 'O(N)'
    },
    realLifeExample: 'Airport Security Lines. Separate queues exist for First Class/Crew (Queue 1, high priority), Frequent Flyer (Queue 2, medium priority), and General Economy (Queue 3, low priority). Economy passengers are cleared only when crew and first class queues are clear.',
    academicExample: {
      processes: [
        { id: 'System_P1', arrival: 0, burst: 3, priority: 1 }, // Queue 1 (High priority, FCFS)
        { id: 'User_P2', arrival: 1, burst: 4, priority: 2 }   // Queue 2 (Low priority, RR)
      ],
      gantt: [
        { id: 'System_P1', duration: 3 }, // Runs first as it resides in Queue 1
        { id: 'User_P2', duration: 4 }    // Runs only after Queue 1 becomes empty at t=3
      ],
      waitingTimes: { 'System_P1': 0, 'User_P2': 2 },
      turnaroundTimes: { 'System_P1': 3, 'User_P2': 6 },
      avgWaiting: 1.0,
      avgTurnaround: 4.5
    }
  },
  {
    id: 'MLFQ',
    name: 'Multilevel Feedback Queue',
    fullName: 'Multilevel Feedback Queue Scheduling (MLFQ)',
    definition: 'MLFQ is the most complex CPU scheduling design. It partitions the ready queue like MLQ, but allows processes to move between queues. It dynamically adjusts priorities based on CPU burst history. If a process uses too much CPU time, it is demoted to a lower-priority queue; if a process waits too long, it is aged (promoted) to a higher-priority queue.',
    characteristics: [
      'Dynamic priorities and process movement between queues',
      'Configured by number of queues, scheduling algorithm for each, demotion/promotion criteria',
      'Prevents starvation through Aging',
      'Optimizes Turnaround Time and Response Time'
    ],
    advantages: [
      'Extremely flexible and adaptive to varying system workloads.',
      'Acts as a black box that automatically discovers process behavior (interactive vs. computation-heavy) and schedules accordingly.',
      'Solves starvation completely using Aging.'
    ],
    disadvantages: [
      'Most complex scheduler to configure; requires fine-tuning of many threshold parameters (quantum size, promotion time, etc.).',
      'High scheduler computation overhead.'
    ],
    steps: [
      'Set up Queues Q0 (highest priority, small RR quantum), Q1 (medium priority, larger RR quantum), and Q2 (lowest priority, FCFS).',
      'New processes enter Q0. If they finish within Q0\'s quantum, they leave.',
      'If a process in Q0 runs for the full quantum without finishing, demote it to Q1.',
      'If a process in Q1 does not finish in Q1\'s quantum, demote it to Q2.',
      'Processes in Q2 are scheduled only when Q0 and Q1 are empty.',
      'Add an Aging routine: if a process stays in a lower queue for more than T units, promote it to Q0/Q1.'
    ],
    formulas: {
      waitingTime: 'Determined dynamically through queue promotion and demotion timestamps.',
      turnaroundTime: 'Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)'
    },
    complexity: {
      time: 'O(N) queue operations with periodic O(N) aging sweeps',
      space: 'O(N)'
    },
    realLifeExample: 'A technical support helpdesk. Level 1 support (Queue 0) answers simple questions quickly. If a ticket takes more than 10 minutes, it is escalated to Level 2 (Queue 1). Extremely hard bugs go to Level 3 (Queue 2) who work in FCFS order. Long-waiting tickets are escalated back up.',
    academicExample: {
      processes: [
        { id: 'Interactive_P1', arrival: 0, burst: 2 }, // finishes in Q0 (Quantum = 2)
        { id: 'Compute_P2', arrival: 0, burst: 6 }     // enters Q0, demoted to Q1, then Q2
      ],
      gantt: [
        { id: 'Interactive_P1', duration: 2 }, // executes in Q0 (takes 2s, completes!)
        { id: 'Compute_P2', duration: 2 },     // runs in Q0 for 2s, does not finish, demoted to Q1
        { id: 'Compute_P2', duration: 4 }      // runs in Q1 (Quantum = 4), finishes!
      ],
      waitingTimes: { 'Interactive_P1': 0, 'Compute_P2': 2 },
      turnaroundTimes: { 'Interactive_P1': 2, 'Compute_P2': 8 },
      avgWaiting: 1.0,
      avgTurnaround: 5.0
    }
  }
];
