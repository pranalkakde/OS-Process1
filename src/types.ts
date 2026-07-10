/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AlgorithmType = 'FCFS' | 'SJF' | 'SRTF' | 'PRIORITY_NP' | 'PRIORITY_P' | 'RR';

export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export interface ScheduledProcess extends Process {
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
}

export interface GanttChartStep {
  processId: string; // "IDLE" if CPU is idle
  startTime: number;
  endTime: number;
}

export interface SimulationResult {
  scheduledProcesses: ScheduledProcess[];
  ganttChart: GanttChartStep[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  cpuUtilization: number;
  throughput: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface VivaQuestion {
  id: number;
  question: string;
  answer: string;
}

export interface ProgramCode {
  id: string;
  title: string;
  algorithmName: string;
  code: string;
}
