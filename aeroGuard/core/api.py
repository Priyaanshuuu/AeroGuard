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
    IncidentResponseSchema,
    MissionAssignmentSchema
)
from .utils import calculate_distance
from django.db import transaction

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

@api.get("/units/nearest" , response = EmegencyUnitResponseSchema)
def find_nearest_unit(request , latitude: float , longitude : float):
    units = EmergencyUnit.objects.filter(status = 'AVAILABLE')
    if not units.exists():
        return api.create_response(request , {"message" : "No units available"} , status = 404)
    
    nearest_unit = None
    min_distance = float('inf')

    for unit in units:
        if unit.latitude is None or unit.longitude is None:
            continue

        dist = calculate_distance(latitude , longitude , unit.latitude , unit.longitude)
        if dist < min_distance:
            min_distance = dist
            nearest_unit = unit

    if nearest_unit:
        return nearest_unit
    else:
        return api.create_response(request , {"message" : "No reachable units found"} , status = 404)


@api.post("/units/{unit_id}/assign" , response={200 : EmegencyUnitResponseSchema, 409 : dict})
def assign_unit_to_incident(request , unit_id , payload: MissionAssignmentSchema):
    try:
        with transaction.atomic():
            unit = EmergencyUnit.objects.select_for_update().get(unit_id = unit_id)
            if unit.status != 'AVAILABLE':
                return 409 , {"message" : f"Too late! Unit {unit_id} is already {unit.status}"}
            unit.status = 'BUSY'
            unit.save()
            return 200 , unit
    except EmergencyUnit.DoesNotExist:
        return 404 , {"message" : "Unit not found"}