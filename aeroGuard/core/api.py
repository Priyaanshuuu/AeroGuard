from ninja import NinjaAPI
from ninja import Schema
from typing import List
from django.shortcuts import get_list_or_404
from .models import EmergencyUnit , Incident
from .schema import (
    EmegencyUnitResponseSchema,
    EmerrgencyUnitCreateSchema,
    LocationUpdateSchema,
    IncidentCreateSchema,
    IncidentResponseSchema
)

api = NinjaAPI(title="AeroGuard API" , version='1.0.0')

@api.post("/units" , response=EmegencyUnitResponseSchema)
def create_units(request , payload: EmerrgencyUnitCreateSchema):
    unit = EmergencyUnit.objects.create(**payload.dict())
    return {
        "id": unit.id,
        "unit_id": unit.unit_id,
        "unit_type": unit.unit_type,
        "status": unit.status,
        "latitude": float(unit.latitude) if unit.latitude else 0.0,
        "longitude": float(unit.longitude) if unit.longitude else 0.0,
        "updated_at": unit.updated_at,
    }

@api.get("/units" , response=List[EmegencyUnitResponseSchema])
def list_units(request):
    units = EmergencyUnit.objects.all()
    return [
        {
            "id": unit.id,
            "unit_id": unit.unit_id,
            "unit_type": unit.unit_type,
            "status": unit.status,
            "latitude": float(unit.latitude) if unit.latitude else 0.0,
            "longitude": float(unit.longitude) if unit.longitude else 0.0,
            "updated_at": unit.updated_at,
        }
        for unit in units
    ]

@api.patch("/units/{unit_id}/location" , response=EmegencyUnitResponseSchema)
def update_unit_location(request , unit_id:str , payload : LocationUpdateSchema):
    unit = get_list_or_404(EmergencyUnit , unit_id = unit_id)[0]
    unit.latitude = payload.latitude
    unit.longitude = payload.longitude

    unit.save()
    return {
        "id": unit.id,
        "unit_id": unit.unit_id,
        "unit_type": unit.unit_type,
        "status": unit.status,
        "latitude": float(unit.latitude) if unit.latitude else 0.0,
        "longitude": float(unit.longitude) if unit.longitude else 0.0,
        "updated_at": unit.updated_at,
    }

@api.post("/incidents" , response=IncidentResponseSchema)
def report_incident(request , payload: IncidentCreateSchema):
    incident = Incident.objects.create(**payload.dict())
    return incident

@api.get("/incident" , response=List[IncidentResponseSchema])
def list_incident(request):
    return Incident.objects.all()