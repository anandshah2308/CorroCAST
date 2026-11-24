import {
  Machine,
  SensorReading,
  ThicknessDataPoint,
  AlertNotification,
  DemoScenario,
  DemoScenarioState,
  CorrosionType,
  MachineStatus,
  SensorHealth
} from '../types';

// ==========================================
// CorroCAST Unified Data Source & Simulation
// ==========================================
// This service encapsulates all industrial telemetry access.
// When transitioning to live hardware, replace the internal
// simulation generator with MQTT client, ThingSpeak API or InfluxDB client.

type Listener<T> = (data: T) => void;

class DataSourceService {
  private machines: Machine[] = [];
  private alerts: AlertNotification[] = [];
  private demoState: DemoScenarioState = {
    active: false,
    scenario: 'Normal',
    targetMachineId: 'm-1',
    stepProgress: 0,
    phase: 'Safe',
    secondsRemaining: 0,
  };

  private machineListeners: Set<Listener<Machine[]>> = new Set();
  private alertListeners: Set<Listener<AlertNotification[]>> = new Set();
  private demoListeners: Set<Listener<DemoScenarioState>> = new Set();

  private simulationInterval: number | null = null;
  private demoInterval: number | null = null;

  constructor() {
    this.initializeData();
    this.startSimulation();
  }

