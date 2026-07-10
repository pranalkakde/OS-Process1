/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Process, ScheduledProcess, GanttChartStep, SimulationResult, AlgorithmType } from '../types';

export function solveScheduling(
  processes: Process[],
  algorithm: AlgorithmType,
  timeQuantum: number = 2,
  priorityOrder: 'low-is-high' | 'high-is-low' = 'low-is-high'
): SimulationResult {
  if (processes.length === 0) {
    return {
      scheduledProcesses: [],
      ganttChart: [],
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
      cpuUtilization: 0,
      throughput: 0,
    };
  }

  // Deep copy to prevent mutation
  const list = processes.map((p) => ({ ...p }));

  let scheduledProcesses: ScheduledProcess[] = [];
  let rawGantt: GanttChartStep[] = [];

  switch (algorithm) {
    case 'FCFS':
      rawGantt = solveFCFS(list, scheduledProcesses);
      break;
    case 'SJF':
      rawGantt = solveSJF(list, scheduledProcesses);
      break;
    case 'SRTF':
      rawGantt = solveSRTF(list, scheduledProcesses);
      break;
    case 'PRIORITY_NP':
      rawGantt = solvePriorityNonPreemptive(list, scheduledProcesses, priorityOrder);
      break;
    case 'PRIORITY_P':
      rawGantt = solvePriorityPreemptive(list, scheduledProcesses, priorityOrder);
      break;
    case 'RR':
      rawGantt = solveRoundRobin(list, scheduledProcesses, timeQuantum);
      break;
  }

  // Merge adjacent Gantt chart segments of the same process
  const ganttChart: GanttChartStep[] = [];
  for (const step of rawGantt) {
    if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === step.processId) {
      ganttChart[ganttChart.length - 1].endTime = step.endTime;
    } else {
      ganttChart.push({ ...step });
    }
  }

  // Calculate averages & performance metrics
  const totalProcesses = scheduledProcesses.length;
  const totalWaitingTime = scheduledProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTurnaroundTime = scheduledProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0);

  const averageWaitingTime = totalProcesses > 0 ? Number((totalWaitingTime / totalProcesses).toFixed(2)) : 0;
  const averageTurnaroundTime = totalProcesses > 0 ? Number((totalTurnaroundTime / totalProcesses).toFixed(2)) : 0;

  // CPU Utilization
  let totalDuration = 0;
  if (ganttChart.length > 0) {
    totalDuration = ganttChart[ganttChart.length - 1].endTime;
  }
  const idleDuration = ganttChart
    .filter((step) => step.processId === 'IDLE')
    .reduce((sum, step) => sum + (step.endTime - step.startTime), 0);

  const activeDuration = totalDuration - idleDuration;
  const cpuUtilization = totalDuration > 0 ? Number(((activeDuration / totalDuration) * 100).toFixed(2)) : 0;
  const throughput = totalDuration > 0 ? Number((totalProcesses / totalDuration).toFixed(4)) : 0;

  return {
    scheduledProcesses,
    ganttChart,
    averageWaitingTime,
    averageTurnaroundTime,
    cpuUtilization,
    throughput,
  };
}

function solveFCFS(processes: Process[], results: ScheduledProcess[]): GanttChartStep[] {
  const gantt: GanttChartStep[] = [];
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;

  for (const p of sorted) {
    if (currentTime < p.arrivalTime) {
      gantt.push({
        processId: 'IDLE',
        startTime: currentTime,
        endTime: p.arrivalTime,
      });
      currentTime = p.arrivalTime;
    }

    const startTime = currentTime;
    const endTime = currentTime + p.burstTime;
    gantt.push({
      processId: p.id,
      startTime,
      endTime,
    });

    const waitingTime = startTime - p.arrivalTime;
    const turnaroundTime = endTime - p.arrivalTime;
    const responseTime = startTime - p.arrivalTime;

    results.push({
      ...p,
      completionTime: endTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });

    currentTime = endTime;
  }

  return gantt;
}

function solveSJF(processes: Process[], results: ScheduledProcess[]): GanttChartStep[] {
  const gantt: GanttChartStep[] = [];
  const uncompleted = [...processes];
  let currentTime = 0;

  while (uncompleted.length > 0) {
    const ready = uncompleted.filter((p) => p.arrivalTime <= currentTime);

    if (ready.length === 0) {
      // Find the next arriving process
      const nextArrival = Math.min(...uncompleted.map((p) => p.arrivalTime));
      gantt.push({
        processId: 'IDLE',
        startTime: currentTime,
        endTime: nextArrival,
      });
      currentTime = nextArrival;
      continue;
    }

    // Sort by burst time, tie break by arrival time, then ID
    ready.sort((a, b) => {
      if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id.localeCompare(b.id);
    });

    const nextProcess = ready[0];
    const startTime = currentTime;
    const endTime = currentTime + nextProcess.burstTime;

    gantt.push({
      processId: nextProcess.id,
      startTime,
      endTime,
    });

    const waitingTime = startTime - nextProcess.arrivalTime;
    const turnaroundTime = endTime - nextProcess.arrivalTime;
    const responseTime = startTime - nextProcess.arrivalTime;

    results.push({
      ...nextProcess,
      completionTime: endTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });

    // Remove from uncompleted list
    const index = uncompleted.findIndex((p) => p.id === nextProcess.id);
    uncompleted.splice(index, 1);

    currentTime = endTime;
  }

  return gantt;
}

