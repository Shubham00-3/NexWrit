from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Project Schemas
class ProjectCreate(BaseModel):
    title: str
    type: str  # 'docx' or 'pptx'

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    title: str
    type: str
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# Comment Schemas (Moved up)
class CommentCreate(BaseModel):
    text: str

class CommentResponse(BaseModel):
    id: str
    section_id: str
    user_id: str
    text: str
    created_at: datetime

# Section Schemas
class SectionCreate(BaseModel):
    title: str
    order_index: int
    content: Optional[str] = None

class SectionUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class SectionResponse(BaseModel):
    id: str
    project_id: str
    title: str
    content: Optional[str]
    order_index: int
    created_at: datetime
    comments: List[CommentResponse] = []

# AI Generation Schemas
class GenerateContentRequest(BaseModel):
    section_id: str
    prompt: Optional[str] = None

class RefineContentRequest(BaseModel):
    section_id: str
    refinement_prompt: str

class GenerateOutlineRequest(BaseModel):
    topic: str
    type: str  # 'docx' or 'pptx'
    num_sections: Optional[int] = 5

class GenerateOutlineResponse(BaseModel):
    sections: List[str]

class FeedbackCreate(BaseModel):
    is_positive: bool