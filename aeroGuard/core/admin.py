from django.contrib import admin 
from .models import EmergencyUnit , Incident

@admin.register(EmergencyUnit)
class EmergencyUnitAdmin(admin.ModelAdmin):
    list_display = ('unit_id' , 'unit_type' , 'status' , 'get_location_string' , 'updated_at')
    search_fields = ('unit_id',)
    list_filter = ('status' , 'unit_type')

@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = ('title' , 'incident_type' , 'status' , 'get_location_string' , 'created_at')
    list_filter = ('status' , 'incident_type')
    search_fields = ('title',)