"""Quick smoke test of all major API endpoints."""

from datetime import datetime, timedelta, timezone

from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# Register
resp = client.post("/api/v1/auth/register", json={
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "full_name": "Test User",
})
print("Register:", resp.status_code, resp.json())

# Login
resp = client.post("/api/v1/auth/login", data={"username": "testuser", "password": "testpass123"})
print("Login:", resp.status_code, resp.json())
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Get me
resp = client.get("/api/v1/users/me", headers=headers)
print("Me:", resp.status_code, resp.json())

# Create a dog
resp = client.post("/api/v1/dogs/", json={
    "name": "Buddy", "breed": "Golden Retriever", "size": "large", "good_with_others": True,
}, headers=headers)
print("Create dog:", resp.status_code, resp.json())

# Create a park
resp = client.post("/api/v1/parks/", json={
    "name": "Central Bark", "address": "123 Park Ave", "description": "A great dog park",
}, headers=headers)
print("Create park:", resp.status_code, resp.json())

# Create a visit
start = (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
end = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
resp = client.post("/api/v1/visits/", json={
    "park_id": 1, "start_time": start, "end_time": end, "dog_ids": [1], "notes": "Play time!",
}, headers=headers)
print("Create visit:", resp.status_code, resp.json())

# Dashboard stats
resp = client.get("/api/v1/visits/dashboard-stats", headers=headers)
print("Dashboard:", resp.status_code, resp.json())

print("\nAll smoke tests passed!")
