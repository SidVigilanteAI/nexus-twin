export interface Building {
  id: string;
  name: string;
  category: string;
  occupancy: number;
  electricity_kw: number;
  water_lhr: number;
  co2_kg: number;
  anomaly_status: 'Normal' | 'Warning' | 'Critical';
  description: string;
}

export interface WaterSystem {
  tank_level_l: number;
  tank_capacity_l: number;
  inflow_lhr: number;
  outflow_lhr: number;
  pressure_psi: number;
  leak_prob: number;
  affected_zone: string;
  anomaly_status: 'Normal' | 'Warning' | 'Critical';
  estimated_daily_loss_l: number;
}

export interface EnergySystem {
  solar_gen_kw: number;
  solar_cap_kw: number;
  grid_demand_kw: number;
  total_consumption_kw: number;
  solar_contribution_pct: number;
  grid_dependency_pct: number;
  co2_emissions_kg_hr: number;
  estimated_hourly_cost_usd: number;
}

export interface TrafficSystem {
  total_vehicles: number;
  avg_speed_kmh: number;
  cars_cnt: number;
  buses_cnt: number;
  evs_cnt: number;
  two_wheelers_cnt: number;
  congestion_level: 'Low' | 'Moderate' | 'Critical';
  estimated_emissions_kg_hr: number;
  public_transport_share_pct: number;
}

export interface WasteBin {
  bin_id: string;
  location: string;
  fill_pct: number;
  waste_type: string;
  predicted_overflow_hrs: number;
  collection_priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Alert {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'Normal' | 'Warning' | 'Critical' | 'High';
  system_zone: string;
  expected_value: string;
  observed_value: string;
  confidence_score: number;
}

export interface Anomaly {
  metric: string;
  type: string;
  observed: string;
  expected: string;
  excess: string;
  confidence_pct: number;
  affected_zone: string;
  possible_cause: string;
  severity: string;
}

export interface Prediction {
  metric_name: string;
  target_hours: number;
  current_value: number;
  predicted_value: number;
  unit: string;
  risk_level: 'Low' | 'Moderate' | 'High';
  mae: number;
}

export interface ScenarioMetrics {
  co2_kg_day: number;
  water_l_day: number;
  grid_dependency_pct: number;
  solar_generation_kw: number;
  traffic_vehicles_cnt: number;
  flood_risk_score: number;
  flood_risk_category: string;
}

export interface ImpactMetrics {
  co2_reduction_percent: number;
  water_saved_percent: number;
  energy_saved_percent: number;
  traffic_reduction_percent: number;
  flood_risk_change_percent: number;
  co2_avoided_kg_day: number;
  water_saved_l_day: number;
  energy_saved_kwh_day: number;
}

export interface SimulationResponse {
  baseline: ScenarioMetrics;
  scenario: ScenarioMetrics;
  impact: ImpactMetrics;
  assumptions: string[];
}

export interface SimulationParams {
  solar_capacity: number;
  public_transport_share: number;
  green_cover: number;
  water_reduction: number;
  rainfall: number;
  drainage_capacity: number;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  trigger_reason: string;
  recommended_action: string;
  impact_estimate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface OverviewState {
  status: string;
  environment: string;
  simulated_time: string;
  tick: number;
  active_event: string;
  metrics: {
    total_buildings: number;
    energy_consumption_kw: number;
    solar_generation_kw: number;
    water_consumption_lhr: number;
    water_tank_level_l: number;
    traffic_vehicles_min: number;
    co2_emissions_kg_hr: number;
    active_alerts_count: number;
  };
  weather: {
    temperature_c: number;
    rainfall_mm: number;
    green_coverage_pct: number;
  };
}
