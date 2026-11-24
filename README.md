# CorroCAST — Industrial AI/ML Corrosion Monitoring System
> **Student Capstone Project: LPL Team 7**  
> *Target Material: Carbon Steel (ASTM A106, A516-70, AISI 1018)*

![CorroCAST Status](https://img.shields.io/badge/Status-Operational-10b981?style=flat-square)
![Target Metallurgy](https://img.shields.io/badge/Metallurgy-Carbon%20Steel-06b6d4?style=flat-square)
![Decision Support](https://img.shields.io/badge/Role-Advisory%20DSS-f59e0b?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## ⚠️ Core Operating Principle
> **IMPORTANT:** CorroCAST only alerts and recommends. It never repairs or stops machines. All physical interventions, valving, chemical treatments, and ultrasonic verifications are executed by human plant engineers.

---

## 📌 Project Overview
**CorroCAST** is an animated, responsive, high-fidelity Decision Support System (DSS) engineered to monitor industrial machinery, boiler pipes, crude transmission lines, and storage tanks constructed from carbon steel. 

CorroCAST continuously ingests electrochemical, physical, and acoustic sensor telemetry, applies multivariate ML diagnostic classification, forecasts Remaining Useful Life (RUL), and recommends prescriptive maintenance workflows to mitigate failure before minimum allowable wall thickness ($t_{min}$) is breached.

---

## 🛠 Tech Stack
- **Framework & Language:** React 19 + TypeScript + Vite 6
- **Styling & Theme:** Tailwind CSS (Dark-first industrial tech palette with Cyan `#06b6d4` accent; Light theme toggle)
- **Charts & Visualization:** Recharts (Area charts with uncertainty bands, multi-line ER vs. UT degradation, ASME/API RUL gauges)
- **Icons:** Lucide React
- **Animations:** CSS hardware-accelerated animations, Framer Motion, respectful of `prefers-reduced-motion`
- **Routing:** React Router v7

---

## 📂 Project Architecture

```
lpl/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.tsx               # Status (Safe/Warn/Crit), corrosion, & health badges
│   │   │   ├── DemoScenarioBar.tsx      # Floating interactive presentation scenario dock
│   │   │   ├── DisclaimerBanner.tsx     # Advisory DSS disclaimer header
│   │   │   ├── Footer.tsx               # Industrial footer with carbon steel citations
│   │   │   ├── Navbar.tsx               # Header with simulated badge, clock, and theme toggle
│   │   │   └── StatCard.tsx             # Animated count-up fleet metrics
│   │   └── machine/
│   │       ├── CorrosionEvidenceCard.tsx# ML evidence matrix for Uniform/Pitting/Galvanic/Crevice
│   │       ├── CorrosionRateChart.tsx   # mm/yr rate with ±2σ statistical uncertainty band
│   │       ├── MachineCard.tsx          # Card with sparkline, pulse animation, & RUL
│   │       ├── RecommendationPanel.tsx  # "What to do" prescriptive maintenance steps
│   │       ├── RemainingLifeGauge.tsx   # ASME / API 570 remaining life calculation gauge
│   │       ├── SensorTile.tsx           # Sensor telemetry tile with health & fault detection
│   │       ├── ThicknessHistoryChart.tsx# ER metal loss vs. Ultrasonic (UT) wall thickness
│   │       └── VerifyLoopStepper.tsx    # Closed-loop: Alert -> Fix -> Sensor Verify -> Normal
│   ├── context/
│   │   ├── DataContext.tsx             # Unified state access
│   │   └── ThemeContext.tsx            # Light/Dark mode state & persistence
│   ├── pages/
│   │   ├── AboutPage.tsx               # LPL Team 7 info, editable members, subjects, roadmap
│   │   ├── AlertsPage.tsx              # Incident table with filters & notification channels
│   │   ├── CorrosionGuidePage.tsx      # Mechanistic guide with animated SVG schematics
│   │   ├── HowItWorksPage.tsx          # 10-stage sequential animated pipeline diagram
│   │   ├── MachineDetailPage.tsx       # Asset-level deep-dive diagnostics
│   │   └── OverviewPage.tsx            # Fleet summary and 6 machine asset cards
│   ├── services/
│   │   └── dataSource.ts               # SINGLE SERVICE GATEWAY for all telemetry
│   ├── types/
│   │   └── index.ts                    # Strict TypeScript interfaces
│   ├── App.tsx                         # Top-level routing & layout
│   ├── index.css                       # Tailwind layers, scrollbars, and pulse keyframes
│   └── main.tsx                        # React DOM mounting
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🔌 Connecting Real Hardware (MQTT / ThingSpeak / InfluxDB)
All data access in CorroCAST is decoupled behind **one unified service file**:
`src/services/dataSource.ts`.

Currently, it runs a realistic local time-series simulation with jitter and interactive scenarios. To switch to real production telemetry:
1. Open `src/services/dataSource.ts`.
2. Replace the internal `startSimulation()` loop with an MQTT client (e.g. `mqtt.js`) or HTTP REST polling from **ThingSpeak** or **InfluxDB 2.0 Flux API**:
   ```typescript
   // Example MQTT Integration:
   import mqtt from 'mqtt';
   const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

   client.on('connect', () => {
     client.subscribe('corrocast/telemetry/+/sensors');
   });

   client.on('message', (topic, payload) => {
     const data = JSON.parse(payload.toString());
     // Mutate internal machine array and invoke this.notifyMachines()
   });
   ```
3. The rest of the user interface, alerts system, verification loop, and charts will continue working seamlessly without any page-level changes!

---

## 🧪 Corrosion Diagnosis Matrix
CorroCAST diagnoses four primary degradation modes on carbon steel:

| Corrosion Type | Key Telemetry Signals | Automated ML Hypothesis Criteria | Prescriptive Remediation |
|---|---|---|---|
| **Uniform** | ER probe, UT thickness, pH | Steady linear thickness loss, nominal galvanic & chloride | Apply epoxy/polyurethane barrier coating; inject neutralizing inhibitors |
| **Pitting** | Chloride ISE probe, UT A-scan | High chloride ($>150\text{ ppm}$) and UT local pit thinning outstrips general ER rate | Flush with demineralized water; apply chemical passivation wash; localized composite repair |
| **Galvanic** | Zero Resistance Ammetry (ZRA) | Galvanic current density surges ($>10\text{ }\mu\text{A/cm}^2$) across dissimilar metal joint | Electrically isolate metals with dielectric gasket kits; install sacrificial zinc/magnesium anode |
| **Crevice** | YF-S201 flow, TOW sensor | Flow velocity near zero ($<0.5\text{ L/min}$) and Time of Wetness $>70\%$ | Flush stagnation dead-legs; disassemble flange and seal with non-wicking elastomeric sealant |

---

## 🔄 Closed-Loop Verification Workflow
To enforce strict industrial safety, tickets follow a four-stage state machine:
$$\text{Alert Open} \longrightarrow \text{Maintenance Done} \longrightarrow \text{Verify With Sensors} \longrightarrow \text{Normal (Closed)}$$
- If maintenance is marked done but physical sensor readings (ultrasonic wall thickness, chloride, flow) remain anomalous upon verification, **the alert remains open**.
- It only transitions to `Normal` once telemetric sensors verify safe boundaries.

---

## 🚀 Presentation Demo Mode
A floating dock at the bottom of the screen allows live demonstrations:
- **Normal:** Restores healthy baselines.
- **Pitting Attack:** Chloride climbs $>200\text{ ppm}$; localized UT thinning escalates machine from Safe $\to$ Warning $\to$ Critical over ~20s.
- **Galvanic Problem:** Galvanic current surges to $22\text{ }\mu\text{A/cm}^2$.
- **Stagnant Crevice:** Fluid flow plummets to $0.2\text{ L/min}$ while wetness hits $95\%$.
- **Sensor Failure:** UT sensor drops to `ERR / -99.9` and flags **"sensor fault, not real corrosion"**, demonstrating that CorroCAST prevents false structural alarms.

---

## 💻 Quick Start & Installation

### 1. Prerequisites
Ensure **Node.js 18+** and **npm** are installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 👥 Interdisciplinary Project Team (LPL Team 7)
- **Subjects Integrated:**
  - **Physics:** Piezoelectric ultrasonic wave velocity, Reynolds fluid dynamics, heat transfer.
  - **Chemistry:** Anodic iron dissolution, Nernst electrochemical potentials, passivation kinetics.
  - **Electronics:** Zero Resistance Ammetry (ZRA), Wheatstone resistance bridges, low-power deep sleep.
  - **Digital Logic:** Verification state machine, threshold comparator logic, interrupt gating.
  - **Management:** Decision Support System (DSS) human-in-the-loop workflows, API 570 risk mitigation.

*(Team member names and roles can be customized interactively on the **About** page and will persist in local browser storage).*