  // ------------------------------------------
  // Initial Mock Data Setup (6 Industrial Machines)
  // ------------------------------------------
  private initializeData() {
    const now = new Date();

    const generateHistory = (
      initialThickness: number,
      currentThickness: number,
      baseRate: number,
      noise: number = 0.005
    ): ThicknessDataPoint[] => {
      const history: ThicknessDataPoint[] = [];
      const totalPoints = 12;
      const thicknessDrop = initialThickness - currentThickness;
      
      for (let i = 0; i < totalPoints; i++) {
        const factor = i / (totalPoints - 1);
        const er = +(initialThickness - (thicknessDrop * factor) + (Math.sin(i) * noise)).toFixed(3);
        const ut = +(initialThickness - (thicknessDrop * factor) - (Math.cos(i) * noise * 0.8)).toFixed(3);
        const rate = +(baseRate * (0.8 + 0.4 * factor)).toFixed(3);
        
        const date = new Date(now.getTime() - (totalPoints - 1 - i) * 3600 * 1000 * 24 * 7); // weekly
        const timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        history.push({
          timestamp: date.toISOString(),
          timeLabel,
          erThickness: er,
          utThickness: ut,
          corrosionRate: rate,
          rateMinUncertainty: +(Math.max(0, rate - 0.02)).toFixed(3),
          rateMaxUncertainty: +(rate + 0.025).toFixed(3),
        });
      }
      return history;
    };

    this.machines = [
      {
        id: 'm-1',
        name: 'Boiler Pipe A',
        tag: 'BP-101A',
        type: 'Boiler Pipe',
        location: 'Steam Generation Plant #1, Bay 3',
        material: 'Carbon Steel ASTM A106',
        status: 'Safe',
        statusReason: 'Stable wall thickness with normal dissolved oxygen and passivated surface.',
        likelyCorrosionType: 'None',
        corrosionRate: 0.042,
        currentThickness: 9.62,
        initialThickness: 10.00,
        minimumAllowedThickness: 6.50,
        remainingLifeMonths: 89,
        lastReadingTime: 'Just now',
        verifyLoop: {
          step: 'resolved',
          openedAt: '2026-10-12T08:00:00Z',
          canReturnToNormal: true,
        },
        sensors: [
          {
            id: 's-m1-temp',
            name: 'Process Temperature',
            code: 'PT100-A',
            type: 'temperature',
            value: 68.4,
            unit: '°C',
            health: 'OK',
            isFaulty: false,
            minNormal: 50,
            maxNormal: 85,
            sparkline: [67.8, 68.0, 68.2, 68.5, 68.3, 68.4],
            description: 'Core pipe outer surface temperature (3-wire RTD)',
          },
          {
            id: 's-m1-hum',
            name: 'Insulation Ambient Humidity',
            code: 'SHT31-D',
            type: 'humidity',
            value: 48.2,
            unit: '% RH',
            health: 'OK',
            isFaulty: false,
            minNormal: 20,
            maxNormal: 65,
            sparkline: [47.5, 48.0, 48.1, 48.6, 48.0, 48.2],
            description: 'Annular space humidity under thermal cladding',
          },
          {
            id: 's-m1-tow',
            name: 'Time of Wetness (TOW)',
            code: 'TOW-RES-01',
            type: 'wetness',
            value: 12.0,
            unit: '%',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 35,
            sparkline: [10, 11, 14, 12, 11, 12],
            description: 'Surface condensation persistence percentage',
          },
          {
            id: 's-m1-flow',
            name: 'Feed Flow Rate',
            code: 'YF-S201',
            type: 'flow',
            value: 18.5,
            unit: 'L/min',
            health: 'OK',
            isFaulty: false,
            minNormal: 12,
            maxNormal: 25,
            sparkline: [18.2, 18.4, 18.6, 18.3, 18.5, 18.5],
            description: 'Hall-effect turbine fluid flow sensor',
          },
          {
            id: 's-m1-galv',
            name: 'Galvanic Current Density',
            code: 'GALV-ZRA-1',
            type: 'galvanic',
            value: 1.2,
            unit: 'µA/cm²',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 5.0,
            sparkline: [1.1, 1.3, 1.2, 1.1, 1.2, 1.2],
            description: 'Zero Resistance Ammetry across bimetallic joint',
          },
          {
            id: 's-m1-er',
            name: 'ER Metal Loss',
            code: 'ER-PROBE-01',
            type: 'er_loss',
            value: 0.38,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 1.5,
            sparkline: [0.35, 0.36, 0.37, 0.37, 0.38, 0.38],
            description: 'Electrical Resistance element thickness degradation',
          },
          {
            id: 's-m1-ut',
            name: 'UT Wall Thickness',
            code: 'UT-DUAL-01',
            type: 'ut_thickness',
            value: 9.62,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 7.0,
            maxNormal: 10.5,
            sparkline: [9.65, 9.64, 9.63, 9.63, 9.62, 9.62],
            description: 'Dual-element high-temp ultrasonic transducer',
          },
          {
            id: 's-m1-ph',
            name: 'Condensate pH',
            code: 'PH-IND-01',
            type: 'ph',
            value: 7.4,
            unit: 'pH',
            health: 'OK',
            isFaulty: false,
            minNormal: 6.8,
            maxNormal: 8.5,
            sparkline: [7.3, 7.4, 7.4, 7.3, 7.5, 7.4],
            description: 'Process fluid acidity/alkalinity probe',
          },
          {
            id: 's-m1-cl',
            name: 'Chloride Ion Conc.',
            code: 'ISE-CL-01',
            type: 'chloride',
            value: 24,
            unit: 'ppm',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 60,
            sparkline: [22, 23, 25, 24, 23, 24],
            description: 'Ion-selective electrode for free Cl- attack',
          },
        ],
        history: generateHistory(10.00, 9.62, 0.042),
      },
      {
        id: 'm-2',
        name: 'Storage Tank 2 (Bottom Plate)',
        tag: 'ST-202',
        type: 'Storage Tank',
        location: 'Chemical Storage Yard, Sump Sector B',
        material: 'Carbon Steel A516-70',
        status: 'Warning',
        statusReason: 'Chloride is high (215 ppm) and UT thinning faster than ER rate; pitting initiated in bottom weld toe.',
        likelyCorrosionType: 'Pitting',
        corrosionRate: 0.185,
        currentThickness: 12.10,
        initialThickness: 14.00,
        minimumAllowedThickness: 9.00,
        remainingLifeMonths: 20,
        lastReadingTime: '2 mins ago',
        verifyLoop: {
          step: 'alert_open',
          openedAt: '2026-11-23T14:30:00Z',
          canReturnToNormal: false,
        },
        sensors: [
          {
            id: 's-m2-temp',
            name: 'Ambient & Bulk Temp',
            code: 'PT100-B',
            type: 'temperature',
            value: 34.2,
            unit: '°C',
            health: 'OK',
            isFaulty: false,
            minNormal: 10,
            maxNormal: 45,
            sparkline: [33.8, 34.0, 34.1, 34.2, 34.3, 34.2],
            description: 'Internal sump thermal monitoring',
          },
          {
            id: 's-m2-hum',
            name: 'Atmospheric Sump Humidity',
            code: 'SHT31-D',
            type: 'humidity',
            value: 78.4,
            unit: '% RH',
            health: 'Drifting',
            isFaulty: false,
            minNormal: 20,
            maxNormal: 65,
            sparkline: [72.1, 74.0, 75.3, 76.8, 77.9, 78.4],
            description: 'Basement sump high moisture saturation',
          },
          {
            id: 's-m2-tow',
            name: 'Time of Wetness',
            code: 'TOW-RES-02',
            type: 'wetness',
            value: 68.0,
            unit: '%',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 35,
            sparkline: [58, 62, 64, 65, 67, 68],
            description: 'Continuous water film presence',
          },
          {
            id: 's-m2-flow',
            name: 'Bottom Drain Flow',
            code: 'YF-S201',
            type: 'flow',
            value: 2.1,
            unit: 'L/min',
            health: 'OK',
            isFaulty: false,
            minNormal: 1,
            maxNormal: 15,
            sparkline: [3.5, 3.0, 2.8, 2.5, 2.3, 2.1],
            description: 'Slow accumulation drain velocity',
          },
          {
            id: 's-m2-galv',
            name: 'Galvanic Current Density',
            code: 'GALV-ZRA-2',
            type: 'galvanic',
            value: 3.4,
            unit: 'µA/cm²',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 5.0,
            sparkline: [2.8, 3.0, 3.1, 3.2, 3.3, 3.4],
            description: 'Minor sediment-coupling galvanic delta',
          },
          {
            id: 's-m2-er',
            name: 'ER Metal Loss',
            code: 'ER-PROBE-02',
            type: 'er_loss',
            value: 0.95,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 1.5,
            sparkline: [0.88, 0.90, 0.91, 0.93, 0.94, 0.95],
            description: 'General uniform loss is moderate',
          },
          {
            id: 's-m2-ut',
            name: 'UT Wall Thickness',
            code: 'UT-DUAL-02',
            type: 'ut_thickness',
            value: 12.10,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 10.0,
            maxNormal: 14.5,
            sparkline: [12.6, 12.5, 12.4, 12.3, 12.2, 12.1],
            description: 'Local pit thinning outstrips general ER rate',
          },
          {
            id: 's-m2-cl',
            name: 'Chloride Ion Conc.',
            code: 'ISE-CL-02',
            type: 'chloride',
            value: 215,
            unit: 'ppm',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 75,
            sparkline: [180, 192, 198, 205, 210, 215],
            description: 'Extreme chloride breach breaking passive film',
          },
        ],
        history: generateHistory(14.00, 12.10, 0.185, 0.02),
      },
      {
        id: 'm-3',
        name: 'Cooling Line Branch',
        tag: 'CL-304',
        type: 'Cooling Line',
        location: 'Secondary HVAC Loop, Riser North',
        material: 'Carbon Steel AISI 1018',
        status: 'Critical',
        statusReason: 'Significant galvanic current (18.6 µA/cm²) detected at brass/carbon steel junction with accelerated wall thinning.',
        likelyCorrosionType: 'Galvanic',
        corrosionRate: 0.380,
        currentThickness: 5.82,
        initialThickness: 8.00,
        minimumAllowedThickness: 5.00,
        remainingLifeMonths: 2.5,
        lastReadingTime: '1 min ago',
        verifyLoop: {
          step: 'alert_open',
          openedAt: '2026-11-24T06:15:00Z',
          canReturnToNormal: false,
        },
        sensors: [
          {
            id: 's-m3-temp',
            name: 'Chilled Water Temp',
            code: 'PT100-C',
            type: 'temperature',
            value: 14.2,
            unit: '°C',
            health: 'OK',
            isFaulty: false,
            minNormal: 6,
            maxNormal: 22,
            sparkline: [14.0, 14.1, 14.3, 14.2, 14.2, 14.2],
            description: 'Refrigerated cooling loop feed',
          },
          {
            id: 's-m3-hum',
            name: 'Insulation Wetness Level',
            code: 'SHT31-C',
            type: 'humidity',
            value: 86.5,
            unit: '% RH',
            health: 'OK',
            isFaulty: false,
            minNormal: 20,
            maxNormal: 65,
            sparkline: [82, 84, 85, 85.5, 86, 86.5],
            description: 'Moisture trapped underneath lagging',
          },
          {
            id: 's-m3-tow',
            name: 'Time of Wetness',
            code: 'TOW-RES-03',
            type: 'wetness',
            value: 91.0,
            unit: '%',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 40,
            sparkline: [88, 89, 90, 90.5, 91, 91],
            description: 'Continuous condensation at cold pipe wall',
          },
          {
            id: 's-m3-flow',
            name: 'Cooling Circulation Flow',
            code: 'YF-S201',
            type: 'flow',
            value: 12.0,
            unit: 'L/min',
            health: 'OK',
            isFaulty: false,
            minNormal: 8,
            maxNormal: 20,
            sparkline: [12.2, 12.0, 11.9, 12.1, 12.0, 12.0],
            description: 'Normal water flow velocity',
          },
          {
            id: 's-m3-galv',
            name: 'Galvanic Current Density',
            code: 'GALV-ZRA-3',
            type: 'galvanic',
            value: 18.6,
            unit: 'µA/cm²',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 5.0,
            sparkline: [14.2, 15.5, 16.8, 17.5, 18.2, 18.6],
            description: 'CRITICAL galvanic couple: Carbon steel acting as active sacrificial anode to brass valve',
          },
          {
            id: 's-m3-er',
            name: 'ER Metal Loss',
            code: 'ER-PROBE-03',
            type: 'er_loss',
            value: 1.82,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 1.2,
            sparkline: [1.60, 1.65, 1.70, 1.74, 1.78, 1.82],
            description: 'High loss measured at galvanic coupon',
          },
          {
            id: 's-m3-ut',
            name: 'UT Wall Thickness',
            code: 'UT-DUAL-03',
            type: 'ut_thickness',
            value: 5.82,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 5.5,
            maxNormal: 8.5,
            sparkline: [6.15, 6.05, 5.98, 5.92, 5.86, 5.82],
            description: 'Approaching critical minimum allowable 5.00mm',
          },
          {
            id: 's-m3-ph',
            name: 'Coolant pH',
            code: 'PH-IND-03',
            type: 'ph',
            value: 6.2,
            unit: 'pH',
            health: 'OK',
            isFaulty: false,
            minNormal: 6.8,
            maxNormal: 8.5,
            sparkline: [6.5, 6.4, 6.4, 6.3, 6.2, 6.2],
            description: 'Acidic drift accelerating galvanic cell',
          },
        ],
        history: generateHistory(8.00, 5.82, 0.380, 0.03),
      },
      {
        id: 'm-4',
        name: 'Marine Pump Casing',
        tag: 'MP-401',
        type: 'Marine Pump',
        location: 'Saltwater Intake Station, Pump Bay 2',
        material: 'Carbon Steel A516-70',
        status: 'Warning',
        statusReason: 'Flow near zero (0.3 L/min) in flange gap combined with 94% time of wetness indicates stagnant crevice corrosion.',
        likelyCorrosionType: 'Crevice',
        corrosionRate: 0.220,
        currentThickness: 10.45,
        initialThickness: 12.00,
        minimumAllowedThickness: 8.00,
        remainingLifeMonths: 13,
        lastReadingTime: '5 mins ago',
        verifyLoop: {
          step: 'maintenance_done',
          openedAt: '2026-11-22T10:00:00Z',
          maintenanceDoneAt: '2026-11-24T12:00:00Z',
          canReturnToNormal: false,
        },
        sensors: [
          {
            id: 's-m4-temp',
            name: 'Impeller Casing Temp',
            code: 'PT100-D',
            type: 'temperature',
            value: 26.5,
            unit: '°C',
            health: 'OK',
            isFaulty: false,
            minNormal: 15,
            maxNormal: 40,
            sparkline: [26.0, 26.2, 26.3, 26.4, 26.5, 26.5],
            description: 'Pump body surface RTD',
          },
          {
            id: 's-m4-hum',
            name: 'Atmospheric Marine RH',
            code: 'SHT31-M',
            type: 'humidity',
            value: 88.0,
            unit: '% RH',
            health: 'OK',
            isFaulty: false,
            minNormal: 30,
            maxNormal: 70,
            sparkline: [86, 87, 87.5, 88, 88.2, 88.0],
            description: 'Saline coastal atmosphere',
          },
          {
            id: 's-m4-tow',
            name: 'Time of Wetness (TOW)',
            code: 'TOW-RES-04',
            type: 'wetness',
            value: 94.0,
            unit: '%',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 40,
            sparkline: [90, 91, 92, 93, 94, 94],
            description: 'Severe microclimate retention under gasket',
          },
          {
            id: 's-m4-flow',
            name: 'Local Crevice Flow',
            code: 'YF-S201',
            type: 'flow',
            value: 0.3,
            unit: 'L/min',
            health: 'OK',
            isFaulty: false,
            minNormal: 2.0,
            maxNormal: 15,
            sparkline: [1.2, 0.8, 0.6, 0.4, 0.3, 0.3],
            description: 'Flow stagnation zone behind unseated flange ring',
          },
          {
            id: 's-m4-galv',
            name: 'Galvanic Current',
            code: 'GALV-ZRA-4',
            type: 'galvanic',
            value: 2.8,
            unit: 'µA/cm²',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 5.0,
            sparkline: [2.5, 2.6, 2.7, 2.7, 2.8, 2.8],
            description: 'Nominal galvanic baseline',
          },
          {
            id: 's-m4-er',
            name: 'ER Metal Loss',
            code: 'ER-PROBE-04',
            type: 'er_loss',
            value: 1.15,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 1.5,
            sparkline: [1.05, 1.08, 1.10, 1.12, 1.14, 1.15],
            description: 'ER sensor in flow channel',
          },
          {
            id: 's-m4-ut',
            name: 'UT Crevice Thickness',
            code: 'UT-DUAL-04',
            type: 'ut_thickness',
            value: 10.45,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 8.5,
            maxNormal: 12.5,
            sparkline: [10.8, 10.7, 10.6, 10.55, 10.5, 10.45],
            description: 'Crevice root targeted transducer',
          },
          {
            id: 's-m4-cl',
            name: 'Chloride Ion Conc.',
            code: 'ISE-CL-04',
            type: 'chloride',
            value: 145,
            unit: 'ppm',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 80,
            sparkline: [130, 135, 138, 140, 142, 145],
            description: 'Seawater salt penetration',
          },
        ],
        history: generateHistory(12.00, 10.45, 0.220, 0.02),
      },
      {
        id: 'm-5',
        name: 'Pipeline Section 4 (Crude Transfer)',
        tag: 'PL-004',
        type: 'Pipeline',
        location: 'Cross-Country Manifold, Kilometer 14.8',
        material: 'Carbon Steel ASTM A106',
        status: 'Safe',
        statusReason: 'Uniform corrosion within acceptable design limits (0.051 mm/yr); cathodic protection active.',
        likelyCorrosionType: 'Uniform',
        corrosionRate: 0.051,
        currentThickness: 13.35,
        initialThickness: 14.20,
        minimumAllowedThickness: 9.50,
        remainingLifeMonths: 90,
        lastReadingTime: '3 mins ago',
        verifyLoop: {
          step: 'resolved',
          openedAt: '2026-09-01T00:00:00Z',
          canReturnToNormal: true,
        },
        sensors: [
          {
            id: 's-m5-temp',
            name: 'Soil/Wall Interface Temp',
            code: 'PT100-E',
            type: 'temperature',
            value: 21.8,
            unit: '°C',
            health: 'OK',
            isFaulty: false,
            minNormal: 5,
            maxNormal: 35,
            sparkline: [21.5, 21.6, 21.7, 21.8, 21.8, 21.8],
            description: 'Buried pipeline outer sleeve RTD',
          },
          {
            id: 's-m5-hum',
            name: 'Backfill Soil Moisture',
            code: 'SHT31-E',
            type: 'humidity',
            value: 52.0,
            unit: '% RH',
            health: 'OK',
            isFaulty: false,
            minNormal: 20,
            maxNormal: 70,
            sparkline: [51, 52, 51.5, 52.2, 52.0, 52.0],
            description: 'Soil resistivity moisture indicator',
          },
          {
            id: 's-m5-tow',
            name: 'Time of Wetness',
            code: 'TOW-RES-05',
            type: 'wetness',
            value: 24.0,
            unit: '%',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 40,
            sparkline: [22, 23, 24, 25, 24, 24],
            description: 'Periodic ground moisture cycle',
          },
          {
            id: 's-m5-flow',
            name: 'Transmission Velocity',
            code: 'YF-S201',
            type: 'flow',
            value: 21.4,
            unit: 'L/min',
            health: 'OK',
            isFaulty: false,
            minNormal: 15,
            maxNormal: 30,
            sparkline: [21.0, 21.2, 21.5, 21.3, 21.4, 21.4],
            description: 'Steady crude oil volumetric flow',
          },
          {
            id: 's-m5-galv',
            name: 'Cathodic Current Density',
            code: 'GALV-ZRA-5',
            type: 'galvanic',
            value: 1.8,
            unit: 'µA/cm²',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 5.0,
            sparkline: [1.6, 1.7, 1.8, 1.7, 1.8, 1.8],
            description: 'Impressed current CP balanced',
          },
          {
            id: 's-m5-er',
            name: 'ER Metal Loss',
            code: 'ER-PROBE-05',
            type: 'er_loss',
            value: 0.85,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 1.5,
            sparkline: [0.81, 0.82, 0.83, 0.84, 0.85, 0.85],
            description: 'Even, steady metal consumption',
          },
          {
            id: 's-m5-ut',
            name: 'UT Wall Thickness',
            code: 'UT-DUAL-05',
            type: 'ut_thickness',
            value: 13.35,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 10.5,
            maxNormal: 15.0,
            sparkline: [13.45, 13.42, 13.40, 13.38, 13.36, 13.35],
            description: 'Corresponds exactly to uniform ER rate',
          },
          {
            id: 's-m5-ph',
            name: 'Soil Electrolyte pH',
            code: 'PH-IND-05',
            type: 'ph',
            value: 7.1,
            unit: 'pH',
            health: 'OK',
            isFaulty: false,
            minNormal: 6.5,
            maxNormal: 8.5,
            sparkline: [7.0, 7.1, 7.1, 7.2, 7.1, 7.1],
            description: 'Neutral surrounding soil',
          },
        ],
        history: generateHistory(14.20, 13.35, 0.051),
      },
      {
        id: 'm-6',
        name: 'Heat Exchanger Shell',
        tag: 'HX-502',
        type: 'Heat Exchanger',
        location: 'Distillation Unit 2, Mezzanine',
        material: 'Carbon Steel AISI 1018',
        status: 'Safe',
        statusReason: 'Sensors nominal. Flow velocity prevents fouling or crevice microenvironments.',
        likelyCorrosionType: 'None',
        corrosionRate: 0.038,
        currentThickness: 11.20,
        initialThickness: 11.50,
        minimumAllowedThickness: 7.20,
        remainingLifeMonths: 126,
        lastReadingTime: 'Just now',
        verifyLoop: {
          step: 'resolved',
          openedAt: '2026-08-15T00:00:00Z',
          canReturnToNormal: true,
        },
        sensors: [
          {
            id: 's-m6-temp',
            name: 'Shell Shell-side Temp',
            code: 'PT100-F',
            type: 'temperature',
            value: 74.5,
            unit: '°C',
            health: 'OK',
            isFaulty: false,
            minNormal: 40,
            maxNormal: 95,
            sparkline: [73.8, 74.1, 74.4, 74.2, 74.5, 74.5],
            description: 'Shell wall thermal thermocouple RTD',
          },
          {
            id: 's-m6-hum',
            name: 'Surrounding RH',
            code: 'SHT31-F',
            type: 'humidity',
            value: 39.5,
            unit: '% RH',
            health: 'OK',
            isFaulty: false,
            minNormal: 20,
            maxNormal: 60,
            sparkline: [39.0, 39.2, 39.4, 39.6, 39.5, 39.5],
            description: 'Dry indoor turbine building air',
          },
          {
            id: 's-m6-tow',
            name: 'Time of Wetness',
            code: 'TOW-RES-06',
            type: 'wetness',
            value: 5.0,
            unit: '%',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 30,
            sparkline: [4, 5, 5, 6, 5, 5],
            description: 'Dry surface above dew point',
          },
          {
            id: 's-m6-flow',
            name: 'Shell Fluid Velocity',
            code: 'YF-S201',
            type: 'flow',
            value: 23.2,
            unit: 'L/min',
            health: 'OK',
            isFaulty: false,
            minNormal: 15,
            maxNormal: 30,
            sparkline: [22.8, 23.0, 23.1, 23.2, 23.2, 23.2],
            description: 'High turbulent flow prevents stagnation',
          },
          {
            id: 's-m6-galv',
            name: 'Galvanic Current',
            code: 'GALV-ZRA-6',
            type: 'galvanic',
            value: 0.9,
            unit: 'µA/cm²',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 5.0,
            sparkline: [0.8, 0.9, 0.9, 1.0, 0.9, 0.9],
            description: 'No bimetallic electrochemical bias',
          },
          {
            id: 's-m6-er',
            name: 'ER Metal Loss',
            code: 'ER-PROBE-06',
            type: 'er_loss',
            value: 0.30,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 0,
            maxNormal: 1.5,
            sparkline: [0.28, 0.28, 0.29, 0.29, 0.30, 0.30],
            description: 'Negligible baseline degradation',
          },
          {
            id: 's-m6-ut',
            name: 'UT Shell Thickness',
            code: 'UT-DUAL-06',
            type: 'ut_thickness',
            value: 11.20,
            unit: 'mm',
            health: 'OK',
            isFaulty: false,
            minNormal: 8.0,
            maxNormal: 12.0,
            sparkline: [11.25, 11.24, 11.23, 11.22, 11.21, 11.20],
            description: 'Full structural integrity maintained',
          },
        ],
        history: generateHistory(11.50, 11.20, 0.038),
      },
    ];

    // Seed realistic alert log
    this.alerts = [
      {
        id: 'alt-101',
        timestamp: '2026-11-24T06:15:00Z',
        machineId: 'm-3',
        machineName: 'Cooling Line Branch (CL-304)',
        level: 'Critical',
        corrosionType: 'Galvanic',
        reason: 'Galvanic current surge (18.6 µA/cm²) with rapid wall loss near brass coupling.',
        recommendedAction: 'Electrically isolate the dissimilar metals with insulating flange kit; add magnesium sacrificial anode.',
        status: 'Open',
        channels: ['Telegram', 'SMS', 'Email'],
      },
      {
        id: 'alt-102',
        timestamp: '2026-11-23T14:30:00Z',
        machineId: 'm-2',
        machineName: 'Storage Tank 2 (ST-202)',
        level: 'Warning',
        corrosionType: 'Pitting',
        reason: 'Chloride elevated to 215 ppm; UT ultrasonic thinning outpaces ER probe.',
        recommendedAction: 'Reduce chloride contamination through chemical flushing; apply localized zinc-rich barrier primer.',
        status: 'Open',
        channels: ['Telegram', 'Email'],
      },
      {
        id: 'alt-103',
        timestamp: '2026-11-22T10:00:00Z',
        machineId: 'm-4',
        machineName: 'Marine Pump Casing (MP-401)',
        level: 'Warning',
        corrosionType: 'Crevice',
        reason: 'Zero-velocity dead-zone under gasket with 94% moisture persistence.',
        recommendedAction: 'Remove stagnation point; flush micro-gap and apply elastomer crevice sealant.',
        status: 'Verifying',
        channels: ['Email'],
      },
    ];
  }

