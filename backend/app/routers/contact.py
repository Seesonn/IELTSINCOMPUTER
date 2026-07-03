import logging
from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from app.services.email import send_contact_email
from app.services.cloudinary_upload import upload_screenshot

router = APIRouter(prefix="/contact", tags=["Contact"])
logger = logging.getLogger(__name__)

SUBJECT_MAP = {
    "query": "General Query",
    "report": "Report a Problem / Bug",
    "content": "Incorrect Content",
    "suggestion": "Suggestion / Feedback",
    "other": "Other",
}


@router.post("")
def submit_contact(
    name: str = Form(...),
    email: str = Form(...),
    subject: str = Form("query"),
    message: str = Form(...),
    screenshot: UploadFile = File(None),
):
    if not name.strip() or not email.strip() or not message.strip():
        raise HTTPException(status_code=400, detail="Name, email, and message are required")

    subject_label = SUBJECT_MAP.get(subject, subject)

    screenshot_url = ""
    if screenshot and screenshot.filename:
        try:
            bytes_data = screenshot.file.read()
            screenshot_url = upload_screenshot(bytes_data, screenshot.filename)
        except Exception as e:
            logger.warning(f"Screenshot upload failed: {e}")

    try:
        send_contact_email(
            name=name.strip(),
            from_email=email.strip(),
            subject=subject_label,
            message=message.strip(),
            screenshot_url=screenshot_url,
        )
    except Exception as e:
        logger.error(f"Failed to send contact email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send message. Please try again later.")

    return {"ok": True, "message": "Message sent successfully"}
