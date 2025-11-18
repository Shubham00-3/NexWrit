import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY must be set in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    async def generate_content(self, prompt: str) -> str:
        """Generate content based on a prompt"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Error generating content: {str(e)}")

    async def generate_section_content(self, section_title: str, document_topic: str, document_type: str) -> str:
        """Generate content for a specific section"""
        if document_type == "docx":
            prompt = f"""You are writing a section for a professional Word document about "{document_topic}".
            
Section Title: {section_title}

Write detailed, well-structured content for this section. Use professional language and include relevant details.
The content should be around 150-200 words. Format with paragraphs as needed.

Content:"""
        else:  # pptx
            prompt = f"""You are creating content for a PowerPoint slide about "{document_topic}".
            
Slide Title: {section_title}

Create concise, impactful bullet points for this slide. Use 3-5 bullet points.
Each bullet should be clear and to the point. Keep it professional.

Content:"""
        
        return await self.generate_content(prompt)

    async def refine_content(self, current_content: str, refinement_instruction: str) -> str:
        """Refine existing content based on user instruction"""
        prompt = f"""Current content:
{current_content}

User instruction: {refinement_instruction}

Please rewrite the content according to the user's instruction while maintaining professional quality.

Refined content:"""
        
        return await self.generate_content(prompt)

    async def generate_outline(self, topic: str, document_type: str, num_sections: int = 5) -> list[str]:
        """Generate an outline/structure for a document"""
        if document_type == "docx":
            prompt = f"""Create an outline for a professional Word document about "{topic}".
            
Generate exactly {num_sections} section titles.
Each section should be clear and descriptive.
Return only the section titles, one per line, without numbering.

Section titles:"""
        else:  # pptx
            prompt = f"""Create slide titles for a professional PowerPoint presentation about "{topic}".
            
Generate exactly {num_sections} slide titles.
Each slide title should be clear and engaging.
Return only the slide titles, one per line, without numbering.

Slide titles:"""
        
        response = await self.generate_content(prompt)
        
        # Parse response into list
        sections = [line.strip() for line in response.split('\n') if line.strip()]
        
        # Ensure we have the right number of sections
        return sections[:num_sections]

# Global instance
llm_service = LLMService()
