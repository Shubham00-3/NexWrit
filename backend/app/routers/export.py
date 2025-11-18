from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from app.middleware.auth import security, verify_token
from app.services.supabase_client import supabase
from app.services.doc_gen_service import doc_gen_service

router = APIRouter(
    prefix="/export",
    tags=["export"],
    responses={404: {"description": "Not found"}},
)

@router.get("/{project_id}")
async def export_project(
    project_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Export a project as .docx or .pptx file"""
    user = await verify_token(credentials)
    
    try:
        # Get project
        project_response = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user.id).execute()
        
        if not project_response.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project = project_response.data[0]
        
        # Get sections
        sections_response = supabase.table("sections").select("*").eq("project_id", project_id).order("order_index").execute()
        sections = sections_response.data
        
        # Generate document based on type
        if project["type"] == "docx":
            file_stream = doc_gen_service.create_docx(project["title"], sections)
            media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            filename = f"{project['title']}.docx"
        else:  # pptx
            file_stream = doc_gen_service.create_pptx(project["title"], sections)
            media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            filename = f"{project['title']}.pptx"
        
        return StreamingResponse(
            file_stream,
            media_type=media_type,
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