function solveSRTF(processes: Process[], results: ScheduledProcess[]): GanttChartStep[] {
  const gantt: GanttChartStep[] = [];
  const remainingTimes: { [id: string]: number } = {};
  const responseTimes: { [id: string]: number } = {};
  const firstRun: { [id: string]: boolean } = {};

  for (const p of processes) {
    remainingTimes[p.id] = p.burstTime;
    firstRun[p.id] = true;
  }

  let currentTime = 0;
  let completed = 0;
  const n = processes.length;

  while (completed < n) {
    const ready = processes.filter(
      (p) => p.arrivalTime <= currentTime && remainingTimes[p.id] > 0
    );

    if (ready.length === 0) {
      const nextArrivals = processes
        .filter((p) => p.arrivalTime > currentTime && remainingTimes[p.id] > 0)
        .map((p) => p.arrivalTime);

      if (nextArrivals.length > 0) {
        const nextArrival = Math.min(...nextArrivals);
        gantt.push({
          processId: 'IDLE',
          startTime: currentTime,
          endTime: nextArrival,
        });
        currentTime = nextArrival;
      } else {
        break; // No processes left
      }
      continue;
    }

    // Find process with shortest remaining time
    ready.sort((a, b) => {
      const rA = remainingTimes[a.id];
      const rB = remainingTimes[b.id];
      if (rA !== rB) return rA - rB;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id.localeCompare(b.id);
    });

    const currentProcess = ready[0];

    if (firstRun[currentProcess.id]) {
      responseTimes[currentProcess.id] = currentTime - currentProcess.arrivalTime;
      firstRun[currentProcess.id] = false;
    }

    // Run for 1 unit of time
    const nextTime = currentTime + 1;
    gantt.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: nextTime,
    });

    remainingTimes[currentProcess.id] -= 1;

    if (remainingTimes[currentProcess.id] === 0) {
      completed++;
      const compTime = nextTime;
      const turnTime = compTime - currentProcess.arrivalTime;
      const waitTime = turnTime - currentProcess.burstTime;

      results.push({
        ...currentProcess,
        completionTime: compTime,
        turnaroundTime: turnTime,
        waitingTime: waitTime,
        responseTime: responseTimes[currentProcess.id],
      });
    }

    currentTime = nextTime;
  }

  return gantt;
}

function solvePriorityNonPreemptive(
  processes: Process[],
  results: ScheduledProcess[],
  priorityOrder: 'low-is-high' | 'high-is-low'
): GanttChartStep[] {
  const gantt: GanttChartStep[] = [];
  const uncompleted = [...processes];
  let currentTime = 0;

  const comparePriority = (a: number, b: number) => {
    if (priorityOrder === 'low-is-high') {
      return a - b; // 1 has higher priority than 5
    } else {
      return b - a; // 5 has higher priority than 1
    }
  };

  while (uncompleted.length > 0) {
    const ready = uncompleted.filter((p) => p.arrivalTime <= currentTime);

    if (ready.length === 0) {
      const nextArrival = Math.min(...uncompleted.map((p) => p.arrivalTime));
      gantt.push({
        processId: 'IDLE',
        startTime: currentTime,
        endTime: nextArrival,
      });
      currentTime = nextArrival;
      continue;
    }

    // Sort by priority, tie break by arrival time, then ID
    ready.sort((a, b) => {
      const pDiff = comparePriority(a.priority, b.priority);
      if (pDiff !== 0) return pDiff;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id.localeCompare(b.id);
    });

    const nextProcess = ready[0];
    const startTime = currentTime;
    const endTime = currentTime + nextProcess.burstTime;

    gantt.push({
      processId: nextProcess.id,
      startTime,
      endTime,
    });

    const waitingTime = startTime - nextProcess.arrivalTime;
    const turnaroundTime = endTime - nextProcess.arrivalTime;
    const responseTime = startTime - nextProcess.arrivalTime;

    results.push({
      ...nextProcess,
      completionTime: endTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    });

    const index = uncompleted.findIndex((p) => p.id === nextProcess.id);
    uncompleted.splice(index, 1);

    currentTime = endTime;
  }

  return gantt;
}

