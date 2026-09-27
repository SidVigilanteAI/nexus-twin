import math
import random
import time
from collections import deque
from typing import Dict, Any, List

class SensorGenerator:
    def __init__(self, seed: int = 42):
        random.seed(seed)
        self.tick_counter = 0
        self.current_event = "normal"  # normal, water_leak, energy_spike, traffic_congestion, waste_overflow, heavy_rainfall
        self.event_start_tick = 0

        # Base state parameters
        self.solar_capacity_kw = 50.0  # installed
        self.green_coverage_pct = 25.0

        # Circular history buffer — last 24 ticks of summary metrics
        self._history: deque = deque(maxlen=24)
        
    def set_event(self, event_name: str):
        self.current_event = event_name
        self.event_start_tick = self.tick_counter

    def get_time_of_day_hour(self) -> float:
        # Simulate a 24-hour cycle advancing 0.25 hours per tick (~6 seconds per hour of sim)
        return (self.tick_counter * 0.25) % 24.0

    def generate_current_state(self) -> Dict[str, Any]:
        self.tick_counter += 1
        hour = self.get_time_of_day_hour()
        
        # Daylight factor (0 during night, peak at 13:00)
        daylight = max(0.0, math.sin(math.pi * max(0.0, hour - 6.0) / 12.0)) if 6.0 <= hour <= 18.0 else 0.0
        
        # Weather
        is_heavy_rain = (self.current_event == "heavy_rainfall")
        rainfall_mm = 80.0 + random.uniform(-5, 5) if is_heavy_rain else (random.uniform(0, 5) if random.random() < 0.1 else 0.0)
        temperature_c = 28.0 + 4.0 * math.sin(math.pi * (hour - 9) / 12.0) + random.uniform(-0.5, 0.5)

        # Buildings state
        # A: Academic (high electricity daytime)
        # B: Residential/Hostel (high water morning/evening)
        # C: Commercial (daytime moderate)
        # D: Community (evening moderate)
        # E: Industrial (constant high electricity)
        
        bldg_a_elec = (45.0 + 35.0 * daylight + random.uniform(-2, 2)) * (1.8 if self.current_event == "energy_spike" else 1.0)
        bldg_a_water = 180.0 + 60.0 * math.sin(hour) + random.uniform(-10, 10)
        
        is_leak = (self.current_event == "water_leak")
        bldg_b_elec = 20.0 + 10.0 * math.sin(hour / 2) + random.uniform(-1, 1)
        bldg_b_water = (450.0 + 200.0 * (1.0 if (7 <= hour <= 9 or 19 <= hour <= 21) else 0.3) + random.uniform(-20, 20)) + (650.0 if is_leak else 0.0)
        
        bldg_c_elec = 30.0 + 25.0 * daylight + random.uniform(-2, 2)
        bldg_c_water = 150.0 + 50.0 * daylight + random.uniform(-10, 10)

        bldg_d_elec = 15.0 + 20.0 * (1.0 if 16 <= hour <= 22 else 0.2) + random.uniform(-1, 1)
        bldg_d_water = 120.0 + 40.0 * (1.0 if 16 <= hour <= 22 else 0.2) + random.uniform(-5, 5)

        bldg_e_elec = (55.0 + 15.0 * daylight + random.uniform(-3, 3)) * (1.5 if self.current_event == "energy_spike" else 1.0)
        bldg_e_water = 220.0 + 30.0 * daylight + random.uniform(-10, 10)

        buildings = [
            {
                "id": "bldg-a",
                "name": "Building A (Academic & Admin)",
                "category": "Academic",
                "occupancy": int(320 + 250 * daylight + random.randint(-10, 10)),
                "electricity_kw": round(bldg_a_elec, 2),
                "water_lhr": round(bldg_a_water, 2),
                "co2_kg": round(bldg_a_elec * 0.45, 2),
                "anomaly_status": "Warning" if self.current_event == "energy_spike" else "Normal",
                "description": "High daytime academic load with solar array integration."
            },
            {
                "id": "bldg-b",
                "name": "Building B (Hostel & Residential)",
                "category": "Residential",
                "occupancy": int(480 + random.randint(-5, 5)),
                "electricity_kw": round(bldg_b_elec, 2),
                "water_lhr": round(bldg_b_water, 2),
                "co2_kg": round(bldg_b_elec * 0.45, 2),
                "anomaly_status": "Critical" if is_leak else "Normal",
                "description": "High residential water consumption. Pipeline P-04 connection."
            },
            {
                "id": "bldg-c",
                "name": "Building C (Commercial Hub)",
                "category": "Commercial",
                "occupancy": int(150 + 180 * daylight + random.randint(-10, 10)),
                "electricity_kw": round(bldg_c_elec, 2),
                "water_lhr": round(bldg_c_water, 2),
                "co2_kg": round(bldg_c_elec * 0.45, 2),
                "anomaly_status": "Normal",
                "description": "Retail and dining complex with smart waste segregation."
            },
            {
                "id": "bldg-d",
                "name": "Building D (Community Center)",
                "category": "Community",
                "occupancy": int(90 + 110 * (1.0 if 16 <= hour <= 22 else 0.2) + random.randint(-5, 5)),
                "electricity_kw": round(bldg_d_elec, 2),
                "water_lhr": round(bldg_d_water, 2),
                "co2_kg": round(bldg_d_elec * 0.45, 2),
                "anomaly_status": "Normal",
                "description": "Multipurpose community hall and rainwater catchment point."
            },
            {
                "id": "bldg-e",
                "name": "Building E (Service & Innovation Lab)",
                "category": "Industrial/Service",
                "occupancy": int(85 + random.randint(-5, 5)),
                "electricity_kw": round(bldg_e_elec, 2),
                "water_lhr": round(bldg_e_water, 2),
                "co2_kg": round(bldg_e_elec * 0.45, 2),
                "anomaly_status": "Warning" if self.current_event == "energy_spike" else "Normal",
                "description": "Heavy equipment lab and central HVAC pump node."
            }
        ]

        total_building_water = sum(b["water_lhr"] for b in buildings)
        total_building_elec = sum(b["electricity_kw"] for b in buildings)

        # Water System
        inflow_lhr = 1150.0 + random.uniform(-30, 30)
        outflow_lhr = total_building_water + (650.0 if is_leak else 0.0)
        pressure_psi = (35.0 if is_leak else 52.0) + random.uniform(-2, 2)
        leak_prob = round(0.88 if is_leak else 0.04 + random.uniform(0, 0.03), 2)
        tank_level_l = max(500.0, min(15000.0, 10500.0 + (inflow_lhr - outflow_lhr) * 0.5))

        water_system = {
            "tank_level_l": round(tank_level_l, 1),
            "tank_capacity_l": 15000.0,
            "inflow_lhr": round(inflow_lhr, 1),
            "outflow_lhr": round(outflow_lhr, 1),
            "pressure_psi": round(pressure_psi, 1),
            "leak_prob": leak_prob,
            "affected_zone": "Hostel / Zone B (Pipeline P-04)" if is_leak else "None",
            "anomaly_status": "Critical" if is_leak else "Normal",
            "estimated_daily_loss_l": round(650.0 * 24, 0) if is_leak else 0.0
        }

        # Energy System
        solar_gen_kw = (self.solar_capacity_kw * daylight * 0.85) + random.uniform(-1, 1)
        solar_gen_kw = max(0.0, solar_gen_kw)
        grid_demand_kw = max(0.0, total_building_elec - solar_gen_kw)
        solar_contrib = (solar_gen_kw / total_building_elec * 100.0) if total_building_elec > 0 else 0.0
        grid_dep = (grid_demand_kw / total_building_elec * 100.0) if total_building_elec > 0 else 0.0

        energy_system = {
            "solar_gen_kw": round(solar_gen_kw, 2),
            "solar_cap_kw": self.solar_capacity_kw,
            "grid_demand_kw": round(grid_demand_kw, 2),
            "total_consumption_kw": round(total_building_elec, 2),
            "solar_contribution_pct": round(solar_contrib, 1),
            "grid_dependency_pct": round(grid_dep, 1),
            "co2_emissions_kg_hr": round(grid_demand_kw * 0.75, 2),
            "estimated_hourly_cost_usd": round(grid_demand_kw * 0.15, 2)
        }

        # Traffic System
        is_congestion = (self.current_event == "traffic_congestion")
        traffic_multiplier = 2.2 if is_congestion else (1.6 if (8 <= hour <= 10 or 17 <= hour <= 19) else 1.0)
        base_vehicles = int((45 + 30 * math.sin(hour / 3) + random.randint(-5, 5)) * traffic_multiplier)
        base_vehicles = max(10, base_vehicles)

        avg_speed = 14.0 if is_congestion else (28.0 if traffic_multiplier > 1.2 else 45.0 + random.uniform(-3, 3))
        
        traffic_system = {
            "total_vehicles": base_vehicles,
            "avg_speed_kmh": round(avg_speed, 1),
            "cars_cnt": int(base_vehicles * 0.55),
            "buses_cnt": int(base_vehicles * 0.12),
            "evs_cnt": int(base_vehicles * 0.18),
            "two_wheelers_cnt": int(base_vehicles * 0.15),
            "congestion_level": "Critical" if is_congestion else ("Moderate" if traffic_multiplier > 1.2 else "Low"),
            "estimated_emissions_kg_hr": round(base_vehicles * 0.28, 2),
            "public_transport_share_pct": 18.0
        }

        # Waste System
        is_waste_overflow = (self.current_event == "waste_overflow")
        bins = [
            {"bin_id": "B-01", "location": "Academic Plaza", "fill_pct": round(min(100, 42.0 + (self.tick_counter % 30)), 1), "waste_type": "Paper & Plastic", "predicted_overflow_hrs": 6.5, "collection_priority": "Low"},
            {"bin_id": "B-02", "location": "Hostel Zone B", "fill_pct": round(min(100, 58.0 + (self.tick_counter % 25)), 1), "waste_type": "Organic", "predicted_overflow_hrs": 4.2, "collection_priority": "Medium"},
            {"bin_id": "B-03", "location": "Commercial Street", "fill_pct": round(min(100, 64.0 + (self.tick_counter % 20)), 1), "waste_type": "Packaging & Metal", "predicted_overflow_hrs": 3.8, "collection_priority": "Medium"},
            {"bin_id": "B-04", "location": "Community Park East", "fill_pct": 94.0 if is_waste_overflow else round(min(100, 78.0 + (self.tick_counter % 15)), 1), "waste_type": "Organic & Mixed", "predicted_overflow_hrs": 0.5 if is_waste_overflow else 1.8, "collection_priority": "Critical" if is_waste_overflow else "High"},
            {"bin_id": "B-05", "location": "Innovation Hub West", "fill_pct": round(min(100, 35.0 + (self.tick_counter % 40)), 1), "waste_type": "E-waste & Plastic", "predicted_overflow_hrs": 8.0, "collection_priority": "Low"},
        ]

        # Active Alerts
        alerts = []
        if is_leak:
            alerts.append({
                "id": f"alt-{self.tick_counter}-1",
                "timestamp": f"{int(hour):02d}:{int((hour%1)*60):02d}",
                "title": "🚨 Possible Water Leakage Detected",
                "description": "Pipeline P-04 (Hostel Zone B) experiencing abnormal flow rate spike.",
                "severity": "Critical",
                "system_zone": "Zone B Hostel",
                "expected_value": "1,020 L/hr",
                "observed_value": f"{round(bldg_b_water,0)} L/hr",
                "confidence_score": 0.94
            })
        if self.current_event == "energy_spike":
            alerts.append({
                "id": f"alt-{self.tick_counter}-2",
                "timestamp": f"{int(hour):02d}:{int((hour%1)*60):02d}",
                "title": "⚡ Unexpected Energy Consumption Spike",
                "description": "Buildings A and E registering +45% load above diurnal baseline.",
                "severity": "Warning",
                "system_zone": "Zone A & E",
                "expected_value": "100 kW",
                "observed_value": f"{round(bldg_a_elec + bldg_e_elec, 0)} kW",
                "confidence_score": 0.89
            })
        if is_congestion:
            alerts.append({
                "id": f"alt-{self.tick_counter}-3",
                "timestamp": f"{int(hour):02d}:{int((hour%1)*60):02d}",
                "title": "🚗 Arterial Road Congestion Bottleneck",
                "description": "Vehicle speed dropped to 14 km/h with 140+ vehicles queueing on Road R-01.",
                "severity": "Warning",
                "system_zone": "Road R-01",
                "expected_value": "45 km/h",
                "observed_value": "14 km/h",
                "confidence_score": 0.91
            })
        if is_waste_overflow:
            alerts.append({
                "id": f"alt-{self.tick_counter}-4",
                "timestamp": f"{int(hour):02d}:{int((hour%1)*60):02d}",
                "title": "🗑️ Waste Bin Overflow Imminent",
                "description": "Bin B-04 (Community Park East) at 94% capacity. Overflow expected within 30 min.",
                "severity": "High",
                "system_zone": "Park East",
                "expected_value": "< 75%",
                "observed_value": "94%",
                "confidence_score": 0.96
            })
        if is_heavy_rain:
            alerts.append({
                "id": f"alt-{self.tick_counter}-5",
                "timestamp": f"{int(hour):02d}:{int((hour%1)*60):02d}",
                "title": "🌧️ Extreme Rainfall & Flood Risk Warning",
                "description": "Precipitation level 80mm/h exceeding baseline storm drainage capacity.",
                "severity": "Critical",
                "system_zone": "Drainage Channel D-02",
                "expected_value": "< 20 mm/h",
                "observed_value": "80 mm/h",
                "confidence_score": 0.98
            })

        state = {
            "tick": self.tick_counter,
            "simulated_time": f"{int(hour):02d}:{int((hour%1)*60):02d}",
            "current_event": self.current_event,
            "weather": {
                "temperature_c": round(temperature_c, 1),
                "rainfall_mm": round(rainfall_mm, 1),
                "green_coverage_pct": self.green_coverage_pct
            },
            "buildings": buildings,
            "water": water_system,
            "energy": energy_system,
            "traffic": traffic_system,
            "waste_bins": bins,
            "alerts": alerts
        }

        # Store compact summary in history buffer
        self._history.append({
            "time": state["simulated_time"],
            "tick": self.tick_counter,
            "energy_kw": energy_system["total_consumption_kw"],
            "solar_kw": energy_system["solar_gen_kw"],
            "grid_kw": energy_system["grid_demand_kw"],
            "co2_kg_hr": energy_system["co2_emissions_kg_hr"],
            "water_outflow_lhr": water_system["outflow_lhr"],
            "water_pressure_psi": water_system["pressure_psi"],
            "water_tank_l": water_system["tank_level_l"],
            "traffic_vehicles": traffic_system["total_vehicles"],
            "traffic_speed_kmh": traffic_system["avg_speed_kmh"],
            "temperature_c": round(temperature_c, 1),
            "rainfall_mm": round(rainfall_mm, 1),
            "event": self.current_event,
        })

        return state

    def get_history(self) -> List[Dict[str, Any]]:
        return list(self._history)

# Global singleton instance
sensor_generator_instance = SensorGenerator()
