from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from app.simulation.sensor_generator import sensor_generator_instance
from app.ml.anomaly import anomaly_detector_instance
from app.ml.prediction import prediction_engine_instance
from app.simulation.what_if_engine import WhatIfSimulationEngine
from app.ml.optimizer import AIRecommendationOptimizer
from app.models.schemas import (
    BuildingSchema, SensorReadingSchema, WaterSystemSchema, EnergySystemSchema,
    TrafficSystemSchema, WasteBinSchema, AlertSchema, PredictionSchema,
    SimulationRequestSchema, SimulationResponseSchema, TriggerEventSchema,
    RecommendationSchema, MLEvaluationSchema
)

router = APIRouter(prefix="/api")

@router.get("/overview")
def get_overview():
    state = sensor_generator_instance.generate_current_state()
    anomalies = anomaly_detector_instance.analyze_current_state(state)
    predictions = prediction_engine_instance.predict_future_metrics(state)
    
    return {
        "status": "Online",
        "environment": "Simulated Urban Environment (Nexus Twin)",
        "simulated_time": state["simulated_time"],
        "tick": state["tick"],
        "active_event": state["current_event"],
        "metrics": {
            "total_buildings": len(state["buildings"]),
            "energy_consumption_kw": state["energy"]["total_consumption_kw"],
            "solar_generation_kw": state["energy"]["solar_gen_kw"],
            "water_consumption_lhr": state["water"]["outflow_lhr"],
            "water_tank_level_l": state["water"]["tank_level_l"],
            "traffic_vehicles_min": state["traffic"]["total_vehicles"],
            "co2_emissions_kg_hr": state["energy"]["co2_emissions_kg_hr"],
            "active_alerts_count": len(state["alerts"]) + len(anomalies)
        },
        "weather": state["weather"]
    }

@router.get("/buildings", response_model=List[BuildingSchema])
def get_buildings():
    state = sensor_generator_instance.generate_current_state()
    return state["buildings"]

@router.get("/buildings/{building_id}", response_model=BuildingSchema)
def get_building_by_id(building_id: str):
    state = sensor_generator_instance.generate_current_state()
    for b in state["buildings"]:
        if b["id"] == building_id:
            return b
    raise HTTPException(status_code=404, detail="Building not found")

@router.get("/sensors/live")
def get_live_sensors():
    state = sensor_generator_instance.generate_current_state()
    anomalies = anomaly_detector_instance.analyze_current_state(state)
    return {
        "timestamp": state["simulated_time"],
        "state": state,
        "anomalies": anomalies
    }

@router.post("/events/trigger")
def trigger_event(evt: TriggerEventSchema):
    valid_events = ["normal", "water_leak", "energy_spike", "traffic_congestion", "waste_overflow", "heavy_rainfall"]
    if evt.event_name not in valid_events:
        raise HTTPException(status_code=400, detail=f"Invalid event name. Allowed: {valid_events}")
    
    sensor_generator_instance.set_event(evt.event_name)
    return {
        "status": "Success",
        "message": f"Event mode changed to '{evt.event_name}'",
        "active_event": evt.event_name
    }

@router.get("/water", response_model=WaterSystemSchema)
def get_water_system():
    state = sensor_generator_instance.generate_current_state()
    return state["water"]

@router.get("/energy", response_model=EnergySystemSchema)
def get_energy_system():
    state = sensor_generator_instance.generate_current_state()
    return state["energy"]

@router.get("/traffic", response_model=TrafficSystemSchema)
def get_traffic_system():
    state = sensor_generator_instance.generate_current_state()
    return state["traffic"]

@router.get("/waste", response_model=List[WasteBinSchema])
def get_waste_system():
    state = sensor_generator_instance.generate_current_state()
    return state["waste_bins"]

@router.get("/alerts")
def get_alerts():
    state = sensor_generator_instance.generate_current_state()
    anomalies = anomaly_detector_instance.analyze_current_state(state)
    return {
        "simulated_alerts": state["alerts"],
        "ai_detected_anomalies": anomalies
    }

@router.get("/predictions", response_model=List[PredictionSchema])
def get_predictions():
    state = sensor_generator_instance.generate_current_state()
    return prediction_engine_instance.predict_future_metrics(state)

@router.post("/simulation", response_model=SimulationResponseSchema)
def run_what_if_simulation(req: SimulationRequestSchema):
    return WhatIfSimulationEngine.run_simulation(req)

@router.post("/simulation/reset", response_model=SimulationResponseSchema)
def reset_simulation():
    default_req = SimulationRequestSchema()
    return WhatIfSimulationEngine.run_simulation(default_req)

@router.get("/recommendations")
def get_recommendations():
    state = sensor_generator_instance.generate_current_state()
    anomalies = anomaly_detector_instance.analyze_current_state(state)
    predictions = prediction_engine_instance.predict_future_metrics(state)
    return AIRecommendationOptimizer.generate_recommendations(state, anomalies, predictions)

@router.get("/impact")
def get_impact_summary():
    # Moderately challenging scenario (60 mm rain) to showcase all 5 impact dimensions
    default_req = SimulationRequestSchema(
        solar_capacity=50, public_transport_share=35,
        green_cover=30, water_reduction=15,
        rainfall=60, drainage_capacity=100
    )
    return WhatIfSimulationEngine.run_simulation(default_req)

@router.get("/ml-eval", response_model=List[MLEvaluationSchema])
def get_ml_evaluation():
    return [
        MLEvaluationSchema(
            model_name="Environmental Anomaly Detector",
            algorithm="Isolation Forest (scikit-learn)",
            training_samples=anomaly_detector_instance.training_sample_count,
            features_used=anomaly_detector_instance.features_used,
            metrics=anomaly_detector_instance.metrics_eval,
            status="Active & Trained"
        ),
        MLEvaluationSchema(
            model_name="Multi-Domain Forecast Engine",
            algorithm="Random Forest Regressor (scikit-learn)",
            training_samples=prediction_engine_instance.training_sample_count,
            features_used=["simulated_hour", "sin_diurnal", "cos_diurnal"],
            metrics=prediction_engine_instance.eval_metrics,
            status="Active & Trained"
        )
    ]

@router.get("/history")
def get_sensor_history():
    """Returns up to 24 recent sensor summary snapshots for time-series charts."""
    return sensor_generator_instance.get_history()

@router.get("/assumptions")
def get_assumptions():
    return {
        "disclaimer": "SIMULATION RESULTS — NOT REAL-WORLD MEASUREMENTS",
        "environment_type": "Simulated Urban Environment (Generic 5-Building Prototype)",
        "assumptions": [
            "Sensor readings are synthesized via baseline diurnal curves with stochastic noise.",
            "CO₂ emissions are estimated using standard grid emission factor of 0.75 kg CO₂ / kWh.",
            "Water leakage detection threshold uses 3-sigma deviation from baseline operational curves.",
            "Flood risk simulation models storm runoff absorption relative to percentage green canopy cover.",
            "Public transport conversion assumes linear reduction in private vehicle flow."
        ]
    }
