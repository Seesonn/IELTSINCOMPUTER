import httpx
import logging
from typing import Optional

logger = logging.getLogger("geolocation")


async def geolocate_ip(ip_address: Optional[str]) -> tuple[Optional[str], Optional[str]]:
    """Return (city, country) for a given IP address using ip-api.com (free, no key).

    Returns (None, None) for private/internal IPs or on failure.
    """
    if not ip_address:
        return None, None

    # Skip private / loopback / LAN ranges
    if ip_address.startswith(("10.", "172.16.", "172.17.", "172.18.", "172.19.",
                              "172.20.", "172.21.", "172.22.", "172.23.",
                              "172.24.", "172.25.", "172.26.", "172.27.",
                              "172.28.", "172.29.", "172.30.", "172.31.",
                              "192.168.", "127.", "0.")) or ip_address == "::1":
        return None, None

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(f"http://ip-api.com/json/{ip_address}?fields=city,country")
            if resp.status_code == 200:
                data = resp.json()
                if data.get("city") and data.get("country"):
                    return data["city"], data["country"]
    except Exception:
        logger.warning(f"Geolocation failed for IP {ip_address}", exc_info=True)

    return None, None
