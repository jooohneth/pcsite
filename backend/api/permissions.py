import jwt
from django.conf import settings
from rest_framework import permissions
from .models import User
import logging

logger = logging.getLogger(__name__)

class IsAuthenticatedCustom(permissions.BasePermission):
    """
    Custom permission to check for a valid JWT in the Authorization header.
    Attaches the user object to the request if valid.
    """
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.debug("CustomAuth: No Bearer token found in Authorization header.")
            return False

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('id')
            if not user_id:
                logger.warning("CustomAuth: Token payload missing 'id'.")
                return False
            
            user = User.objects.get(id=user_id)
            request.user = user
            request.auth = token
            logger.debug(f"CustomAuth: User {user_id} authenticated successfully.")
            return True
        except jwt.ExpiredSignatureError:
            logger.info("CustomAuth: Expired token received.")
            return False
        except jwt.InvalidTokenError as e:
            logger.warning(f"CustomAuth: Invalid token received: {e}")
            return False
        except User.DoesNotExist:
            logger.error(f"CustomAuth: User with ID {user_id} from token not found in DB.")
            return False
        except Exception as e:
            logger.error(f"CustomAuth: Unexpected error during authentication: {e}", exc_info=True)
            return False 