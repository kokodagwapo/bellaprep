import type { FormData } from '../types';
import { calculateProgress } from './progressCalculator';

export interface TimeEstimate {
  minutesRemaining: number;
  percentageComplete: number;
  estimatedTotalMinutes: number;
}

// Average time per section in minutes (based on typical completion times)
const AVERAGE_TIME_PER_SECTION = 0.5; // 30 seconds per section
const TOTAL_SECTIONS = 18; // Total number of sections in Prep4Loan

// Historical completion speed tracking (for dynamic calculation)
let completionHistory: number[] = []; // Array of seconds per section

/**
 * Calculate dynamic time estimate based on completion progress and speed
 */
export const calculateTimeEstimate = (
  formData: FormData,
  elapsedSeconds: number = 0
): TimeEstimate => {
  const percentageComplete = calculateProgress(formData);
  const completedSections = Math.round((percentageComplete / 100) * TOTAL_SECTIONS);
  const remainingSections = TOTAL_SECTIONS - completedSections;

  // If we have completion history, use dynamic calculation
  let averageTimePerSection = AVERAGE_TIME_PER_SECTION;
  
  if (completionHistory.length > 0 && elapsedSeconds > 0 && completedSections > 0) {
    const averageSecondsPerSection = completionHistory.reduce((a, b) => a + b, 0) / completionHistory.length;
    averageTimePerSection = averageSecondsPerSection / 60; // Convert to minutes
  }

  // Calculate remaining time
  const minutesRemaining = Math.max(0, remainingSections * averageTimePerSection);
  
  // Estimate total time based on current progress
  const estimatedTotalMinutes = completedSections > 0 
    ? (elapsedSeconds / 60) + minutesRemaining
    : TOTAL_SECTIONS * AVERAGE_TIME_PER_SECTION;

  return {
    minutesRemaining: Math.round(minutesRemaining * 10) / 10, // Round to 1 decimal
    percentageComplete,
    estimatedTotalMinutes: Math.round(estimatedTotalMinutes * 10) / 10
  };
};

/**
 * Track section completion time for dynamic estimation
 */
export const trackSectionCompletion = (secondsElapsed: number, sectionsCompleted: number) => {
  if (sectionsCompleted > 0) {
    const secondsPerSection = secondsElapsed / sectionsCompleted;
    completionHistory.push(secondsPerSection);
    
    // Keep only last 10 completions for rolling average
    if (completionHistory.length > 10) {
      completionHistory = completionHistory.slice(-10);
    }
  }
};

/**
 * Reset completion history
 */
export const resetTimeTracking = () => {
  completionHistory = [];
};

/**
 * Format time estimate as human-readable string
 */
export const formatTimeEstimate = (estimate: TimeEstimate): string => {
  if (estimate.minutesRemaining < 1) {
    return "Less than 1 minute remaining";
  } else if (estimate.minutesRemaining < 2) {
    return "~1 minute remaining";
  } else {
    return `~${Math.round(estimate.minutesRemaining)} minutes remaining`;
  }
};

/**
 * Format completion summary
 */
export const formatCompletionSummary = (estimate: TimeEstimate, totalSeconds: number): string => {
  const totalMinutes = Math.round(totalSeconds / 60);
  return `Application complete in ${totalMinutes} minutes`;
};

