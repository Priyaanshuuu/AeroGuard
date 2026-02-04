import math

def calculate_distance(lat1 , lon1 , lat2 , lon2):
    try:
        lat1 , lon1 , lat2  ,lon2 = map(float , [lat1 , lon1 , lat2 , lat2])
    except(ValueError , TypeError):
        return float('inf')
    
    dlon = math.radians(lon2) - math.radians(lon1)
    dlat = math.radians(lat2) - math.radians(lat1)

    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2

    c = 2* math.asin(math.sqrt(a))

    r = 6371

    return c * r