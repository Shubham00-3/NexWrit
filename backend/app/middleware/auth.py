from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.supabase_client import supabase

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials):
    """Verify Supabase JWT token"""
    token = credentials.credentials
    
    try:
        # Verify the token with Supabase
        user = supabase.auth.get_user(token)
        if user and user.user:
            return user.user
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
        )
