import json
from channels.generic.websocket import AsyncWebsocketConsumer

class UnitConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "unit_group"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        print("FrontEnd Connected to WebSocket!!")
    
    async def disconnect(self , close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def unit_update(self , event):
        await self.send(text_data = json.dumps(event['message']))
