export type RoutineType = 'sandbag' | 'bodyweight';

export interface WaveTarget {
  setNumber: number; // 1 to 5
  type: 'high' | 'low' | 'mid' | 'peak';
  label: string;
  repRange: string;
  minReps: number;
  maxReps: number;
  isAmrap?: boolean;
  focus: string;
  rirGuidance: string;
}

export interface Movement {
  id: string;
  name: string;
  order: number;
  pattern: string; // e.g., 'Hinge / Deadlift', 'Vertical/Horizontal Press', etc.
  replacesMovement?: string; // For bodyweight equivalent
  cues: string;
  equipment: string;
  notes?: string;
  isTimedHold?: boolean; // For plank if user chooses seconds, but wave applies reps/seconds
}

export interface Routine {
  id: RoutineType;
  title: string;
  subtitle: string;
  description: string;
  movements: Movement[];
}

export interface LoggedSet {
  id: string;
  routineId: RoutineType;
  movementId: string;
  movementName: string;
  setNumber: number;
  targetRepRange: string;
  repsCompleted: number;
  weightUsed?: string; // e.g., "50 lbs" or "Bodyweight"
  rpe: number; // 6 to 10
  restSecondsTarget: number; // 60, 75, 90, etc.
  restSecondsActual: number;
  timestamp: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  routineId: RoutineType;
  startTime: number;
  endTime?: number;
  sandbagWeight: number; // in lbs or kg
  weightUnit: 'lbs' | 'kg';
  loggedSets: LoggedSet[];
  defaultRestSeconds: number; // default 60 - 90 seconds (75s default)
}
