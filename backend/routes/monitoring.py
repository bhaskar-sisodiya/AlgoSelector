import psutil
import time
import os
from fastapi import APIRouter
from datetime import datetime

router = APIRouter(
    prefix="/system",
    tags=["System Monitoring"]
)

# Start time of the server (approximate)
START_TIME = time.time()

# Mock logs for demonstration if no real logs exist yet
MOCK_LOGS = [
    {"timestamp": datetime.now().strftime("%H:%M:%S"), "action": "System Startup", "status": "Success"},
    {"timestamp": datetime.now().strftime("%H:%M:%S"), "action": "Database Connection", "status": "Success"},
]

@router.get("/stats")
def get_system_stats():
    """Returns real-time system usage and app metrics."""
    
    # System Metrics
    cpu_percent = psutil.cpu_percent(interval=None)
    ram = psutil.virtual_memory()
    ram_percent = ram.percent
    
    # Uptime
    uptime_seconds = int(time.time() - START_TIME)
    uptime_str = f"{uptime_seconds // 3600}h {(uptime_seconds % 3600) // 60}m"
    
    return {
        "cpu_usage": cpu_percent,
        "ram_usage": ram_percent,
        "uptime": uptime_str,
        "active_models": 3, # Mock for now
        "total_requests": 142 + int(uptime_seconds / 10), # Simulated increase
        "status": "Healthy"
    }

@router.get("/logs")
def get_system_logs():
    """Returns recent system logs."""
    # In a real app, you'd read from a log file or DB.
    # We'll just return the mock logs + some simulated recent activity
    
    current_time = datetime.now().strftime("%H:%M:%S")
    
    # Add a random simulated log occasionally
    if int(time.time()) % 10 == 0:
         MOCK_LOGS.insert(0, {"timestamp": current_time, "action": "Heartbeat Check", "status": "Success"})
         
    return MOCK_LOGS[:20] # Return last 20 logs
