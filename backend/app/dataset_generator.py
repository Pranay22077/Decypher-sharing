import csv
import random
import os
from datetime import datetime, timedelta

def generate_dataset():
    os.makedirs("data/demo", exist_ok=True)
    
    # 1. Generate Synthetic CDR (Call Detail Records)
    print("Generating Synthetic CDRs...")
    with open("data/demo/synthetic_cdr.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "caller", "receiver", "duration", "tower_location"])
        base_time = datetime.now() - timedelta(days=30)
        callers = ["+919876543210", "+919876543211", "+919876543212"]
        receivers = ["+919876543220", "+919876543221"]
        towers = ["Tower_A_Connaught_Place", "Tower_B_Gurugram", "Tower_C_Noida"]
        
        for i in range(100):
            t = base_time + timedelta(hours=random.randint(1, 700))
            writer.writerow([t.isoformat(), random.choice(callers), random.choice(receivers), random.randint(10, 300), random.choice(towers)])
            
    # 2. Generate Synthetic Financial Transactions (Elliptic-style)
    print("Generating Synthetic Financial Records...")
    with open("data/demo/synthetic_transactions.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "source_account", "target_account", "amount", "currency", "bank"])
        accounts = ["AC-4821", "AC-9922", "AC-1100", "AC-5544"]
        banks = ["HDFC", "ICICI", "SBI"]
        for i in range(50):
            t = base_time + timedelta(hours=random.randint(1, 700))
            writer.writerow([t.isoformat(), random.choice(accounts), random.choice(accounts), random.randint(1000, 500000), "INR", random.choice(banks)])
            
    print("Datasets generated in data/demo/")

if __name__ == "__main__":
    generate_dataset()