  // ------------------------------------------
  // Core AI/ML Diagnostic Rule Inference Engine
  // ------------------------------------------
  public diagnoseMachine(machine: Machine): {
    status: MachineStatus;
    likelyCorrosionType: CorrosionType;
    statusReason: string;
    corrosionRate: number;
    remainingLifeMonths: number;
  } {
    // Check for sensor faults first
    const faultySensor = machine.sensors.find(s => s.isFaulty || s.health === 'Failed');
    if (faultySensor) {
      return {
        status: 'Warning',
        likelyCorrosionType: machine.likelyCorrosionType === 'None' ? 'None' : machine.likelyCorrosionType,
        statusReason: `Sensor fault on ${faultySensor.name} (${faultySensor.code}), not real corrosion. Check wiring & telemetry harness.`,
        corrosionRate: machine.corrosionRate,
        remainingLifeMonths: machine.remainingLifeMonths,
      };
    }

    const galv = machine.sensors.find(s => s.type === 'galvanic')?.value ?? 0;
    const chloride = machine.sensors.find(s => s.type === 'chloride')?.value ?? 0;
    const flow = machine.sensors.find(s => s.type === 'flow')?.value ?? 10;
    const tow = machine.sensors.find(s => s.type === 'wetness')?.value ?? 0;
    const er = machine.sensors.find(s => s.type === 'er_loss')?.value ?? 0.5;
    const ut = machine.sensors.find(s => s.type === 'ut_thickness')?.value ?? machine.currentThickness;

    // Remaining life calculation formula specified:
    // Remaining life = (current thickness - minimum allowed thickness) / corrosion rate
    const margin = Math.max(0, ut - machine.minimumAllowedThickness);
    
    // Evaluate galvanic
    if (galv > 12.0) {
      const rate = +(0.32 + (galv - 12) * 0.015).toFixed(3);
      const remLifeYears = rate > 0 ? margin / rate : 99;
      const remLifeMonths = +(remLifeYears * 12).toFixed(1);
      return {
        status: remLifeMonths < 6 ? 'Critical' : 'Warning',
        likelyCorrosionType: 'Galvanic',
        statusReason: `Significant galvanic current (${galv.toFixed(1)} µA/cm²) detected at dissimilar metal contact.`,
        corrosionRate: rate,
        remainingLifeMonths: remLifeMonths,
      };
    }

    // Evaluate pitting (high chloride & UT thinning faster than ER)
    const utThicknessDrop = machine.initialThickness - ut;
    if (chloride > 160 && (utThicknessDrop > er * 1.3 || chloride > 200)) {
      const rate = +(0.16 + (chloride - 150) * 0.0008).toFixed(3);
      const remLifeYears = rate > 0 ? margin / rate : 99;
      const remLifeMonths = +(remLifeYears * 12).toFixed(1);
      return {
        status: remLifeMonths < 12 ? 'Critical' : 'Warning',
        likelyCorrosionType: 'Pitting',
        statusReason: `Chloride is high (${chloride.toFixed(0)} ppm) and UT localized thinning is outstripping general ER rate.`,
        corrosionRate: rate,
        remainingLifeMonths: remLifeMonths,
      };
    }

    // Evaluate crevice (near zero flow and long time of wetness)
    if (flow < 1.0 && tow > 70) {
      const rate = +(0.14 + (tow - 70) * 0.003).toFixed(3);
      const remLifeYears = rate > 0 ? margin / rate : 99;
      const remLifeMonths = +(remLifeYears * 12).toFixed(1);
      return {
        status: remLifeMonths < 12 ? 'Critical' : 'Warning',
        likelyCorrosionType: 'Crevice',
        statusReason: `Water flow is near zero (${flow.toFixed(1)} L/min) and time of wetness is elevated (${tow.toFixed(0)}%), forming an active oxygen-depleted crevice cell.`,
        corrosionRate: rate,
        remainingLifeMonths: remLifeMonths,
      };
    }

    // Evaluate uniform corrosion
    if (er > 0.6 || machine.corrosionRate > 0.07) {
      const rate = +(Math.max(0.045, machine.corrosionRate)).toFixed(3);
      const remLifeYears = rate > 0 ? margin / rate : 99;
      const remLifeMonths = +(remLifeYears * 12).toFixed(1);
      return {
        status: remLifeMonths < 18 ? 'Warning' : 'Safe',
        likelyCorrosionType: 'Uniform',
        statusReason: `Steady uniform thickness loss (${rate} mm/yr) observed across surface with no localized anomaly.`,
        corrosionRate: rate,
        remainingLifeMonths: remLifeMonths,
      };
    }

    // Safe baseline
    const normalRate = +(Math.max(0.03, machine.corrosionRate)).toFixed(3);
    const remLifeYears = normalRate > 0 ? margin / normalRate : 99;
    return {
      status: 'Safe',
      likelyCorrosionType: 'None',
      statusReason: 'All chemical and ultrasonic telemetry within safe industrial baselines.',
      corrosionRate: normalRate,
      remainingLifeMonths: +(remLifeYears * 12).toFixed(1),
    };
  }

