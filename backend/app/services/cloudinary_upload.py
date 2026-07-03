import logging
import cloudinary
import cloudinary.uploader
from app.config import settings

logger = logging.getLogger(__name__)

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


def upload_screenshot(file_bytes: bytes, filename: str) -> str:
    try:
        result = cloudinary.uploader.upload(
            file_bytes,
            public_id=f"subscriptions/{filename.rsplit('.', 1)[0]}",
            resource_type="image",
            overwrite=True,
        )
        return result["secure_url"]
    except Exception as e:
        logger.exception("Cloudinary upload failed")
        raise Exception(f"Cloudinary upload error: {e}")
