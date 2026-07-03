import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        conn.execute(text("COMMIT"))

        # 1. Find the basic plan ID
        result = conn.execute(
            text("SELECT id FROM subscription_plans WHERE plan_type = 'basic'")
        )
        basic_plan = result.fetchone()
        if basic_plan:
            basic_plan_id = basic_plan[0]

            # 2. Find the premium plan ID to reassign payments to
            result = conn.execute(
                text("SELECT id FROM subscription_plans WHERE plan_type = 'premium'")
            )
            premium_plan = result.fetchone()
            if premium_plan:
                premium_plan_id = premium_plan[0]

                # 3. Reassign payments from basic plan to premium plan
                result = conn.execute(
                    text("UPDATE payments SET plan_id = :prem_id WHERE plan_id = :basic_id"),
                    {"prem_id": premium_plan_id, "basic_id": basic_plan_id}
                )
                print(f"Reassigned {result.rowcount} payments: basic plan -> premium plan")

            # 4. Delete the Basic subscription plan
            result = conn.execute(
                text("DELETE FROM subscription_plans WHERE plan_type = 'basic'")
            )
            print(f"Deleted {result.rowcount} 'Basic' subscription plan(s)")
        else:
            print("No 'Basic' subscription plan found.")

        # 5. Migrate users
        result = conn.execute(
            text("UPDATE users SET plan = 'premium' WHERE plan = 'basic'")
        )
        print(f"Migrated {result.rowcount} users: basic => premium")

        # 6. Migrate subscription requests
        result = conn.execute(
            text("UPDATE subscription_requests SET plan_type = 'premium' WHERE plan_type = 'basic'")
        )
        print(f"Migrated {result.rowcount} subscription requests: basic => premium")

        # 7. Drop and recreate ENUM type (remove 'basic')
        conn.execute(text("ALTER TABLE users ALTER COLUMN plan TYPE VARCHAR(20)"))
        conn.execute(text("ALTER TABLE subscription_plans ALTER COLUMN plan_type TYPE VARCHAR(20)"))
        conn.execute(text("DROP TYPE IF EXISTS plantype"))
        conn.execute(text("CREATE TYPE plantype AS ENUM ('free', 'premium', 'enterprise')"))
        conn.execute(text("ALTER TABLE users ALTER COLUMN plan TYPE plantype USING plan::plantype"))
        conn.execute(text("ALTER TABLE subscription_plans ALTER COLUMN plan_type TYPE plantype USING plan_type::plantype"))
        conn.execute(text("ALTER TABLE users ALTER COLUMN plan SET DEFAULT 'free'"))

        conn.commit()
        print("\nMigration complete. 'basic' plan type removed.")

if __name__ == "__main__":
    migrate()
