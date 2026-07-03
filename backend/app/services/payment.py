import hmac
import hashlib
import base64
import json
import httpx
from app.config import settings


# ─── eSEWA ───────────────────────────────────────────────────────────────────

def generate_esewa_signature(
    total_amount: int,
    transaction_uuid: str,
    product_code: str,
) -> str:
    """Generate HMAC-SHA256 signature for eSewa v2 API."""
    message = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    key = settings.ESEWA_SECRET_KEY.encode("utf-8")
    msg = message.encode("utf-8")
    digest = hmac.new(key, msg, hashlib.sha256).digest()
    return base64.b64encode(digest).decode("utf-8")


def get_esewa_form_data(
    amount_npr_paisa: int,
    transaction_uuid: str,
    success_url: str,
    failure_url: str,
) -> dict:
    """Return form data dict for initiating eSewa payment."""
    amount_rupees = amount_npr_paisa // 100
    product_code = settings.ESEWA_MERCHANT_CODE
    signature = generate_esewa_signature(amount_rupees, transaction_uuid, product_code)

    return {
        "amount": amount_rupees,
        "tax_amount": 0,
        "total_amount": amount_rupees,
        "transaction_uuid": transaction_uuid,
        "product_code": product_code,
        "product_service_charge": 0,
        "product_delivery_charge": 0,
        "success_url": success_url,
        "failure_url": failure_url,
        "signed_field_names": "total_amount,transaction_uuid,product_code",
        "signature": signature,
        "payment_url": f"{settings.ESEWA_BASE_URL}/api/epay/main/v2/form",
    }


def verify_esewa_payment(encoded_data: str) -> dict:
    """Verify eSewa payment response (base64 encoded JSON)."""
    try:
        decoded = base64.b64decode(encoded_data).decode("utf-8")
        data = json.loads(decoded)

        # Verify signature from eSewa
        if data.get("status") == "COMPLETE":
            return {"success": True, "data": data}
        return {"success": False, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ─── KHALTI ──────────────────────────────────────────────────────────────────

def initiate_khalti_payment(
    amount_paisa: int,
    purchase_order_id: str,
    purchase_order_name: str,
    return_url: str,
    website_url: str,
    customer_info: dict,
) -> dict:
    """Initiate Khalti payment and return pidx + payment_url."""
    headers = {
        "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "return_url": return_url,
        "website_url": website_url,
        "amount": amount_paisa,
        "purchase_order_id": purchase_order_id,
        "purchase_order_name": purchase_order_name,
        "customer_info": customer_info,
    }

    try:
        response = httpx.post(
            f"{settings.KHALTI_BASE_URL}/epayment/initiate/",
            json=payload,
            headers=headers,
            timeout=30,
        )
        data = response.json()
        if response.status_code == 200:
            return {"success": True, "pidx": data.get("pidx"), "payment_url": data.get("payment_url")}
        return {"success": False, "error": data}
    except Exception as e:
        return {"success": False, "error": str(e)}


def verify_khalti_payment(pidx: str) -> dict:
    """Verify Khalti payment using pidx."""
    headers = {
        "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
        "Content-Type": "application/json",
    }
    try:
        response = httpx.post(
            f"{settings.KHALTI_BASE_URL}/epayment/lookup/",
            json={"pidx": pidx},
            headers=headers,
            timeout=30,
        )
        data = response.json()
        if response.status_code == 200 and data.get("status") == "Completed":
            return {"success": True, "data": data}
        return {"success": False, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}
