import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoModeModal } from './components/DemoModeModal';
import { AnomalyToast } from './components/AnomalyToast';
import { Overview } from './pages/Overview';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { SimulationLab } from './pages/SimulationLab';
import { AIInsights } from './pages/AIInsights';
import { ImpactPage } from './pages/ImpactPage';
import { PresentationMode } from './pages/PresentationMode';
import { AssumptionsPage } from './pages/AssumptionsPage';
import { api } from './services/api';
import {
  OverviewState, Building, WaterSystem, EnergySystem, TrafficSystem,
  WasteBin, Prediction, SimulationParams
} from './types';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // Live state
  const [overviewState, setOverviewState] = useState<OverviewState | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [water, setWater] = useState<WaterSystem | null>(null);
  const [energy, setEnergy] = useState<EnergySystem | null>(null);
  const [traffic, setTraffic] = useState<TrafficSystem | null>(null);
  const [wasteBins, setWasteBins] = useState<WasteBin[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  // Simulation Lab params state for demo sync
  const [customSimParams, setCustomSimParams] = useState<SimulationParams | undefined>(undefined);

  const fetchLiveData = async () => {
    try {
      const [ov, bldgs, wtr, nrg, trf, wst, alr, prd] = await Promise.all([
        api.getOverview(),
        api.getBuildings(),
        api.getWaterSystem(),
        api.getEnergySystem(),
        api.getTrafficSystem(),
        api.getWasteBins(),
        api.getAlerts(),
        api.getPredictions()
      ]);

      setOverviewState(ov);
      setBuildings(bldgs);
      setWater(wtr);
      setEnergy(nrg);
      setTraffic(trf);
      setWasteBins(wst);
      setAlerts(alr.simulated_alerts || []);
      setAnomalies(alr.ai_detected_anomalies || []);
      setPredictions(prd);
    } catch (err) {
      console.error('API Sync Error:', err);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3000); // 3-second live refresh
    return () => clearInterval(interval);
  }, []);

  const handleTriggerEvent = async (eventName: string) => {
    try {
      await api.triggerEvent(eventName);
      await fetchLiveData();
    } catch (err) {
      console.error('Failed to trigger event:', err);
    }
  };

  const handleApplyDemoSimulation = (params: SimulationParams) => {
    setCustomSimParams(params);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onStartDemo={() => setIsDemoOpen(true)}
        onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
        isPresentationMode={isPresentationMode}
        simulatedTime={overviewState?.simulated_time}
        activeEvent={overviewState?.active_event}
      />

      <main className={`flex-1 ${isPresentationMode ? 'p-2' : 'max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8'}`}>
        {isPresentationMode ? (
          <PresentationMode
            buildings={buildings}
            water={water}
            wasteBins={wasteBins}
            energy={energy}
            traffic={traffic}
            greenCoveragePct={overviewState?.weather.green_coverage_pct || 25}
            rainfallMm={overviewState?.weather.rainfall_mm || 0}
            activeEvent={overviewState?.active_event || 'normal'}
            alerts={alerts}
            anomalies={anomalies}
            onStartDemo={() => setIsDemoOpen(true)}
            onTriggerEvent={handleTriggerEvent}
          />
        ) : (
          <>
            {currentPage === 'overview' && (
              <Overview
                overviewState={overviewState}
                buildings={buildings}
                water={water}
                energy={energy}
                traffic={traffic}
                wasteBins={wasteBins}
                alerts={alerts}
                anomalies={anomalies}
                onNavigate={setCurrentPage}
                onTriggerEvent={handleTriggerEvent}
              />
            )}

            {currentPage === 'digital-twin' && (
              <DigitalTwinPage
                buildings={buildings}
                water={water}
                wasteBins={wasteBins}
                energy={energy}
                traffic={traffic}
                greenCoveragePct={overviewState?.weather.green_coverage_pct || 25}
                rainfallMm={overviewState?.weather.rainfall_mm || 0}
                activeEvent={overviewState?.active_event || 'normal'}
                onTriggerEvent={handleTriggerEvent}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'monitoring' && (
              <LiveMonitoring
                water={water}
                energy={energy}
                traffic={traffic}
                wasteBins={wasteBins}
                predictions={predictions}
                simulatedTime={overviewState?.simulated_time || '12:00'}
                buildings={buildings}
              />
            )}

            {currentPage === 'simulation-lab' && (
              <SimulationLab externalParams={customSimParams} />
            )}

            {currentPage === 'ai-insights' && (
              <AIInsights anomalies={anomalies} predictions={predictions} />
            )}

            {currentPage === 'impact' && (
              <ImpactPage onNavigate={setCurrentPage} />
            )}

            {currentPage === 'assumptions' && (
              <AssumptionsPage />
            )}
          </>
        )}
      </main>

      <DemoModeModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigate={setCurrentPage}
        onApplySimulation={handleApplyDemoSimulation}
      />

      <AnomalyToast anomalies={anomalies} />

      {!isPresentationMode && <Footer />}
    </div>
  );
};