function solvePriorityPreemptive(
  processes: Process[],
  results: ScheduledProcess[],
  priorityOrder: 'low-is-high' | 'high-is-low'
): GanttChartStep[] {
  const gantt: GanttChartStep[] = [];
  const remainingTimes: { [id: string]: number } = {};
  const responseTimes: { [id: string]: number } = {};
  const firstRun: { [id: string]: boolean } = {};

  for (const p of processes) {
    remainingTimes[p.id] = p.burstTime;
    firstRun[p.id] = true;
  }

  let currentTime = 0;
  let completed = 0;
  const n = processes.length;

  const comparePriority = (a: number, b: number) => {
    if (priorityOrder === 'low-is-high') {
      return a - b;
    } else {
      return b - a;
    }
  };

  while (completed < n) {
    const ready = processes.filter(
      (p) => p.arrivalTime <= currentTime && remainingTimes[p.id] > 0
    );

    if (ready.length === 0) {
      const nextArrivals = processes
        .filter((p) => p.arrivalTime > currentTime && remainingTimes[p.id] > 0)
        .map((p) => p.arrivalTime);

      if (nextArrivals.length > 0) {
        const nextArrival = Math.min(...nextArrivals);
        gantt.push({
          processId: 'IDLE',
          startTime: currentTime,
          endTime: nextArrival,
        });
        currentTime = nextArrival;
      } else {
        break;
      }
      continue;
    }

    // Sort by priority, tie break by remaining time, then arrival time, then ID
    ready.sort((a, b) => {
      const pDiff = comparePriority(a.priority, b.priority);
      if (pDiff !== 0) return pDiff;
      const rA = remainingTimes[a.id];
      const rB = remainingTimes[b.id];
      if (rA !== rB) return rA - rB;
      if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
      return a.id.localeCompare(b.id);
    });

    const currentProcess = ready[0];

    if (firstRun[currentProcess.id]) {
      responseTimes[currentProcess.id] = currentTime - currentProcess.arrivalTime;
      firstRun[currentProcess.id] = false;
    }

    const nextTime = currentTime + 1;
    gantt.push({
      processId: currentProcess.id,
      startTime: currentTime,
      endTime: nextTime,
    });

    remainingTimes[currentProcess.id] -= 1;

    if (remainingTimes[currentProcess.id] === 0) {
      completed++;
      const compTime = nextTime;
      const turnTime = compTime - currentProcess.arrivalTime;
      const waitTime = turnTime - currentProcess.burstTime;

      results.push({
        ...currentProcess,
        completionTime: compTime,
        turnaroundTime: turnTime,
        waitingTime: waitTime,
        responseTime: responseTimes[currentProcess.id],
      });
    }

    currentTime = nextTime;
  }

  return gantt;
}

function solveRoundRobin(
  processes: Process[],
  results: ScheduledProcess[],
  timeQuantum: number
): GanttChartStep[] {
  const gantt: GanttChartStep[] = [];
  const remainingTimes: { [id: string]: number } = {};
  const responseTimes: { [id: string]: number } = {};
  const firstRun: { [id: string]: boolean } = {};

  const sortedList = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  for (const p of processes) {
    remainingTimes[p.id] = p.burstTime;
    firstRun[p.id] = true;
  }

  let currentTime = 0;
  const queue: Process[] = [];
  let index = 0; // index in sortedList to track arrivals

  // Push all processes arriving at time 0
  while (index < sortedList.length && sortedList[index].arrivalTime <= currentTime) {
    queue.push(sortedList[index]);
    index++;
  }

  while (queue.length > 0 || index < sortedList.length) {
    if (queue.length === 0) {
      // CPU is idle until next process arrives
      const nextArrival = sortedList[index].arrivalTime;
      gantt.push({
        processId: 'IDLE',
        startTime: currentTime,
        endTime: nextArrival,
      });
      currentTime = nextArrival;

      while (index < sortedList.length && sortedList[index].arrivalTime <= currentTime) {
        queue.push(sortedList[index]);
        index++;
      }
      continue;
    }

    const currentProcess = queue.shift()!;
    const runTime = Math.min(remainingTimes[currentProcess.id], timeQuantum);

    if (firstRun[currentProcess.id]) {
      responseTimes[currentProcess.id] = currentTime - currentProcess.arrivalTime;
      firstRun[currentProcess.id] = false;
    }

    const startTime = currentTime;
    const endTime = currentTime + runTime;

    gantt.push({
      processId: currentProcess.id,
      startTime,
      endTime,
    });

    currentTime = endTime;
    remainingTimes[currentProcess.id] -= runTime;

    // First check for newly arrived processes during execution and queue them
    while (index < sortedList.length && sortedList[index].arrivalTime <= currentTime) {
      queue.push(sortedList[index]);
      index++;
    }

    // If current process has remaining burst time, put it back in the queue
    if (remainingTimes[currentProcess.id] > 0) {
      queue.push(currentProcess);
    } else {
      // Process has completed
      const compTime = currentTime;
      const turnTime = compTime - currentProcess.arrivalTime;
      const waitTime = turnTime - currentProcess.burstTime;

      results.push({
        ...currentProcess,
        completionTime: compTime,
        turnaroundTime: turnTime,
        waitingTime: waitTime,
        responseTime: responseTimes[currentProcess.id],
      });
    }
  }

  return gantt;
}
