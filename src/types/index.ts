export type MachineStatus = 'Safe' | 'Warning' | 'Critical';

export type CorrosionType = 'Uniform' | 'Pitting' | 'Galvanic' | 'Crevice' | 'None';

export type SensorHealth = 'OK' | 'Drifting' | 'Failed';

export interface SensorReading {
  id: string;
  name: string;
  code: string; // e.g. PT100, SHT31, YF-S201, ER-01, UT-500
  type: 'temperature' | 'humidity' | 'wetness' | 'flow' | 'galvanic' | 'er_loss' | 'ut_thickness' | 'ph' | 'conductivity' | 'chloride';
  value: number;
  unit: string;
  health: SensorHealth;
  isFaulty: boolean;
  minNormal: number;
  maxNormal: number;
  sparkline: number[];
  description: string;
}

export interface ThicknessDataPoint {
  timestamp: string;
  timeLabel: string;
  erThickness: number; // mm
  utThickness: number; // mm
  corrosionRate: number; // mm/year
  rateMinUncertainty: number;
  rateMaxUncertainty: number;
}

export type VerifyStep = 'alert_open' | 'maintenance_done' | 'verifying' | 'resolved';

export interface VerifyLoopTracker {
  step: VerifyStep;
  openedAt: string;
  maintenanceDoneAt?: string;
  verifiedAt?: string;
  notes?: string;
  canReturnToNormal: boolean;
}

export interface Machine {
  id: string;
  name: string;
  location: string;
  tag: string;
  type: 'Boiler Pipe' | 'Storage Tank' | 'Cooling Line' | 'Marine Pump' | 'Pipeline' | 'Heat Exchanger';
  material: 'Carbon Steel AISI 1018' | 'Carbon Steel ASTM A106' | 'Carbon Steel A516-70';
  status: MachineStatus;
  statusReason: string;
  likelyCorrosionType: CorrosionType;
  corrosionRate: number; // mm/year
  currentThickness: number; // mm
  initialThickness: number; // mm
  minimumAllowedThickness: number; // mm (t_min)
  remainingLifeMonths: number;
  lastReadingTime: string;
  sensors: SensorReading[];
  history: ThicknessDataPoint[];
  verifyLoop: VerifyLoopTracker;
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  machineId: string;
  machineName: string;
  level: 'Warning' | 'Critical';
  corrosionType: CorrosionType;
  reason: string;
  recommendedAction: string;
  status: 'Open' | 'Verifying' | 'Closed';
  channels: ('Telegram' | 'SMS' | 'Email')[];
}

export type DemoScenario = 
  | 'Normal'
  | 'Developing Pitting'
  | 'Galvanic Problem'
  | 'Stagnant Crevice'
  | 'Sensor Failure';

export interface DemoScenarioState {
  active: boolean;
  scenario: DemoScenario;
  targetMachineId: string;
  stepProgress: number; // 0 to 100
  phase: 'Safe' | 'Warning' | 'Critical' | 'Fault';
  secondsRemaining: number;
}