  // ------------------------------------------
  // Periodic Realistic Sensor Jitter (Simulator)
  // ------------------------------------------
  private startSimulation() {
    // Tick every 3 seconds for live dashboard feeling (with tiny realistic drift)
    this.simulationInterval = window.setInterval(() => {
      if (this.demoState.active) {
        // Handled by demo runner
        return;
      }

      this.machines = this.machines.map(machine => {
        const updatedSensors = machine.sensors.map(sensor => {
          if (sensor.isFaulty) return sensor;
          
          const drift = (Math.random() - 0.49) * 0.015 * sensor.value;
          const nextVal = +(Math.max(0, sensor.value + drift)).toFixed(
            sensor.type === 'chloride' ? 0 : sensor.type === 'er_loss' || sensor.type === 'ut_thickness' ? 2 : 1
          );

          const spark = [...sensor.sparkline.slice(1), nextVal];
          return {
            ...sensor,
            value: nextVal,
            sparkline: spark,
          };
        });

        // Recalculate diagnosis
        const diag = this.diagnoseMachine({
          ...machine,
          sensors: updatedSensors,
        });

        return {
          ...machine,
          sensors: updatedSensors,
          status: diag.status,
          statusReason: diag.statusReason,
          likelyCorrosionType: diag.likelyCorrosionType,
          corrosionRate: diag.corrosionRate,
          remainingLifeMonths: diag.remainingLifeMonths,
          lastReadingTime: 'Just now',
        };
      });

      this.notifyMachines();
    }, 3500);
  }

