from celery import shared_task
import time

@shared_task
def process_heavy_data(unit_id):
    print(f"Started processing data for {unit_id}...")
    time.sleep(5)
    print(f"Finished prcessing {unit_id}")
    return f"Status updated for {unit_id}"