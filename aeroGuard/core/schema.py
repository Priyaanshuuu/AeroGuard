from ninja import Schema
from datetime import datetime
from decimal import Decimal
from typing import Optional , Literal


class EmerrgencyUnitCreateSchema(Schema):
    unit_id : str
    unit_type : Literal['AMBULANCE' , 'FIRE_TRUCK' , 'DRONE']
    latitude : float
    longitude : float

class EmegencyUnitResponseSchema(Schema):
    id:int
    unit_id : str
    unit_type: str
    status: str
    latitude: float
    longitude : float
    updated_at : datetime

class LocationUpdateSchema(Schema):
    latitude : float
    longitude : float
    status : Optional[str] = None

class IncidentCreateSchema(Schema):
    title : str
    desciption : str
    incident_type : Literal['FIRE' , 'MEDICAL' , 'ACCIDENT']
    latitude : float
    longitude : float

class IncidentResponseSchema(Schema):
    id : int
    title : str
    description : str
    incident_type: str
    status : str
    latitude: float
    longitude : float
    resolved_at : Optional[datetime]


class MissionAssignmentSchema(Schema):
    incident_id : int