  // ------------------------------------------
  // Interactive Demo Scenario Controller (~20 seconds)
  // ------------------------------------------
  public triggerDemoScenario(scenario: DemoScenario, targetMachineId: string = 'm-1') {
    this.stopDemoScenario();

    const machineIndex = this.machines.findIndex(m => m.id === targetMachineId);
    if (machineIndex === -1) return;

    this.demoState = {
      active: true,
      scenario,
      targetMachineId,
      stepProgress: 0,
      phase: 'Safe',
      secondsRemaining: 20,
    };
    this.notifyDemo();

    const totalSeconds = 20;
    let elapsed = 0;

    this.demoInterval = window.setInterval(() => {
      elapsed += 1;
      const progress = Math.min(100, Math.round((elapsed / totalSeconds) * 100));
      const secondsLeft = Math.max(0, totalSeconds - elapsed);

      let phase: 'Safe' | 'Warning' | 'Critical' | 'Fault' = 'Safe';
      if (scenario === 'Sensor Failure') {
        phase = elapsed < 6 ? 'Safe' : 'Fault';
      } else if (elapsed < 6) {
        phase = 'Safe';
      } else if (elapsed < 14) {
        phase = 'Warning';
      } else {
        phase = 'Critical';
      }

      this.demoState = {
        ...this.demoState,
        stepProgress: progress,
        phase,
        secondsRemaining: secondsLeft,
      };

      // Mutate target machine sensors according to scenario progression
      this.applyScenarioStep(targetMachineId, scenario, elapsed, totalSeconds);

      this.notifyDemo();
      this.notifyMachines();

      if (elapsed >= totalSeconds) {
        this.stopDemoScenario(false);
      }
    }, 1000);
  }

