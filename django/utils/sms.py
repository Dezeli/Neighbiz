import requests
import hmac
import hashlib
import secrets
from datetime import datetime, timezone
from decouple import config
import logging

logger = logging.getLogger(__name__)

API_KEY = config("SOLAPI_API_KEY")        # 예: NCSJP2OMQZPX200R
API_SECRET = config("SOLAPI_API_SECRET")  # 예: BHHRKI61TS3XCIJ9YNTKP093CXPUSXCQ
SENDER_NUMBER = config("SOLAPI_CALLER_NUMBER")  # 사전에 등록한 발신번호 (예: 01012345678)


def generate_solapi_headers():
    date = datetime.now(timezone.utc).isoformat()
    salt = secrets.token_hex(32)
    message = date + salt

    signature = hmac.new(
        API_SECRET.encode(), message.encode(), hashlib.sha256
    ).hexdigest()

    authorization = (
        f"HMAC-SHA256 apiKey={API_KEY}, date={date}, salt={salt}, signature={signature}"
    )

    return {
        "Authorization": authorization,
        "Content-Type": "application/json"
    }


def send_sms(phone_number: str, text: str) -> bool:
    url = "https://api.solapi.com/messages/v4/send"
    headers = generate_solapi_headers()

    payload = {
        "message": {
            "to": phone_number,
            "from": SENDER_NUMBER,
            "text": text
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        logger.info("✅ SMS 전송 성공: %s", response.json())
        return True
    except requests.exceptions.RequestException as e:
        logger.error("❌ SMS 전송 중 예외 발생: %s", str(e))
        try:
            logger.error("❌ 응답 내용: %s", response.json())
        except Exception:
            pass
        return False
