from typing import Dict, Any, List

class AIRecommendationOptimizer:
    @staticmethod
    def generate_recommendations(current_state: Dict[str, Any], anomalies: List[Dict[str, Any]], predictions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        recommendations = []

        # 1. Anomaly-based recommendations
        for idx, anomaly in enumerate(anomalies):
            if "Leakage" in anomaly["type"]:
                recommendations.append({
                    "id": f"rec-anom-{idx}",
                    "category": "Water Conservation",
                    "title": "Dispatch Emergency Inspection for Pipeline P-04",
                    "trigger_reason": f"Detected abnormal flow spike of {anomaly['observed']} (excess ~{anomaly['excess']}) with high leakage probability.",
                    "recommended_action": "Isolate pipeline segment P-04 and route auxiliary supply through Bypass Valve B-2. Schedule maintenance crew.",
                    "impact_estimate": "Prevents estimated daily water loss of ~15,600 L/day and restores system pressure to 52 PSI.",
                    "priority": "Critical"
                })
            elif "Energy" in anomaly["type"]:
                recommendations.append({
                    "id": f"rec-anom-{idx}",
                    "category": "Clean Energy & Grid",
                    "title": "Activate Demand Response & Peak Shaving in Zone A/E",
                    "trigger_reason": f"Unscheduled peak demand spike of {anomaly['observed']} detected across Academic & Service buildings.",
                    "recommended_action": "Stagger non-essential HVAC cooling cycles by 15 mins and ramp up battery storage output by 25 kW.",
                    "impact_estimate": "Reduces peak grid draw by ~35 kW and lowers carbon emissions by ~26.2 kg CO₂/hr.",
                    "priority": "High"
                })
            elif "Traffic" in anomaly["type"]:
                recommendations.append({
                    "id": f"rec-anom-{idx}",
                    "category": "Sustainable Mobility",
                    "title": "Dynamic Traffic Signal Timing Adjustment",
                    "trigger_reason": f"Severe queueing congestion ({anomaly['observed']}) along Road R-01 bottleneck.",
                    "recommended_action": "Increase green light signal duration by 20s at Intersection I-01 and notify smart bus shuttles to reroute via Bypass R-02.",
                    "impact_estimate": "Restores average traffic speed from 14 km/h to 32 km/h and cuts idle emissions by 18%.",
                    "priority": "High"
                })
            elif "Waste" in anomaly["type"]:
                recommendations.append({
                    "id": f"rec-anom-{idx}",
                    "category": "Waste Management",
                    "title": "Prioritize Smart Waste Collection for Bin B-04",
                    "trigger_reason": f"Bin B-04 in Park East reached {anomaly['observed']} fill capacity.",
                    "recommended_action": "Dispatch automated electric waste collector vehicle along Route W-3 immediately.",
                    "impact_estimate": "Prevents overflow spill into green zone and optimizes collection route fuel usage by 22%.",
                    "priority": "High"
                })

        # 2. Prediction-based recommendations
        for pred in predictions:
            if pred["metric_name"].startswith("Grid Energy Demand") and pred["risk_level"] in ["High", "Moderate"] and not any(r["category"] == "Clean Energy & Grid" for r in recommendations):
                recommendations.append({
                    "id": "rec-pred-1",
                    "category": "Clean Energy & Grid",
                    "title": "Pre-Cool Facilities Before Predicted Peak Load",
                    "trigger_reason": f"Predictive model forecasts energy demand ramping to {pred['predicted_value']} kW in next 3 hours.",
                    "recommended_action": "Initiate thermal energy storage pre-cooling at 11:30 and maximize rooftop solar array tilt angle.",
                    "impact_estimate": "Shifts ~40 kWh of demand away from peak tariff hours and saves ~$6.00/hr.",
                    "priority": "Medium"
                })
            if pred["metric_name"].startswith("Water Outflow") and pred["risk_level"] in ["High"] and not any(r["category"] == "Water Conservation" for r in recommendations):
                recommendations.append({
                    "id": "rec-pred-2",
                    "category": "Water Conservation",
                    "title": "Pre-Fill Main Storage Tank & Adjust Inflow Control",
                    "trigger_reason": f"Forecasted water demand surge to {pred['predicted_value']} L/hr in next 3 hours.",
                    "recommended_action": "Increase main booster pump inflow by 200 L/hr during off-peak window.",
                    "impact_estimate": "Maintains minimum 60% tank reserve buffer through peak consumption hours.",
                    "priority": "Medium"
                })

        # 3. Baseline / Proactive recommendations if empty
        if not recommendations:
            recommendations.append({
                "id": "rec-std-1",
                "category": "Clean Energy",
                "title": "Expand Rooftop Solar Capacity on Building B",
                "trigger_reason": "Building B currently relies 82% on the central grid with high solar potential roof area.",
                "recommended_action": "Install additional 30 kW solar PV array on Hostel B rooftop.",
                "impact_estimate": "Will increase overall city clean energy share by +14% and avoid ~45 kg CO₂/day.",
                "priority": "Low"
            })
            recommendations.append({
                "id": "rec-std-2",
                "category": "Sustainable Mobility",
                "title": "Expand Micro-EV Transit Fleet Share",
                "trigger_reason": "Current EV vehicle share is 18% of total traffic stream.",
                "recommended_action": "Add 5 micro-EV shuttle stops near Commercial Building C and Hostel B.",
                "impact_estimate": "Reduces urban transit emissions by 12% and improves air quality index by 8 points.",
                "priority": "Low"
            })

        return recommendations