  private applyScenarioStep(
    machineId: string,
    scenario: DemoScenario,
    elapsed: number,
    totalSeconds: number
  ) {
    const fraction = elapsed / totalSeconds; // 0.0 -> 1.0

    this.machines = this.machines.map(m => {
      if (m.id !== machineId) return m;

      let sensors = [...m.sensors];
      let currentThickness = m.currentThickness;
      let initialThickness = m.initialThickness;

      if (scenario === 'Developing Pitting') {
        sensors = sensors.map(s => {
          if (s.type === 'chloride') {
            const val = Math.round(30 + fraction * 260); // 30 -> 290 ppm
            return { ...s, value: val, sparkline: [...s.sparkline.slice(1), val] };
          }
          if (s.type === 'ut_thickness') {
            // Local pit drops rapidly
            const val = +(initialThickness - (0.3 + fraction * 3.2)).toFixed(2);
            currentThickness = val;
            return { ...s, value: val, sparkline: [...s.sparkline.slice(1), val] };
          }
          if (s.type === 'er_loss') {
            // General ER loss only rises mildly
            const val = +(0.3 + fraction * 0.4).toFixed(2);
            return { ...s, value: val, sparkline: [...s.sparkline.slice(1), val] };
          }
          return s;
        });
      } else if (scenario === 'Galvanic Problem') {
        sensors = sensors.map(s => {
          if (s.type === 'galvanic') {
            const val = +(1.2 + fraction * 21.0).toFixed(1); // 1.2 -> 22.2 µA/cm²
            return { ...s, value: val, sparkline: [...s.sparkline.slice(1), val] };
          }
          if (s.type === 'ut_thickness') {
            const val = +(m.initialThickness - (0.4 + fraction * 2.8)).toFixed(2);
            currentThickness = val;
            return { ...s, value: val, sparkline: [...s.sparkline.slice(1), val] };
          }
          if (s.type === 'er_loss') {
            const val = +(0.3 + fraction * 1.5).toFixed(2);
            return { ...s, value: val, sparkline: [...s.sparkline.slice(1), val] };
          }
          return s;
        });
      } else if (scenario === 'Stagnant Crevice') {
        sensors = sensors.map(s => {
          if (s.type === 'flow') {
            const val = +(Math.max(0.1, 18.0 - fraction * 17.8)).toFixed(1); // 18.0 -> 0.2 L/min
            return { ...s, value: val, sparkline: [...s.sparkline.slice(1), val] };
          }
          if (s.type === 'wetness') {
            const val = Math.round(15 + fraction * 80); // 15% -> 95%
            return { ...s, value: val, sparkline: [...s.sparkline.slice(1), val] };
          }
          if (s.type === 'ut_thickness') {
            const val = +(m.initialThickness - (0.4 + fraction * 2.1)).toFixed(2);
            currentThickness = val;
            return { ...s, value: val, sparkline: [...s.sparkline.slice(1), val] };
          }
          return s;
        });
      } else if (scenario === 'Sensor Failure') {
        if (elapsed > 5) {
          sensors = sensors.map(s => {
            if (s.type === 'ut_thickness') {
              return {
                ...s,
                value: -99.9,
                health: 'Failed',
                isFaulty: true,
                sparkline: [...s.sparkline.slice(1), -99.9],
              };
            }
            return s;
          });
        }
      } else if (scenario === 'Normal') {
        // Return to normal
        sensors = sensors.map(s => {
          return {
            ...s,
            health: 'OK',
            isFaulty: false,
            value: s.minNormal + (s.maxNormal - s.minNormal) * 0.4,
          };
        });
        currentThickness = m.initialThickness - 0.35;
      }

      const updatedMachine = {
        ...m,
        sensors,
        currentThickness,
      };

      const diag = this.diagnoseMachine(updatedMachine);

      // Check if we should trigger an alert
      if ((diag.status === 'Warning' || diag.status === 'Critical') && fraction > 0.4) {
        this.ensureAlertForMachine(updatedMachine, diag.status, diag.likelyCorrosionType, diag.statusReason);
      }

      return {
        ...updatedMachine,
        status: diag.status,
        statusReason: diag.statusReason,
        likelyCorrosionType: diag.likelyCorrosionType,
        corrosionRate: diag.corrosionRate,
        remainingLifeMonths: diag.remainingLifeMonths,
        lastReadingTime: 'Just now',
      };
    });
  }

