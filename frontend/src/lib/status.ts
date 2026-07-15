import type { Reading } from "./types";

// CPCB-style bathing water thresholds (simplified).
export function readingIssues(reading: Reading): string[] {
  const issues: string[] = [];
  if (reading.ph !== null && (reading.ph < 6.5 || reading.ph > 8.5)) {
    issues.push("pH out of range");
  }
  if (reading.dissolved_oxygen_mg_l !== null && reading.dissolved_oxygen_mg_l < 4) {
    issues.push("Low dissolved oxygen");
  }
  if (reading.bod_mg_l !== null && reading.bod_mg_l > 3) {
    issues.push("High BOD");
  }
  if (reading.turbidity_ntu !== null && reading.turbidity_ntu > 10) {
    issues.push("High turbidity");
  }
  return issues;
}

export function statusColor(issueCount: number): string {
  if (issueCount === 0) return "#22c55e"; // green
  if (issueCount <= 1) return "#eab308"; // amber
  return "#ef4444"; // red
}
