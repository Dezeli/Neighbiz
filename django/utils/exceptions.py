from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        original_data = response.data

        if isinstance(original_data, dict):
            if "detail" in original_data:
                message = original_data["detail"]
            else:
                first_key = next(iter(original_data), None)
                first_error = original_data[first_key][0] if first_key else None
                message = first_error or "요청 처리 중 오류가 발생했습니다."
        else:
            message = "요청 처리 중 오류가 발생했습니다."

        custom_response = {
            "success": False,
            "message": str(message),
            "data": original_data,
        }

        return Response(custom_response, status=response.status_code)

    return response