  private ensureAlertForMachine(
    machine: Machine,
    level: 'Warning' | 'Critical',
    corrosionType: CorrosionType,
    reason: string
  ) {
    const existing = this.alerts.find(a => a.machineId === machine.id && a.status !== 'Closed');
    let recommendedAction = 'Inspect site and review sensor telemetry.';
    if (corrosionType === 'Pitting') {
      recommendedAction = 'Reduce chloride concentration, perform ultrasonic grid scan, and apply localized passivating inhibitor.';
    } else if (corrosionType === 'Galvanic') {
      recommendedAction = 'Electrically isolate dissimilar metals with dielectric gasket kit; verify sacrificial anode potential.';
    } else if (corrosionType === 'Crevice') {
      recommendedAction = 'Disassemble flange, flush stagnant debris, reseal crevice with non-wicking elastomeric sealant.';
    } else if (corrosionType === 'Uniform') {
      recommendedAction = 'Apply protective barrier coating or injection of film-forming corrosion inhibitor; adjust fluid pH.';
    }

    if (!existing) {
      const newAlert: AlertNotification = {
        id: `alt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        machineId: machine.id,
        machineName: `${machine.name} (${machine.tag})`,
        level,
        corrosionType,
        reason,
        recommendedAction,
        status: 'Open',
        channels: ['Telegram', 'SMS', 'Email'],
      };
      this.alerts = [newAlert, ...this.alerts];
      this.notifyAlerts();
    } else {
      if (existing.level !== level || existing.reason !== reason) {
        existing.level = level;
        existing.reason = reason;
        existing.corrosionType = corrosionType;
        existing.recommendedAction = recommendedAction;
        this.notifyAlerts();
      }
    }
  }

  public stopDemoScenario(clearState: boolean = true) {
    if (this.demoInterval) {
      clearInterval(this.demoInterval);
      this.demoInterval = null;
    }
    if (clearState) {
      this.demoState = {
        active: false,
        scenario: 'Normal',
        targetMachineId: this.demoState.targetMachineId,
        stepProgress: 0,
        phase: 'Safe',
        secondsRemaining: 0,
      };
      this.notifyDemo();
    } else {
      this.demoState.active = false;
      this.notifyDemo();
    }
  }

  // ------------------------------------------
  // Verify Loop Workflow
  // Alert open -> Maintenance done -> Verify with sensors -> Normal
  // ------------------------------------------
  public markMaintenanceDone(machineId: string) {
    this.machines = this.machines.map(m => {
      if (m.id !== machineId) return m;

      return {
        ...m,
        verifyLoop: {
          ...m.verifyLoop,
          step: 'maintenance_done',
          maintenanceDoneAt: new Date().toISOString(),
          notes: 'Maintenance technician performed recommended procedure. Awaiting sensor re-verification.',
          canReturnToNormal: false,
        },
      };
    });

    // Update alert status
    this.alerts = this.alerts.map(a => {
      if (a.machineId === machineId && a.status === 'Open') {
        return { ...a, status: 'Verifying' };
      }
      return a;
    });

    this.notifyMachines();
    this.notifyAlerts();
  }

  public runSensorVerification(machineId: string) {
    this.machines = this.machines.map(m => {
      if (m.id !== machineId) return m;

      const diag = this.diagnoseMachine(m);
      const isHealthy = diag.status === 'Safe';

      if (isHealthy) {
        return {
          ...m,
          verifyLoop: {
            ...m.verifyLoop,
            step: 'resolved',
            verifiedAt: new Date().toISOString(),
            canReturnToNormal: true,
            notes: 'Sensors confirmed normalized parameters. Corrosion rate stabilized.',
          },
        };
      } else {
        // Sensors still abnormal! Alert stays open or returns to open
        return {
          ...m,
          verifyLoop: {
            ...m.verifyLoop,
            step: 'verifying',
            canReturnToNormal: false,
            notes: 'Verification attempted, but sensor telemetry remains abnormal! Alert cannot be closed.',
          },
        };
      }
    });

    this.notifyMachines();
  }

  public resetMachineToHealthy(machineId: string) {
    this.machines = this.machines.map(m => {
      if (m.id !== machineId) return m;

      const sensors = m.sensors.map(s => ({
        ...s,
        health: 'OK' as SensorHealth,
        isFaulty: false,
        value: s.minNormal + (s.maxNormal - s.minNormal) * 0.45,
      }));

      return {
        ...m,
        sensors,
        status: 'Safe' as MachineStatus,
        statusReason: 'Parameters normalized following maintenance and flushing.',
        likelyCorrosionType: 'None' as CorrosionType,
        corrosionRate: 0.045,
        remainingLifeMonths: 84,
        verifyLoop: {
          step: 'resolved',
          openedAt: m.verifyLoop.openedAt,
          verifiedAt: new Date().toISOString(),
          canReturnToNormal: true,
          notes: 'Sensors verified in safe boundary.',
        },
      };
    });

    this.alerts = this.alerts.map(a => {
      if (a.machineId === machineId) {
        return { ...a, status: 'Closed' };
      }
      return a;
    });

    this.notifyMachines();
    this.notifyAlerts();
  }

  // ------------------------------------------
  // Public Accessors & Subscriptions
  // ------------------------------------------
  public getMachines(): Machine[] {
    return [...this.machines];
  }

  public getMachineById(id: string): Machine | undefined {
    return this.machines.find(m => m.id === id);
  }

  public getAlerts(): AlertNotification[] {
    return [...this.alerts];
  }

  public getDemoState(): DemoScenarioState {
    return { ...this.demoState };
  }

  public subscribeMachines(listener: Listener<Machine[]>): () => void {
    this.machineListeners.add(listener);
    listener([...this.machines]);
    return () => this.machineListeners.delete(listener);
  }

  public subscribeAlerts(listener: Listener<AlertNotification[]>): () => void {
    this.alertListeners.add(listener);
    listener([...this.alerts]);
    return () => this.alertListeners.delete(listener);
  }

  public subscribeDemo(listener: Listener<DemoScenarioState>): () => void {
    this.demoListeners.add(listener);
    listener({ ...this.demoState });
    return () => this.demoListeners.delete(listener);
  }

  private notifyMachines() {
    const list = [...this.machines];
    this.machineListeners.forEach(fn => fn(list));
  }

  private notifyAlerts() {
    const list = [...this.alerts];
    this.alertListeners.forEach(fn => fn(list));
  }

  private notifyDemo() {
    const state = { ...this.demoState };
    this.demoListeners.forEach(fn => fn(state));
  }
}

export const dataSource = new DataSourceService();
