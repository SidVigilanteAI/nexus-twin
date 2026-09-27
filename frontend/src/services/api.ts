import {
  OverviewState, Building, WaterSystem, EnergySystem, TrafficSystem,
  WasteBin, Prediction, SimulationResponse, SimulationParams, Recommendation
} from '../types';

const API_BASE = '/api';

export const api = {
  getOverview: async (): Promise<OverviewState> => {
    const res = await fetch(`${API_BASE}/overview`);
    if (!res.ok) throw new Error('Failed to fetch overview');
    return res.json();
  },

  getBuildings: async (): Promise<Building[]> => {
    const res = await fetch(`${API_BASE}/buildings`);
    if (!res.ok) throw new Error('Failed to fetch buildings');
    return res.json();
  },

  getLiveSensors: async () => {
    const res = await fetch(`${API_BASE}/sensors/live`);
    if (!res.ok) throw new Error('Failed to fetch live sensor stream');
    return res.json();
  },

  triggerEvent: async (eventName: string) => {
    const res = await fetch(`${API_BASE}/events/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_name: eventName })
    });
    if (!res.ok) throw new Error('Failed to trigger simulation event');
    return res.json();
  },

  getWaterSystem: async (): Promise<WaterSystem> => {
    const res = await fetch(`${API_BASE}/water`);
    if (!res.ok) throw new Error('Failed to fetch water metrics');
    return res.json();
  },

  getEnergySystem: async (): Promise<EnergySystem> => {
    const res = await fetch(`${API_BASE}/energy`);
    if (!res.ok) throw new Error('Failed to fetch energy metrics');
    return res.json();
  },

  getTrafficSystem: async (): Promise<TrafficSystem> => {
    const res = await fetch(`${API_BASE}/traffic`);
    if (!res.ok) throw new Error('Failed to fetch traffic metrics');
    return res.json();
  },

  getWasteBins: async (): Promise<WasteBin[]> => {
    const res = await fetch(`${API_BASE}/waste`);
    if (!res.ok) throw new Error('Failed to fetch waste metrics');
    return res.json();
  },

  getAlerts: async () => {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  getPredictions: async (): Promise<Prediction[]> => {
    const res = await fetch(`${API_BASE}/predictions`);
    if (!res.ok) throw new Error('Failed to fetch predictions');
    return res.json();
  },

  runSimulation: async (params: SimulationParams): Promise<SimulationResponse> => {
    const res = await fetch(`${API_BASE}/simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to run simulation');
    return res.json();
  },

  resetSimulation: async (): Promise<SimulationResponse> => {
    const res = await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset simulation');
    return res.json();
  },

  getRecommendations: async (): Promise<Recommendation[]> => {
    const res = await fetch(`${API_BASE}/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  getImpact: async (): Promise<SimulationResponse> => {
    const res = await fetch(`${API_BASE}/impact`);
    if (!res.ok) throw new Error('Failed to fetch impact summary');
    return res.json();
  },

  getMLEvaluation: async () => {
    const res = await fetch(`${API_BASE}/ml-eval`);
    if (!res.ok) throw new Error('Failed to fetch ML evaluation');
    return res.json();
  },

  getAssumptions: async () => {
    const res = await fetch(`${API_BASE}/assumptions`);
    if (!res.ok) throw new Error('Failed to fetch assumptions');
    return res.json();
  },

  getHistory: async () => {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('Failed to fetch sensor history');
    return res.json();
  }
};
