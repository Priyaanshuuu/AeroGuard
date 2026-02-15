🚨 AeroGuard: Real-Time Emergency Response Command Center

AeroGuard is a high-performance, event-driven fleet tracking and emergency dispatch system. It simulates a live 911/112 command center, allowing dispatchers to monitor emergency vehicles (Ambulances, Fire Trucks, Drones) in real-time and instantly route them to incidents using spatial algorithms.



## ✨ Key Features

* **📡 Live Fleet Tracking (WebSockets):** Vehicles broadcast their GPS coordinates in real-time. The map updates seamlessly at high frequencies without standard HTTP polling or page refreshes.
* **🧠 Smart Dispatcher (Spatial Routing):** Clicking the map allows dispatchers to select an emergency type (Medical, Fire, Recon). The backend uses the Haversine formula to query the database, calculate the exact distance to all available units, and automatically dispatch the closest relevant vehicle.
* **📴 Offline Resilience (Cache-First):** Built with a robust offline fallback strategy. The Next.js frontend constantly caches WebSocket location payloads into the browser's IndexedDB. If the server connection drops, the UI instantly retrieves the last known state, preventing the command center from going blind.
* **📊 Live Dashboard Analytics:** Fleet statistics (Total Units, Available, Dispatched) are derived directly from the live WebSocket state, ensuring zero latency between vehicle movement and dashboard updates.

## 🛠️ Tech Stack & Architecture

**Backend (The Brain & Megaphone):**
* **Django & Django Ninja:** Provides a robust, type-safe API for handling vehicle registration and complex spatial mathematics.
* **PostgreSQL:** Acts as the primary database for historical logging and unit state persistence.
* **Redis & Django Channels:** Replaces the standard request-response cycle. Redis acts as a high-speed pub/sub message broker to handle high-frequency WebSocket broadcasts to the client.

**Frontend (The Glass):**
* **Next.js & React:** Powers the interactive command center UI.
* **Leaflet (react-leaflet):** Renders the interactive map and handles precise coordinate tracking.
* **IndexedDB:** Provides local, client-side storage for the offline fallback mechanism.

## ⚙️ System Workflow

1. **Data Generation:** A Python simulation script acts as GPS hardware, constantly calculating new coordinates and hitting the Django API.
2. **State Management:** Django logs the data in PostgreSQL and instantly pushes it to Redis.
3. **Real-Time Broadcast:** Django Channels picks up the Redis message and pushes it down an open WebSocket connection to the Next.js frontend.
4. **UI Paint:** React processes the payload, updates the dashboard state, and Leaflet glides the vehicle icons across the map.

## 🚀 Local Setup & Installation

**Prerequisites:** Python 3.x, Node.js, and Redis server running locally.

### 1. Backend Setup
```bash
# Clone the repository
git clone [https://github.com/Priyaanshuuu/AeroGuard.git](https://github.com/Priyaanshuuu/AeroGuard.git)
cd AeroGuard/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start the Daphne server
python manage.py migrate
python manage.py runserver
2. Frontend Setup
Bash
# Open a new terminal and navigate to the frontend directory
cd AeroGuard/frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
3. Start the Simulation
Bash
# Open a third terminal, activate the backend venv
cd AeroGuard/backend
python simulation/traffic_gen.py
🔮 Future Scope
Two-Way Communication: Allow dispatched units to send status updates and route confirmations back to the dashboard.

Traffic-Aware Routing: Integrate live traffic data APIs (like Google Maps or Mapbox) to transition from straight-line Haversine routing to actual street-level ETAs.
