from django.db import models
from django.utils import timezone

class EmergencyUnit(models.Model):
    UNIT_TYPES = (
        ('AMBULANCE' , 'Ambulance'),
        ('FIRE_TRUCK' , 'Fire Truck'),
        ('DRONE' , 'Drone'),
    )

    STATUS_CHOICE = (
        ('AVAILABLE' , 'Available'),
        ('BUSY' , 'Busy'),
        ('OFFLINE' , 'Offline'),
    )

    unit_id = models.CharField(max_length=20 , unique = True)
    unit_type = models.CharField(max_length=20 , choices=UNIT_TYPES)
    status = models.CharField(max_length=20 , choices = STATUS_CHOICE , default='AVAILABLE')
    
    # Location coordinates (latitude, longitude)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.unit_id} ({self.status})"
    
    def get_location(self):
        if self.latitude and self.longitude:
            return (float(self.latitude) , float(self.longitude))
        return None
    
    def get_location_string(self):
        if self.longitude and self.latitude:
            return f"{self.latitude} , {self.longitude}"
        return "Location not set"


    
class Incident(models.Model):
    INCIDENT_TYPES = (
        ('FIRE' , 'Fire'),
        ('MEDICAL' , 'Medical'),
        ('ACCIDENT' , 'Traffic Accident'),
    )

    STATUS_CHOICES = (
        ('ACTIVE' , 'Active'),
        ('RESOLVED' , 'Resolved'),
    )

    title = models.CharField(max_length=100)
    description = models.TextField()
    incident_type = models.CharField(max_length=20 , choices= INCIDENT_TYPES)
    status = models.CharField(max_length=20 , choices=STATUS_CHOICES, default='ACTIVE')

    # Location coordinates (latitude, longitude)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add = True)
    resolved_at = models.DateTimeField(null = True , blank = True)

    def __str__(self):
        return f"{self.title} - {self.status}"
    
    def get_location_string(self):
        if self.longitude and self.latitude:
            return f"{self.latitude} , {self.longitude}"
        return "Location not set"
    
    def get_location(self):
        if self.longitude and self.latitude:
            return (float(self.longitude) , float(self.latitude))
        return None