/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProgramCode } from '../types';

export const programsData: ProgramCode[] = [
  {
    id: "fcfs-c",
    title: "FCFS (First Come First Serve)",
    algorithmName: "FCFS",
    code: `#include <stdio.h>

// Structure to hold process details
struct Process {
    int id;
    int arrival_time;
    int burst_time;
    int completion_time;
    int turnaround_time;
    int waiting_time;
};

void calculate_times(struct Process proc[], int n) {
    int current_time = 0;
    
    for (int i = 0; i < n; i++) {
        // Handle CPU idle time
        if (current_time < proc[i].arrival_time) {
            current_time = proc[i].arrival_time;
        }
        
        proc[i].completion_time = current_time + proc[i].burst_time;
        proc[i].turnaround_time = proc[i].completion_time - proc[i].arrival_time;
        proc[i].waiting_time = proc[i].turnaround_time - proc[i].burst_time;
        
        current_time = proc[i].completion_time;
    }
}

void sort_by_arrival(struct Process proc[], int n) {
    struct Process temp;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (proc[j].arrival_time > proc[j + 1].arrival_time) {
                temp = proc[j];
                proc[j] = proc[j + 1];
                proc[j + 1] = temp;
            }
        }
    }
}

void print_table(struct Process proc[], int n) {
    float total_wt = 0, total_tat = 0;
    
    printf("\\nPID\\tArrival\\tBurst\\tComplete\\tTurnaround\\tWaiting\\n");
    for (int i = 0; i < n; i++) {
        total_wt += proc[i].waiting_time;
        total_tat += proc[i].turnaround_time;
        printf("P%d\\t%d\\t%d\\t%d\\t\\t%d\\t\\t%d\\n", 
               proc[i].id, proc[i].arrival_time, proc[i].burst_time,
               proc[i].completion_time, proc[i].turnaround_time, proc[i].waiting_time);
    }
    
    printf("\\nAverage Waiting Time: %.2f", total_wt / n);
    printf("\\nAverage Turnaround Time: %.2f\\n", total_tat / n);
}

int main() {
    int n;
    printf("OS Scheduler Lab - FCFS C Program\\n");
    printf("Enter number of processes: ");
    scanf("%d", &n);
    
    struct Process proc[10];
    for (int i = 0; i < n; i++) {
        proc[i].id = i + 1;
        printf("Enter Arrival Time and Burst Time for P%d: ", i + 1);
        scanf("%d %d", &proc[i].arrival_time, &proc[i].burst_time);
    }
    
    // FCFS requires sorting by arrival time first
    sort_by_arrival(proc, n);
    calculate_times(proc, n);
    print_table(proc, n);
    
    return 0;
}`
  },
  {
    id: "sjf-c",
    title: "SJF (Shortest Job First - Non-Preemptive)",
    algorithmName: "SJF (Non-Preemptive)",
    code: `#include <stdio.h>
#include <stdbool.h>

struct Process {
    int id;
    int arrival_time;
    int burst_time;
    int completion_time;
    int turnaround_time;
    int waiting_time;
    bool completed;
};

int main() {
    int n, completed = 0, current_time = 0;
    float total_wt = 0, total_tat = 0;
    
    printf("OS Scheduler Lab - SJF Non-Preemptive C Program\\n");
    printf("Enter number of processes: ");
    scanf("%d", &n);
    
    struct Process proc[10];
    for (int i = 0; i < n; i++) {
        proc[i].id = i + 1;
        proc[i].completed = false;
        printf("Enter Arrival Time and Burst Time for P%d: ", i + 1);
        scanf("%d %d", &proc[i].arrival_time, &proc[i].burst_time);
    }
    
    while (completed < n) {
        int index = -1;
        int min_burst = 1e9; // infinity helper
        
        // Find arrived process with shortest burst time
        for (int i = 0; i < n; i++) {
            if (proc[i].arrival_time <= current_time && !proc[i].completed) {
                if (proc[i].burst_time < min_burst) {
                    min_burst = proc[i].burst_time;
                    index = i;
                }
                // Tie breaker: Arrival time
                else if (proc[i].burst_time == min_burst) {
                    if (proc[i].arrival_time < proc[index].arrival_time) {
                        index = i;
                    }
                }
            }
        }
        
        if (index != -1) {
            proc[index].completion_time = current_time + proc[index].burst_time;
            proc[index].turnaround_time = proc[index].completion_time - proc[index].arrival_time;
            proc[index].waiting_time = proc[index].turnaround_time - proc[index].burst_time;
            proc[index].completed = true;
            
            total_wt += proc[index].waiting_time;
            total_tat += proc[index].turnaround_time;
            
            current_time = proc[index].completion_time;
            completed++;
        } else {
            // CPU is idle
            current_time++;
        }
    }
    
    printf("\\nPID\\tArrival\\tBurst\\tComplete\\tTurnaround\\tWaiting\\n");
    for (int i = 0; i < n; i++) {
        printf("P%d\\t%d\\t%d\\t%d\\t\\t%d\\t\\t%d\\n", 
               proc[i].id, proc[i].arrival_time, proc[i].burst_time,
               proc[i].completion_time, proc[i].turnaround_time, proc[i].waiting_time);
    }
    
    printf("\\nAverage Waiting Time: %.2f", total_wt / n);
    printf("\\nAverage Turnaround Time: %.2f\\n", total_tat / n);
    
    return 0;
}`
  },
  {
    id: "srtf-c",
    title: "SRTF (Shortest Remaining Time First - Preemptive SJF)",
    algorithmName: "SRTF",
    code: `#include <stdio.h>
#include <stdbool.h>

struct Process {
    int id;
    int arrival_time;
    int burst_time;
    int remaining_time;
    int completion_time;
    int turnaround_time;
    int waiting_time;
};

int main() {
    int n, completed = 0, current_time = 0;
    float total_wt = 0, total_tat = 0;
    
    printf("OS Scheduler Lab - SRTF Preemptive C Program\\n");
    printf("Enter number of processes: ");
    scanf("%d", &n);
    
    struct Process proc[10];
    for (int i = 0; i < n; i++) {
        proc[i].id = i + 1;
        printf("Enter Arrival Time and Burst Time for P%d: ", i + 1);
        scanf("%d %d", &proc[i].arrival_time, &proc[i].burst_time);
        proc[i].remaining_time = proc[i].burst_time;
    }
    
    int prev_p = -1;
    while (completed < n) {
        int index = -1;
        int min_remaining = 1e9;
        
        // Choose ready process with minimum remaining burst time
        for (int i = 0; i < n; i++) {
            if (proc[i].arrival_time <= current_time && proc[i].remaining_time > 0) {
                if (proc[i].remaining_time < min_remaining) {
                    min_remaining = proc[i].remaining_time;
                    index = i;
                }
                // Tie breaker: Arrival time
                else if (proc[i].remaining_time == min_remaining) {
                    if (proc[i].arrival_time < proc[index].arrival_time) {
                        index = i;
                    }
                }
            }
        }
        
        if (index != -1) {
            // Print Gantt changes in terminal console
            if (prev_p != proc[index].id) {
                printf("| t=%d -> P%d ", current_time, proc[index].id);
                prev_p = proc[index].id;
            }
            
            proc[index].remaining_time--;
            current_time++;
            
            if (proc[index].remaining_time == 0) {
                proc[index].completion_time = current_time;
                proc[index].turnaround_time = proc[index].completion_time - proc[index].arrival_time;
                proc[index].waiting_time = proc[index].turnaround_time - proc[index].burst_time;
                
                total_wt += proc[index].waiting_time;
                total_tat += proc[index].turnaround_time;
                completed++;
            }
        } else {
            current_time++;
        }
    }
    printf("| t=%d |\\n", current_time);
    
    printf("\\nPID\\tArrival\\tBurst\\tComplete\\tTurnaround\\tWaiting\\n");
    for (int i = 0; i < n; i++) {
        printf("P%d\\t%d\\t%d\\t%d\\t\\t%d\\t\\t%d\\n", 
               proc[i].id, proc[i].arrival_time, proc[i].burst_time,
               proc[i].completion_time, proc[i].turnaround_time, proc[i].waiting_time);
    }
    
    printf("\\nAverage Waiting Time: %.2f", total_wt / n);
    printf("\\nAverage Turnaround Time: %.2f\\n", total_tat / n);
    
    return 0;
}`
  },
  {
    id: "priority-c",
    title: "Priority Scheduling (Non-Preemptive)",
    algorithmName: "Priority Scheduling",
    code: `#include <stdio.h>
#include <stdbool.h>

struct Process {
    int id;
    int arrival_time;
    int burst_time;
    int priority; // Lower values = Higher priority
    int completion_time;
    int turnaround_time;
    int waiting_time;
    bool completed;
};

int main() {
    int n, completed = 0, current_time = 0;
    float total_wt = 0, total_tat = 0;
    
    printf("OS Scheduler Lab - Priority Non-Preemptive C Program\\n");
    printf("Note: Lower priority number represents higher urgency\\n");
    printf("Enter number of processes: ");
    scanf("%d", &n);
    
    struct Process proc[10];
    for (int i = 0; i < n; i++) {
        proc[i].id = i + 1;
        proc[i].completed = false;
        printf("Enter Arrival Time, Burst Time, and Priority for P%d: ", i + 1);
        scanf("%d %d %d", &proc[i].arrival_time, &proc[i].burst_time, &proc[i].priority);
    }
    
    while (completed < n) {
        int index = -1;
        int highest_priority = 1e9; // standard representation
        
        for (int i = 0; i < n; i++) {
            if (proc[i].arrival_time <= current_time && !proc[i].completed) {
                if (proc[i].priority < highest_priority) {
                    highest_priority = proc[i].priority;
                    index = i;
                }
                // Tie breaker: Arrival time
                else if (proc[i].priority == highest_priority) {
                    if (proc[i].arrival_time < proc[index].arrival_time) {
                        index = i;
                    }
                }
            }
        }
        
        if (index != -1) {
            proc[index].completion_time = current_time + proc[index].burst_time;
            proc[index].turnaround_time = proc[index].completion_time - proc[index].arrival_time;
            proc[index].waiting_time = proc[index].turnaround_time - proc[index].burst_time;
            proc[index].completed = true;
            
            total_wt += proc[index].waiting_time;
            total_tat += proc[index].turnaround_time;
            
            current_time = proc[index].completion_time;
            completed++;
        } else {
            current_time++;
        }
    }
    
    printf("\\nPID\\tArrival\\tBurst\\tPriority\\tComplete\\tTurnaround\\tWaiting\\n");
    for (int i = 0; i < n; i++) {
        printf("P%d\\t%d\\t%d\\t%d\\t\\t%d\\t\\t%d\\t\\t%d\\n", 
               proc[i].id, proc[i].arrival_time, proc[i].burst_time, proc[i].priority,
               proc[i].completion_time, proc[i].turnaround_time, proc[i].waiting_time);
    }
    
    printf("\\nAverage Waiting Time: %.2f", total_wt / n);
    printf("\\nAverage Turnaround Time: %.2f\\n", total_tat / n);
    
    return 0;
}`
  },
  {
    id: "roundrobin-c",
    title: "Round Robin Scheduling",
    algorithmName: "Round Robin",
    code: `#include <stdio.h>
#include <stdbool.h>

struct Process {
    int id;
    int arrival_time;
    int burst_time;
    int remaining_time;
    int completion_time;
    int turnaround_time;
    int waiting_time;
};

int main() {
    int n, quantum, completed = 0, current_time = 0;
    float total_wt = 0, total_tat = 0;
    
    printf("OS Scheduler Lab - Round Robin C Program\\n");
    printf("Enter number of processes: ");
    scanf("%d", &n);
    printf("Enter Time Quantum: ");
    scanf("%d", &quantum);
    
    struct Process proc[10];
    int queue[50]; // simple queue array
    int front = 0, rear = 0;
    bool in_queue[10] = {false};
    
    for (int i = 0; i < n; i++) {
        proc[i].id = i + 1;
        printf("Enter Arrival Time and Burst Time for P%d: ", i + 1);
        scanf("%d %d", &proc[i].arrival_time, &proc[i].burst_time);
        proc[i].remaining_time = proc[i].burst_time;
    }
    
    // Sort processes initially by arrival time using a simple bubble sort
    struct Process temp;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (proc[j].arrival_time > proc[j+1].arrival_time) {
                temp = proc[j];
                proc[j] = proc[j+1];
                proc[j+1] = temp;
            }
        }
    }
    
    // Enqueue first process(es) arriving at time 0
    for (int i = 0; i < n; i++) {
        if (proc[i].arrival_time <= current_time) {
            queue[rear++] = i;
            in_queue[proc[i].id - 1] = true;
        }
    }
    
    printf("\\nGantt Trace: ");
    while (completed < n) {
        if (front == rear) { // Queue is empty, wait for next arrival
            current_time++;
            for (int i = 0; i < n; i++) {
                if (proc[i].arrival_time <= current_time && proc[i].remaining_time > 0 && !in_queue[proc[i].id - 1]) {
                    queue[rear++] = i;
                    in_queue[proc[i].id - 1] = true;
                }
            }
            continue;
        }
        
        int p_idx = queue[front++];
        int run_time = (proc[p_idx].remaining_time < quantum) ? proc[p_idx].remaining_time : quantum;
        
        printf("| P%d ", proc[p_idx].id);
        
        proc[p_idx].remaining_time -= run_time;
        current_time += run_time;
        
        // Add processes arriving during execution time slice
        for (int i = 0; i < n; i++) {
            if (proc[i].arrival_time <= current_time && proc[i].remaining_time > 0 && i != p_idx && !in_queue[proc[i].id - 1]) {
                queue[rear++] = i;
                in_queue[proc[i].id - 1] = true;
            }
        }
        
        if (proc[p_idx].remaining_time > 0) {
            queue[rear++] = p_idx; // place back in queue
        } else {
            proc[p_idx].completion_time = current_time;
            proc[p_idx].turnaround_time = proc[p_idx].completion_time - proc[p_idx].arrival_time;
            proc[p_idx].waiting_time = proc[p_idx].turnaround_time - proc[p_idx].burst_time;
            
            total_wt += proc[p_idx].waiting_time;
            total_tat += proc[p_idx].turnaround_time;
            completed++;
        }
    }
    printf("|\\n");
    
    printf("\\nPID\\tArrival\\tBurst\\tComplete\\tTurnaround\\tWaiting\\n");
    for (int i = 0; i < n; i++) {
        printf("P%d\\t%d\\t%d\\t%d\\t\\t%d\\t\\t%d\\n", 
               proc[i].id, proc[i].arrival_time, proc[i].burst_time,
               proc[i].completion_time, proc[i].turnaround_time, proc[i].waiting_time);
    }
    
    printf("\\nAverage Waiting Time: %.2f", total_wt / n);
    printf("\\nAverage Turnaround Time: %.2f\\n", total_tat / n);
    
    return 0;
}`
  }
];
