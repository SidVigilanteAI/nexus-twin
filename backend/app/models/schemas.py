from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class BuildingSchema(BaseModel):
    id: str
    name: str
    category: str
    occupancy: int
    electricity_kw: float
    water_lhr: float
    co2_kg: float
    anomaly_status: str
    description: str

class SensorReadingSchema(BaseModel):
    sensor_id: str
    name: str
    type: str
    location: str
    unit: str
    value: float
    is_anomaly: bool
    confidence: float
    timestamp: str

class WaterSystemSchema(BaseModel):
    tank_level_l: float
    tank_capacity_l: float
    inflow_lhr: float
    outflow_lhr: float
    pressure_psi: float
    leak_prob: float
    affected_zone: str
    anomaly_status: str
    estimated_daily_loss_l: float

class EnergySystemSchema(BaseModel):
    solar_gen_kw: float
    solar_cap_kw: float
    grid_demand_kw: float
    total_consumption_kw: float
    solar_contribution_pct: float
    grid_dependency_pct: float
    co2_emissions_kg_hr: float
    estimated_hourly_cost_usd: float

class TrafficSystemSchema(BaseModel):
    total_vehicles: int
    avg_speed_kmh: float
    cars_cnt: int
    buses_cnt: int
    evs_cnt: int
    two_wheelers_cnt: int
    congestion_level: str
    estimated_emissions_kg_hr: float
    public_transport_share_pct: float

class WasteBinSchema(BaseModel):
    bin_id: str
    location: str
    fill_pct: float
    waste_type: str
    predicted_overflow_hrs: float
    collection_priority: str

class AlertSchema(BaseModel):
    id: str
    timestamp: str
    title: str
    description: str
    severity: str  # Normal, Warning, Critical
    system_zone: str
    expected_value: str
    observed_value: str
    confidence_score: float

class PredictionSchema(BaseModel):
    metric_name: str
    target_hours: int
    current_value: float
    predicted_value: float
    unit: str
    risk_level: str
    mae: float

class SimulationRequestSchema(BaseModel):
    solar_capacity: float = Field(20.0, ge=0, le=200)
    public_transport_share: float = Field(18.0, ge=0, le=100)
    green_cover: float = Field(15.0, ge=0, le=100)
    water_reduction: float = Field(0.0, ge=0, le=100)
    rainfall: float = Field(10.0, ge=0, le=300)
    drainage_capacity: float = Field(100.0, ge=10, le=300)

class ScenarioMetrics(BaseModel):
    co2_kg_day: float
    water_l_day: float
    grid_dependency_pct: float
    solar_generation_kw: float
    traffic_vehicles_cnt: int
    flood_risk_score: float
    flood_risk_category: str

class ImpactMetrics(BaseModel):
    co2_reduction_percent: float
    water_saved_percent: float
    energy_saved_percent: float
    traffic_reduction_percent: float
    flood_risk_change_percent: float
    co2_avoided_kg_day: float
    water_saved_l_day: float
    energy_saved_kwh_day: float

class SimulationResponseSchema(BaseModel):
    baseline: ScenarioMetrics
    scenario: ScenarioMetrics
    impact: ImpactMetrics
    assumptions: List[str]

class TriggerEventSchema(BaseModel):
    event_name: str # 'normal', 'water_leak', 'energy_spike', 'traffic_congestion', 'waste_overflow', 'heavy_rainfall'

class RecommendationSchema(BaseModel):
    id: str
    category: str
    title: str
    trigger_reason: str
    recommended_action: str
    impact_estimate: str
    priority: str

class MLEvaluationSchema(BaseModel):
    model_name: str
    algorithm: str
    training_samples: int
    features_used: List[str]
    metrics: Dict[str, float]
    status: str
