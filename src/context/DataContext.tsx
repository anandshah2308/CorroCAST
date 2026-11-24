import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Machine,
  AlertNotification,
  DemoScenario,
  DemoScenarioState
} from '../types';
import { dataSource } from '../services/dataSource';

interface DataContextType {
  machines: Machine[];
  alerts: AlertNotification[];
  demoState: DemoScenarioState;
  getMachineById: (id: string) => Machine | undefined;
  triggerDemoScenario: (scenario: DemoScenario, targetMachineId?: string) => void;
  stopDemoScenario: () => void;
  markMaintenanceDone: (machineId: string) => void;
  runSensorVerification: (machineId: string) => void;
  resetMachineToHealthy: (machineId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>(() => dataSource.getMachines());
  const [alerts, setAlerts] = useState<AlertNotification[]>(() => dataSource.getAlerts());
  const [demoState, setDemoState] = useState<DemoScenarioState>(() => dataSource.getDemoState());

  useEffect(() => {
    const unsubMachines = dataSource.subscribeMachines(setMachines);
    const unsubAlerts = dataSource.subscribeAlerts(setAlerts);
    const unsubDemo = dataSource.subscribeDemo(setDemoState);

    return () => {
      unsubMachines();
      unsubAlerts();
      unsubDemo();
    };
  }, []);

  const getMachineById = (id: string) => {
    return machines.find(m => m.id === id);
  };

  const triggerDemoScenario = (scenario: DemoScenario, targetMachineId?: string) => {
    dataSource.triggerDemoScenario(scenario, targetMachineId);
  };

  const stopDemoScenario = () => {
    dataSource.stopDemoScenario();
  };

  const markMaintenanceDone = (machineId: string) => {
    dataSource.markMaintenanceDone(machineId);
  };

  const runSensorVerification = (machineId: string) => {
    dataSource.runSensorVerification(machineId);
  };

  const resetMachineToHealthy = (machineId: string) => {
    dataSource.resetMachineToHealthy(machineId);
  };

  return (
    <DataContext.Provider
      value={{
        machines,
        alerts,
        demoState,
        getMachineById,
        triggerDemoScenario,
        stopDemoScenario,
        markMaintenanceDone,
        runSensorVerification,
        resetMachineToHealthy,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
