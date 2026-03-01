import logging

logger = logging.getLogger(__name__)

def send_checkin(email: str, message: str) -> bool:
    """
    Simulates sending a check-in email to a user.
    In a real implementation, this would use an SMTP server or an email API like SendGrid/Resend.
    """
    logger.info("Sending check-in email to %s: %s", email, message)
    # Placeholder: print or log the action
    print(f"DEBUG: Email sent to {email}: {message}")
    return True
