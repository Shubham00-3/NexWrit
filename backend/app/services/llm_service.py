import os
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import re
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY must be set in environment variables")
        
        genai.configure(api_key=api_key)
        
        # --- NEW: Disable Safety Filters to prevent 500 Errors ---
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        }
        
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def _clean_response(self, text: str) -> str:
        """Removes conversational filler from AI response"""
        lines = text.strip().split('\n')
        cleaned_lines = []
        for line in lines:
            lower_line = line.lower()
            # Filter out common AI filler phrases
            if any(phrase in lower_line for phrase in [
                "here is", "here's", "sure,", "certainly", "concise bullet points", 
                "content for", "slide:", "output:", "revised text", "in this section"
            ]):
                continue
            cleaned_lines.append(line)
            
        return '\n'.join(cleaned_lines).strip()

    async def generate_content(self, prompt: str) -> str:
        """Generate content based on a prompt"""
        try:
            response = self.model.generate_content(
                prompt, 
                safety_settings=self.safety_settings  # <--- Apply settings here
            )
            
            # Check if response was blocked
            if not response.parts:
                return "Content generation was blocked by AI safety filters. Please try a different topic."
                
            return self._clean_response(response.text)
        except Exception as e:
            print(f"LLM Generation Error: {str(e)}") # Print error to console for debugging
            raise Exception(f"Error generating content: {str(e)}")

    async def generate_section_content(self, section_title: str, document_topic: str, document_type: str) -> str:
        """Generate content for a specific section"""
        if document_type == "docx":
            prompt = f"""Topic: "{document_topic}"
Section Title: "{section_title}"

Task: Write professional content for this section.
Rules:
1. Start directly with the content. Do NOT repeat the title.
2. Do NOT use intro phrases like "Here is the content".
3. Use **bold** for key terms.
4. Write 2-3 detailed paragraphs.

Content:"""
        else:  # pptx
            prompt = f"""Topic: "{document_topic}"
Slide Title: "{section_title}"

Task: Create 3-5 bullet points for this PowerPoint slide.
Rules:
1. Return ONLY the bullet points.
2. Do NOT use intro phrases.
3. Do NOT repeat the slide title.
4. Use **bold** for keywords.

Content:"""
        
        return await self.generate_content(prompt)

    async def refine_content(self, current_content: str, refinement_instruction: str) -> str:
        prompt = f"""Original:
{current_content}

Instruction: {refinement_instruction}

Task: Rewrite the original text following the instruction.
Rules:
1. Return ONLY the rewritten text. NO intro or outro.
2. Keep professional formatting.

Result:"""
        
        return await self.generate_content(prompt)

    async def generate_outline(self, topic: str, document_type: str, num_sections: int = 5) -> list[str]:
        if document_type == "docx":
            prompt = f"""Create a Word document outline about "{topic}".
Generate exactly {num_sections} section titles.
Return ONLY the titles, one per line."""
        else:
            prompt = f"""Create a PowerPoint presentation outline about "{topic}".
Generate exactly {num_sections} slide titles.
Return ONLY the titles, one per line."""
        
        response = await self.generate_content(prompt)
        
        # Safe parsing
        if not response:
            return ["Introduction", "Overview", "Key Features", "Challenges", "Conclusion"]
            
        sections = [line.strip() for line in response.split('\n') if line.strip()]
        return sections[:num_sections]

# Global instance
llm_service = LLMService()