import { Routine, WaveTarget } from '../types';

export const SOVIET_W_WAVE: WaveTarget[] = [
  {
    setNumber: 1,
    type: 'high',
    label: 'High Reps',
    repRange: '12 – 15 reps',
    minReps: 12,
    maxReps: 15,
    focus: 'Build volume; leave 2–3 reps in reserve.',
    rirGuidance: 'RPE 7 – 8 (~2-3 RIR)'
  },
  {
    setNumber: 2,
    type: 'low',
    label: 'Low Reps',
    repRange: '5 – 7 reps',
    minReps: 5,
    maxReps: 7,
    focus: 'Neural reset; focus on explosive concentric speed.',
    rirGuidance: 'RPE 7 (~3-4 RIR) - Max Velocity'
  },
  {
    setNumber: 3,
    type: 'mid',
    label: 'Mid Reps',
    repRange: '8 – 10 reps',
    minReps: 8,
    maxReps: 10,
    focus: 'Work capacity under moderate metabolic fatigue.',
    rirGuidance: 'RPE 8 (~2 RIR)'
  },
  {
    setNumber: 4,
    type: 'low',
    label: 'Low Reps',
    repRange: '4 – 6 reps',
    minReps: 4,
    maxReps: 6,
    focus: 'Recovery wave; restore velocity and clean form.',
    rirGuidance: 'RPE 7 – 7.5 (~2-3 RIR) - Crisp Form'
  },
  {
    setNumber: 5,
    type: 'peak',
    label: 'Peak Reps (AMRAP)',
    repRange: 'AMRAP / 12+ reps',
    minReps: 12,
    maxReps: 25,
    isAmrap: true,
    focus: 'Max capacity drive; pull clean reps to near-failure.',
    rirGuidance: 'RPE 9 – 10 (~0-1 RIR) - Near Failure'
  }
];

