import smtplib
import ssl
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import settings

logger = logging.getLogger("email")

SMTP_SSL_PORT = 465
SMTP_STARTTLS_PORT = 587


def _send_email(to_email: str, msg: str) -> None:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        raise RuntimeError("SMTP not configured")

    try:
        if settings.SMTP_PORT == SMTP_SSL_PORT:
            _send_smtp_ssl(to_email, msg)
        else:
            _send_starttls(to_email, msg)
    except Exception as e:
        logger.warning(f"Primary SMTP failed on port {settings.SMTP_PORT}: {e}")
        fallback_port = SMTP_STARTTLS_PORT if settings.SMTP_PORT == SMTP_SSL_PORT else SMTP_SSL_PORT
        if fallback_port == SMTP_SSL_PORT:
            _send_smtp_ssl(to_email, msg)
        else:
            _send_starttls(to_email, msg)
        logger.info(f"Fallback SMTP succeeded on port {fallback_port}")


def _send_smtp_ssl(to_email: str, msg: str) -> None:
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(settings.SMTP_HOST, SMTP_SSL_PORT, context=context) as server:
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_FROM, to_email, msg)


def _send_starttls(to_email: str, msg: str) -> None:
    with smtplib.SMTP(settings.SMTP_HOST, SMTP_STARTTLS_PORT) as server:
        server.ehlo()
        server.starttls(context=ssl.create_default_context())
        server.ehlo()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.SMTP_FROM, to_email, msg)


def _build_msg(to_email: str, subject: str, html: str, text: str = "") -> str:
    msg = MIMEMultipart("alternative")
    msg["From"] = settings.SMTP_FROM
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(text or html, "plain"))
    msg.attach(MIMEText(html, "html"))
    return msg.as_string()


# ─── OTP ─────────────────────────────────────────────────────────────────────

def send_otp_email(to_email: str, otp: str) -> None:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.error("SMTP not configured — set SMTP_USER / SMTP_PASSWORD in .env")
        return

    subject = "Your OTP for IELTSPrep Verification"
    html = _otp_email_html(otp)
    text = f"Your OTP is: {otp}\n\nValid for 10 minutes."
    msg = _build_msg(to_email, subject, html, text)

    try:
        _send_email(to_email, msg)
    except Exception as e:
        logger.error(f"Failed to send OTP email: {e}")
        logger.warning(f"OTP for {to_email}: {otp}")


def _otp_email_html(otp: str) -> str:
    return f"""\
<html>
  <body style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; border-top: 4px solid #CC0000;">
      <h2 style="color: #1a1a1a; margin: 0 0 8px;">Email Verification</h2>
      <p style="color: #666; font-size: 14px; line-height: 1.6;">Use the OTP below to verify your email address for <strong>IELTSPrep</strong>.</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #CC0000; background: #fff0f0; padding: 12px 24px; border-radius: 8px;">{otp}</span>
      </div>
      <p style="color: #999; font-size: 12px; line-height: 1.5;">This OTP is valid for 10 minutes. If you didn't request this, you can ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
      <p style="color: #bbb; font-size: 11px; text-align: center;">IELTSPrep — IELTS Computer Based Practice Platform</p>
    </div>
  </body>
</html>"""


# ─── PASSWORD RESET ──────────────────────────────────────────────────────────

def send_password_reset_email(to_email: str, token: str) -> None:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.error("SMTP not configured — set SMTP_USER / SMTP_PASSWORD in .env")
        return

    reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
    subject = "Reset your IELTSPrep password"
    html = _reset_email_html(reset_url)
    text = f"Reset your password here: {reset_url}\n\nLink valid for 1 hour."
    msg = _build_msg(to_email, subject, html, text)

    try:
        _send_email(to_email, msg)
    except Exception as e:
        logger.error(f"Failed to send password reset email: {e}")
        logger.warning(f"Reset link for {to_email}: {reset_url}")


# ─── CONTACT ─────────────────────────────────────────────────────────────────

def send_contact_email(
    name: str,
    from_email: str,
    subject: str,
    message: str,
    screenshot_url: str = "",
) -> None:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.error("SMTP not configured — set SMTP_USER / SMTP_PASSWORD in .env")
        return

    subj = f"[Contact] {subject} — {name}"
    html = _contact_email_html(name, from_email, subject, message, screenshot_url)
    text = f"Contact form submission\n\nName: {name}\nEmail: {from_email}\nSubject: {subject}\n\n{message}"
    if screenshot_url:
        text += f"\n\nScreenshot: {screenshot_url}"
    msg = _build_msg(settings.SMTP_FROM, subj, html, text)

    try:
        _send_email(settings.SMTP_FROM, msg)
        logger.info(f"Contact email sent from {from_email} ({name})")
    except Exception as e:
        logger.error(f"Failed to send contact email: {e}")


def _contact_email_html(name: str, email: str, subject: str, message: str, screenshot_url: str) -> str:
    screenshot_block = (
        f'<p style="color: #999; font-size: 13px;"><strong>Screenshot:</strong> <a href="{screenshot_url}" style="color: #CC0000;">{screenshot_url}</a></p>'
        if screenshot_url else ""
    )
    return f"""\
<html>
  <body style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
    <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; border-top: 4px solid #CC0000;">
      <h2 style="color: #1a1a1a; margin: 0 0 16px;">Contact Form Submission</h2>
      <table style="width: 100%; font-size: 14px; color: #333; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; color: #999; width: 80px;">Name</td><td style="padding: 6px 0; font-weight: 600;">{name}</td></tr>
        <tr><td style="padding: 6px 0; color: #999;">Email</td><td style="padding: 6px 0;"><a href="mailto:{email}" style="color: #CC0000;">{email}</a></td></tr>
        <tr><td style="padding: 6px 0; color: #999;">Subject</td><td style="padding: 6px 0; font-weight: 600;">{subject}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 16px 0;" />
      <p style="color: #333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">{message}</p>
      {screenshot_block}
      <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
      <p style="color: #bbb; font-size: 11px; text-align: center;">Sent via IELTSPrep Contact Form</p>
    </div>
  </body>
</html>"""


def _reset_email_html(reset_url: str) -> str:
    return f"""\
<html>
  <body style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; border-top: 4px solid #CC0000;">
      <h2 style="color: #1a1a1a; margin: 0 0 8px;">Password Reset</h2>
      <p style="color: #666; font-size: 14px; line-height: 1.6;">You requested a password reset for your <strong>IELTSPrep</strong> account.</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="{reset_url}" style="display: inline-block; background: #CC0000; color: #fff; font-size: 15px; font-weight: 700; padding: 13px 32px; border-radius: 8px; text-decoration: none; font-family: Arial, sans-serif;">Reset Password</a>
      </div>
      <p style="color: #999; font-size: 12px; line-height: 1.5;">This link is valid for 1 hour. If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
      <p style="color: #bbb; font-size: 11px; text-align: center;">IELTSPrep — IELTS Computer Based Practice Platform</p>
    </div>
  </body>
</html>"""
