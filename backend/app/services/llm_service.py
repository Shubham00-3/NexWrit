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
        self.model = genai.GenerativeModel('gemini-2.0-flash') # Use a fast, capable model

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
            prompt = f"""Topic: "{document_topic}"
Section Title: "{section_title}"

Task: Write the content for this specific section.

Guidelines:
1. Do NOT start with the Section Title. Dive straight into the content.
2. Use professional, business-standard English.
3. Use Markdown for formatting (bolding key terms, bullet points).
4. Aim for ~150 words unless the topic requires less.

Content:"""
        else:  # pptx
            prompt = f"""Topic: "{document_topic}"
Slide Title: "{section_title}"

Task: Create content for this PowerPoint slide.

Guidelines:
1. Provide 3-5 concise, impactful bullet points.
2. Do NOT repeat the slide title.
3. Keep it brief and readable for a presentation.

Content:"""
        
        return await self.generate_content(prompt)

    async def refine_content(self, current_content: str, refinement_instruction: str) -> str:
        """Refine existing content based on user instruction"""
        prompt = f"""You are a professional editor.

Original Text:
{current_content}

User Instruction: {refinement_instruction}

Task: Rewrite the Original Text to strictly follow the User Instruction.
Rules:
1. Return ONLY the rewritten text.
2. Do not add conversational filler (e.g., "Here is the refined text").
3. Maintain professional formatting (Markdown).

Rewritten Text:"""
        
        return await self.generate_content(prompt)

    async def generate_outline(self, topic: str, document_type: str, num_sections: int = 5) -> list[str]:
        """Generate an outline/structure for a document"""
        if document_type == "docx":
            prompt = f"""Create a professional outline for a Word document about "{topic}".
            
Generate exactly {num_sections} section titles.
Return ONLY the titles, one per line. Do not use numbering (1., 2.) or bullets.

Section titles:"""
        else:  # pptx
            prompt = f"""Create an outline of slide titles for a PowerPoint presentation about "{topic}".
            
Generate exactly {num_sections} titles.
Return ONLY the titles, one per line. Do not use numbering.

Slide titles:"""
        
        response = await self.generate_content(prompt)
        
        # Parse response into list
        sections = [line.strip() for line in response.split('\n') if line.strip()]
        
        # Ensure we have the right number of sections
        return sections[:num_sections]

# Global instance
llm_service = LLMService()