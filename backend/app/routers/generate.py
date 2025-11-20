from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from app.middleware.auth import security, verify_token
from app.services.supabase_client import supabase
from app.services.llm_service import llm_service
from app.models.schemas import GenerateContentRequest, RefineContentRequest, GenerateOutlineRequest, GenerateOutlineResponse, SectionResponse

router = APIRouter(
    prefix="/generate",
    tags=["generate"],
    responses={404: {"description": "Not found"}},
)

@router.post("/outline", response_model=GenerateOutlineResponse)
async def generate_outline(
    request: GenerateOutlineRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Generate an AI-suggested outline/structure"""
    user = await verify_token(credentials)
    
    try:
        sections = await llm_service.generate_outline(
            topic=request.topic,
            document_type=request.type,
            num_sections=request.num_sections or 5
        )
        
        return {"sections": sections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/section/{section_id}", response_model=SectionResponse)
async def generate_section_content(
    section_id: str,
    request: GenerateContentRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Generate content for a specific section"""
    user = await verify_token(credentials)
    
    try:
        # Get the section
        section_response = supabase.table("sections").select("*, projects(*)").eq("id", section_id).execute()
        
        if not section_response.data:
            raise HTTPException(status_code=404, detail="Section not found")
        
        section = section_response.data[0]
        project = section["projects"]
        
        # Verify ownership
        if project["user_id"] != user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        # Generate content
        content = await llm_service.generate_section_content(
            section_title=section["title"],
            document_topic=project["title"],
            document_type=project["type"]
        )
        
        # Save generation history
        supabase.table("section_history").insert({
            "section_id": section_id,
            "prompt": "Initial Generation", 
            "content": content
        }).execute()

        # Update section with generated content
        update_response = supabase.table("sections").update({
            "content": content
        }).eq("id", section_id).execute()
        
        return update_response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refine/{section_id}", response_model=SectionResponse)
async def refine_section_content(
    section_id: str,
    request: RefineContentRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Refine existing section content based on user instruction"""
    user = await verify_token(credentials)
    
    try:
        # Get the section
        section_response = supabase.table("sections").select("*, projects(*)").eq("id", section_id).execute()
        
        if not section_response.data:
            raise HTTPException(status_code=404, detail="Section not found")
        
        section = section_response.data[0]
        project = section["projects"]
        
        # Verify ownership
        if project["user_id"] != user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        current_content = section.get("content") or ""
        
        if not current_content:
            raise HTTPException(status_code=400, detail="Section has no content to refine")
        
        # Refine content
        refined_content = await llm_service.refine_content(
            current_content=current_content,
            refinement_instruction=request.refinement_prompt
        )
        
        # Save refinement history
        supabase.table("section_history").insert({
            "section_id": section_id,
            "prompt": request.refinement_prompt,
            "content": refined_content
        }).execute()

        # Update section with refined content
        update_response = supabase.table("sections").update({
            "content": refined_content
        }).eq("id", section_id).execute()
        
        return update_response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
