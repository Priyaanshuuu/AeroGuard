import time 
import random
import requests
from pydantic import BaseModel

API_URL = "http://127.0.0.1:8000/api"
CENTER_LAT = 26.1209
CENTER_LON = 85.3647

UNITS = [
    {"id": "AMB-001", "type": "AMBULANCE"},
    {"id": "AMB-002", "type": "AMBULANCE"},
    {"id": "FIRE-001", "type": "FIRE_TRUCK"},
    {"id": "DRONE-X", "type": "DRONE"},
]

class LocationUpdate(BaseModel):
    latitude : float
    longitude: float
    status : str = "AVAILABLE"

def create_initial_units():
    print("Initializing Fleet...")
    for unit in UNITS:
        lat = CENTER_LAT + random.uniform(-0.01 , 0.01)
        lon = CENTER_LON + random.uniform(-0.01 , 0.01)

        payload = {
            "unit_id" : unit['id'],
            "unit_type" : unit["type"],
            "latitude" : lat,
            "longitude" : lon,
        }

        try:
            requests.post(f"{API_URL}/units" , json = payload)
        except Exception as e:
            print(f"Error creating unit {unit['id']} : {e}")
    print("Fleet Ready!!")


def simulate_movement():
    print("Starting simulation process")
    current_positions = {}
    for unit in UNITS:
        current_positions[unit["id"]] = {
            "lat": CENTER_LAT + random.uniform(-0.01 , 0.01),
            "lon" : CENTER_LON + random.uniform(-0.01 , 0.01)
        }
    while True:
        for unit in UNITS:
            unit_id = unit["id"]
            move_lat = random.uniform(-0.0005 , 0.0005)
            move_lon = random.uniform(-0.0005 , 0.0005)

            current_positions[unit_id]["lat"] += move_lat
            current_positions[unit_id]["lon"] += move_lon

            try:
                data = LocationUpdate(
                    latitude = current_positions[unit_id]["lat"],
                    longitude = current_positions[unit_id]["lon"],
                    status="AVAILABLE"
                )
            except Exception as e:
                print(f"Data Validation Failed : {e}")
                continue

            try:
                response = requests.patch(
                    f"{API_URL}/units/{unit_id}/location",
                    json=data.dict()
                )
                if response.status_code == 200:
                    print(f"{unit_id} moved to the respective location ")
                else:
                    print(f"Failed to update {unit_id} location")
            except requests.exceptions.ConnectionError:
             print(f"Connection Error!! Is django server running?")

        time.sleep(2)
        
if __name__ == '__main__':
    create_initial_units()
    simulate_movement()
    


