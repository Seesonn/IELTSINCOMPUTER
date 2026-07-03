import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app import models

def update():
    db = SessionLocal()

    # Update Premium plan
    premium = db.query(models.SubscriptionPlan).filter(
        models.SubscriptionPlan.plan_type == 'premium'
    ).first()
    if premium:
        premium.name = "Premium"
        premium.price_npr = 75000
        premium.features = ["All practice tests", "AI Writing feedback", "Progress tracking", "Vocabulary builder"]
        print(f"Updated Premium plan (ID: {premium.id})")

    # Add Enterprise plan if not exists
    enterprise = db.query(models.SubscriptionPlan).filter(
        models.SubscriptionPlan.plan_type == 'enterprise'
    ).first()
    if not enterprise:
        db.add(models.SubscriptionPlan(
            name="Enterprise On Demand",
            plan_type='enterprise',
            price_npr=0,
            duration_days=30,
            features=["Everything in Premium", "Up to 10 premium sub-accounts", "Custom test creation", "Dedicated mentor", "Team analytics", "Priority 24/7 support"],
        ))
        print("Added Enterprise plan")
    else:
        print("Enterprise plan already exists")

    db.commit()
    db.close()
    print("Done")

if __name__ == "__main__":
    update()