export const ROUTINES: Record<'sandbag' | 'bodyweight', Routine> = {
  sandbag: {
    id: 'sandbag',
    title: 'Set 1: Sandbag Routine',
    subtitle: 'Fixed-Weight Sandbag Conditioning',
    description: 'Each exercise is performed for 5 sets following the Soviet "W" wave structure to drive maximum repetition volume without early central fatigue.',
    movements: [
      {
        id: 'sb_deadlift',
        name: 'Sandbag Conventional Deadlift',
        order: 1,
        pattern: 'Posterior Chain / Hip Hinge',
        cues: 'Hip-width stance, hinge deep, pull tight to shins, and extend hips to lockout.',
        equipment: 'Fixed-weight Sandbag'
      },
      {
        id: 'sb_floor_press',
        name: 'Sandbag Floor Press',
        order: 2,
        pattern: 'Horizontal Upper Body Press',
        cues: 'Lying flat on your back, press the bag vertically from your chest to full arm lockout.',
        equipment: 'Fixed-weight Sandbag'
      },
      {
        id: 'sb_reverse_lunge',
        name: 'Sandbag Bear-Hug Reverse Lunge',
        order: 3,
        pattern: 'Unilateral Knee Flexion / Core Brace',
        cues: 'Hug the bag tightly against your chest while stepping back into alternating lunges.',
        equipment: 'Fixed-weight Sandbag'
      },
      {
        id: 'sb_swing',
        name: 'Sandbag Swing',
        order: 4,
        pattern: 'Explosive Hip Extension',
        cues: 'Hinge at the hips, let the bag swing between your legs, and snap your hips forcefully to swing it to chest height.',
        equipment: 'Fixed-weight Sandbag'
      },
      {
        id: 'sb_burpee_clean',
        name: 'Sandbag Burpee to Clean',
        order: 5,
        pattern: 'Full-Body Power & Conditioning',
        cues: 'Drop into a burpee, stand up into a hip hinge, and clean the bag to chest level.',
        equipment: 'Fixed-weight Sandbag'
      },
      {
        id: 'sb_bent_row',
        name: 'Sandbag Bent-Over Row',
        order: 6,
        pattern: 'Horizontal Upper Body Pull',
        cues: 'Hinge at 45 degrees with a flat back; pull the bag into your upper abdomen, squeezing the scaps.',
        equipment: 'Fixed-weight Sandbag'
      },
      {
        id: 'sb_plank_pull',
        name: 'Sandbag Plank Pull-Through',
        order: 7,
        pattern: 'Anti-Rotation Core Stability',
        cues: 'In a high plank over the bag, reach across with the opposite hand and drag the bag under your chest.',
        equipment: 'Fixed-weight Sandbag'
      }
    ]
  },
  bodyweight: {
    id: 'bodyweight',
    title: 'Set 2: Bodyweight Routine',
    subtitle: 'No Sandbag (Household Leverage)',
    description: 'Matches the exact movement patterns of Set 1 using bodyweight mechanics and minimal household leverage (such as a chair or door frame). Uses the same Soviet "W" wave structure.',
    movements: [
      {
        id: 'bw_hamstring_curls',
        name: 'Sliding Hamstring Curls',
        order: 1,
        pattern: 'Posterior Chain / Hamstring Flexion',
        replacesMovement: 'Sandbag Conventional Deadlift',
        cues: 'Lie on your back, lift your hips into a bridge with feet on slick towels or socks, slide heels out, and drag them back in.',
        equipment: 'Floor + Slick Towels / Socks'
      },
      {
        id: 'bw_blast_off_pushup',
        name: 'Blast-Off Push-Up',
        order: 2,
        pattern: 'Horizontal Upper Body Press',
        replacesMovement: 'Sandbag Floor Press',
        cues: 'From a high plank, sit your hips back toward your heels with bent knees, then explode forward into a standard push-up.',
        equipment: 'Bodyweight (Floor)'
      },
      {
        id: 'bw_bulgarian_split_squat',
        name: 'Bulgarian Split Squat',
        order: 3,
        pattern: 'Unilateral Knee Flexion / Quad & Glute',
        replacesMovement: 'Sandbag Bear-Hug Reverse Lunge',
        cues: 'Rear foot elevated on a chair or bench, lunge deep on the front leg to isolate quadriceps and glutes.',
        equipment: 'Chair or Bench'
      },
      {
        id: 'bw_glute_bridges',
        name: 'Explosive Glute Bridges',
        order: 4,
        pattern: 'Explosive Hip Extension',
        replacesMovement: 'Sandbag Swing',
        cues: 'Lie flat, knees bent at 90 degrees, and explode your hips up toward the ceiling as fast as possible, holding a hard lockout at the top.',
        equipment: 'Bodyweight (Floor)',
        notes: 'High endurance move: feel free to scale reps up while maintaining wave shape.'
      },
      {
        id: 'bw_burpee',
        name: 'Step-Back or Classic Burpee',
        order: 5,
        pattern: 'Full-Body Power & Conditioning',
        replacesMovement: 'Sandbag Burpee to Clean',
        cues: 'Drop hands to the floor or a chair edge, step or jump feet back to plank, return to standing, and extend hips.',
        equipment: 'Floor or Chair Edge'
      },
      {
        id: 'bw_doorway_row',
        name: 'Towel Doorway Row',
        order: 6,
        pattern: 'Horizontal Upper Body Pull',
        replacesMovement: 'Sandbag Bent-Over Row',
        cues: 'Loop a thick towel around a sturdy interior door handle, lean back at an angle, and pull your torso toward the door frame.',
        equipment: 'Door Handle + Thick Towel'
      },
      {
        id: 'bw_rkc_plank',
        name: 'RKC Plank',
        order: 7,
        pattern: 'Anti-Extension / Full-Body Tension',
        replacesMovement: 'Sandbag Plank Pull-Through',
        cues: 'Hold a forearm plank while actively flexing quads, squeezing glutes, and dragging elbows toward toes to generate full-body tension.',
        equipment: 'Bodyweight (Floor)',
        notes: 'Log reps or equivalent seconds of hard maximal tension.'
      }
    ]
  }
};

export const RPE_SCALE = [
  { value: 6.0, label: '6.0', rir: '4+ RIR', desc: 'Warmup or very light speed work, effortless' },
  { value: 6.5, label: '6.5', rir: '3-4 RIR', desc: 'Could do 3-4 more reps easily' },
  { value: 7.0, label: '7.0', rir: '3 RIR', desc: 'Speed was crisp, 3 reps in reserve' },
  { value: 7.5, label: '7.5', rir: '2-3 RIR', desc: 'Definite speed, 2 to 3 reps in reserve' },
  { value: 8.0, label: '8.0', rir: '2 RIR', desc: 'Moderate effort, 2 solid reps left in tank' },
  { value: 8.5, label: '8.5', rir: '1-2 RIR', desc: 'Challenging, definitely 1, maybe 2 reps left' },
  { value: 9.0, label: '9.0', rir: '1 RIR', desc: 'Heavy grinder, only 1 strict rep remaining' },
  { value: 9.5, label: '9.5', rir: '0-1 RIR', desc: 'Near limit, couldn’t do another full rep with form' },
  { value: 10.0, label: '10.0', rir: '0 RIR (Max)', desc: 'Absolute maximum effort, zero reps in reserve' }
];
