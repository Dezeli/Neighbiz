from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            'success': False,
            'message': response.data.get('detail') or '요청 처리 중 오류가 발생했습니다.',
            'data': response.data
        }
        return Response(custom_response, status=response.status_code)

    return response
