from typing import Dict, Any, List
from app.models.schemas import SimulationRequestSchema, SimulationResponseSchema, ScenarioMetrics, ImpactMetrics

class WhatIfSimulationEngine:
    @staticmethod
    def run_simulation(req: SimulationRequestSchema) -> SimulationResponseSchema:
        # BASELINE CONSTANTS
        base_solar_cap = 20.0
        base_pt_share = 18.0
        base_green_cover = 15.0
        base_water_red = 0.0
        base_rainfall = 10.0
        base_drainage_cap = 100.0

        base_total_elec_demand = 145.0  # kW
        base_daily_water = 18500.0      # L/day
        base_vehicles_count = 85        # vehicles/min

        # 1. BASELINE CALCULATIONS
        base_solar_gen = base_solar_cap * 0.85
        base_grid_demand = max(0.0, base_total_elec_demand - base_solar_gen)
        base_energy_co2 = base_grid_demand * 0.75 * 24.0
        base_traffic_co2 = base_vehicles_count * 0.28 * 24.0
        base_total_co2 = round(base_energy_co2 + base_traffic_co2, 1)

        base_grid_dep_pct = round((base_grid_demand / base_total_elec_demand) * 100.0, 1)

        # Baseline Flood Risk
        base_runoff = max(0.0, req.rainfall * 2.5 * (1.0 - (base_green_cover / 100.0)))
        base_eff_drainage = base_drainage_cap * 1.2
        base_flood_score = round(min(100.0, max(0.0, (base_runoff - base_eff_drainage + 25.0) * 1.4)), 1)
        base_flood_cat = WhatIfSimulationEngine._get_flood_category(base_flood_score)

        baseline_metrics = ScenarioMetrics(
            co2_kg_day=base_total_co2,
            water_l_day=round(base_daily_water, 0),
            grid_dependency_pct=base_grid_dep_pct,
            solar_generation_kw=round(base_solar_gen, 1),
            traffic_vehicles_cnt=base_vehicles_count,
            flood_risk_score=base_flood_score,
            flood_risk_category=base_flood_cat
        )

        # 2. SIMULATED SCENARIO CALCULATIONS
        sim_solar_gen = req.solar_capacity * 0.85
        sim_grid_demand = max(0.0, base_total_elec_demand - sim_solar_gen)
        sim_energy_co2 = sim_grid_demand * 0.75 * 24.0

        # Public transport share reduces personal vehicle count
        pt_delta = max(0.0, req.public_transport_share - base_pt_share)
        sim_vehicles = max(12, int(base_vehicles_count * (1.0 - (pt_delta * 0.013))))
        sim_traffic_co2 = sim_vehicles * 0.28 * 24.0
        sim_total_co2 = round(sim_energy_co2 + sim_traffic_co2, 1)

        sim_grid_dep_pct = round((sim_grid_demand / base_total_elec_demand) * 100.0, 1)

        # Water reduction
        sim_daily_water = round(base_daily_water * (1.0 - (req.water_reduction / 100.0)), 0)

        # Simulated Flood Risk with user inputs (rainfall, green cover, drainage cap)
        sim_runoff = max(0.0, req.rainfall * 2.5 * (1.0 - (req.green_cover / 100.0)))
        sim_eff_drainage = req.drainage_capacity * 1.2
        sim_flood_score = round(min(100.0, max(0.0, (sim_runoff - sim_eff_drainage + 25.0) * 1.4)), 1)
        sim_flood_cat = WhatIfSimulationEngine._get_flood_category(sim_flood_score)

        scenario_metrics = ScenarioMetrics(
            co2_kg_day=sim_total_co2,
            water_l_day=sim_daily_water,
            grid_dependency_pct=sim_grid_dep_pct,
            solar_generation_kw=round(sim_solar_gen, 1),
            traffic_vehicles_cnt=sim_vehicles,
            flood_risk_score=sim_flood_score,
            flood_risk_category=sim_flood_cat
        )

        # 3. DELTA & IMPACT CALCULATIONS
        co2_avoided = max(0.0, base_total_co2 - sim_total_co2)
        co2_red_pct = round((co2_avoided / base_total_co2 * 100.0) if base_total_co2 > 0 else 0.0, 1)

        water_saved = max(0.0, base_daily_water - sim_daily_water)
        water_saved_pct = round((water_saved / base_daily_water * 100.0) if base_daily_water > 0 else 0.0, 1)

        energy_saved_kwh = max(0.0, (base_grid_demand - sim_grid_demand) * 24.0)
        energy_saved_pct = round((energy_saved_kwh / (base_grid_demand * 24.0) * 100.0) if base_grid_demand > 0 else 0.0, 1)

        traffic_red_pct = round(((base_vehicles_count - sim_vehicles) / base_vehicles_count * 100.0) if base_vehicles_count > 0 else 0.0, 1)

        flood_change_pct = round((base_flood_score - sim_flood_score), 1)

        impact = ImpactMetrics(
            co2_reduction_percent=co2_red_pct,
            water_saved_percent=water_saved_pct,
            energy_saved_percent=energy_saved_pct,
            traffic_reduction_percent=traffic_red_pct,
            flood_risk_change_percent=flood_change_pct,
            co2_avoided_kg_day=round(co2_avoided, 1),
            water_saved_l_day=round(water_saved, 0),
            energy_saved_kwh_day=round(energy_saved_kwh, 1)
        )

        assumptions = [
            f"Solar efficiency factor: 85% peak output ({req.solar_capacity} kW capacity yields ~{round(sim_solar_gen,1)} kW peak).",
            f"Grid emission intensity: 0.75 kg CO₂ / kWh from regional mixed grid.",
            f"Public transport adoption (+{round(pt_delta,1)}%) reduces personal vehicular flow by ~{traffic_red_pct}%.",
            f"Urban green canopy cover ({req.green_cover}%) absorbs ~{round(req.green_cover * 0.4, 1)}% of heavy storm runoff.",
            f"Drainage capacity set at {req.drainage_capacity}% of nominal urban stormwater rating."
        ]

        return SimulationResponseSchema(
            baseline=baseline_metrics,
            scenario=scenario_metrics,
            impact=impact,
            assumptions=assumptions
        )

    @staticmethod
    def _get_flood_category(score: float) -> str:
        if score < 25.0:
            return "Low Risk"
        elif score < 50.0:
            return "Moderate Risk"
        elif score < 75.0:
            return "High Risk"
        else:
            return "Critical Risk"
