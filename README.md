# NexWrit - AI-Assisted Document Authoring Platform

<div align="center">

![NexWrit Logo](https://img.shields.io/badge/NexWrit-AI%20Powered-blue?style=for-the-badge)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

**A full-stack, AI-powered web application for generating, refining, and exporting professional business documents**

[Live Demo](https://nex-writ.vercel.app) | [Video Demo](#-demo-video) | [Documentation](#-table-of-contents)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Deployment](#-live-deployment)
- [Demo Video](#-demo-video)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Running the Application](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Assignment Fulfillment](#-assignment-fulfillment)
- [License](#-license)

---

## 🎯 About the Project

NexWrit is an AI-assisted document authoring platform that streamlines the creation of professional business documents. Users can generate Microsoft Word (.docx) and PowerPoint (.pptx) documents with AI-generated content, refine them iteratively, and export polished final versions.

### Key Workflow

```
Login → Configure Document → AI Generate Content → Iteratively Refine → Export .docx/.pptx
```

This project was developed as a comprehensive full-stack assignment demonstrating:
- **Backend Development**: FastAPI with authentication and AI integration
- **Frontend Development**: Modern React with responsive UI
- **AI Integration**: Google Gemini API for content generation
- **Database Management**: Supabase with PostgreSQL
- **Document Processing**: Python libraries for .docx and .pptx generation

---

## ✨ Features

### Core Functionality

- ✅ **User Authentication**
  - Secure registration and login with Supabase Auth
  - JWT-based session management
  - Protected routes and API endpoints

- ✅ **Project Management**
  - Create and manage multiple document projects
  - Support for both Word (.docx) and PowerPoint (.pptx) formats
  - Dashboard with all user projects
  - Delete and organize projects

- ✅ **Document Configuration**
  - Choose document type (Word or PowerPoint)
  - Define main topic/prompt
  - Create custom outlines/structures
  - Add, remove, and reorder sections/slides

- ✅ **AI-Powered Content Generation**
  - Section-by-section content generation using Gemini AI
  - Context-aware AI that understands document structure
  - Slide-specific content for presentations
  - Professional, business-ready output

- ✅ **Interactive Refinement Interface**
  - Natural language refinement prompts per section
  - Examples: "Make this more formal", "Add bullet points", "Shorten to 100 words"
  - Like/Dislike feedback buttons
  - Comment system for notes
  - Real-time content updates

- ✅ **Document Export**
  - Download as .docx or .pptx
  - Well-formatted, professional documents
  - Preserves all refined content
  - Ready for immediate use

### Bonus Features

- ⭐ **AI-Generated Templates** (Bonus Feature)
  - Click "AI Suggest" during configuration
  - Automatically generates document outlines
  - Creates slide titles for presentations
  - Editable and customizable suggestions

- ⭐ **Modern UI/UX**
  - Beautiful dark-themed interface
  - Responsive design (desktop, tablet, mobile)
  - Smooth animations and transitions
  - Glass morphism effects
  - Intuitive navigation

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python web framework |
| **Google Gemini API** | Large Language Model for AI content generation |
| **Supabase** | PostgreSQL database and authentication |
| **python-docx** | Microsoft Word document generation |
| **python-pptx** | PowerPoint presentation generation |
| **Uvicorn** | ASGI server for FastAPI |
| **Pydantic** | Data validation and settings management |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | Modern UI library with hooks |
| **Vite** | Fast build tool and dev server |
| **TailwindCSS** | Utility-first CSS framework |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Beautiful icon library |
| **Framer Motion** | Animation library |
| **Sonner** | Toast notifications |

### Database & Authentication
| Technology | Purpose |
|------------|---------|
| **Supabase PostgreSQL** | Relational database |
| **Supabase Auth** | User authentication and JWT |
| **Row Level Security (RLS)** | Data isolation per user |

### Deployment
| Service | Purpose |
|---------|---------|
| **AWS EC2** | Backend API hosting |
| **Vercel** | Frontend hosting and CDN |

---

## 🌐 Live Deployment

The application is fully deployed and accessible online:

- **Frontend**: [https://nex-writ.vercel.app](https://nex-writ.vercel.app)
  - Hosted on Vercel
  - Automatic deployments from GitHub
  - Global CDN for fast loading

- **Backend API**: `http://34.224.28.22:8000`
  - Hosted on AWS EC2 (Ubuntu)
  - FastAPI with Uvicorn
  - Swagger docs: `http://34.224.28.22:8000/docs`

### Test Credentials

For quick testing, you can use these demo credentials or create your own account:

```
Email: demo@nexwrit.com
Password: Demo123!
```

---

## 🎥 Demo Video

**[Watch the Full Demo Video Here (5-10 minutes)](#)**

The demo video covers:
1. User registration and login
2. Creating a Word document project
3. Configuring a PowerPoint presentation
4. AI content generation process
5. Iterative refinement with natural language
6. Using like/dislike feedback
7. Adding comments to sections
8. Exporting .docx and .pptx files
9. AI-generated template workflow (bonus feature)

> **Note**: Video link will be added here or submitted separately as per assignment guidelines.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

**Required Software:**
- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/downloads))

**Required Accounts:**
- **Supabase Account** ([Sign up free](https://supabase.com/))
  - For database and authentication
- **Google AI Studio** ([Get API Key](https://makersuite.google.com/))
  - For Gemini API access

---

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nexwrit.git
cd nexwrit
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Backend Dependencies (requirements.txt):**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
supabase==2.0.0
python-dotenv==1.0.0
python-docx==1.1.0
python-pptx==0.6.23
google-generativeai==0.3.0
pydantic==2.5.0
pydantic-settings==2.1.0
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

---

### Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI API
GEMINI_API_KEY=your_gemini_api_key

# Optional: Server Configuration
PORT=8000
HOST=0.0.0.0
```

**How to get these values:**

1. **Supabase URL & Keys**:
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Select your project
   - Navigate to Settings → API
   - Copy:
     - `Project URL` → SUPABASE_URL
     - `anon/public key` → SUPABASE_KEY
     - `service_role key` → SUPABASE_SERVICE_ROLE_KEY

2. **Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/)
   - Click "Get API Key"
   - Create new API key
   - Copy the key → GEMINI_API_KEY

#### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key

# Backend API URL (for local development)
VITE_API_URL=http://localhost:8000

# For production deployment
# VITE_API_URL=http://your-backend-url:8000
```

> **Important**: Use the same Supabase project for both frontend and backend.

---

### Database Setup

#### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Fill in project details and create

#### 2. Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Copy the contents of `schema.sql` (in the root directory)
3. Paste and click **Run**

**Database Schema Overview:**

```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('docx', 'pptx')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sections table (for Word) or Slides (for PowerPoint)
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Section feedback table
CREATE TABLE section_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  is_positive BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
-- (See full schema.sql for complete RLS policies)
```

The schema includes:
- **Row Level Security (RLS)** policies for data isolation
- **Foreign key constraints** for data integrity
- **Cascade deletes** for cleanup
- **Timestamps** for tracking

---

## 💻 Running the Application

### Start the Backend

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already activated)
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate  # Windows

# Run the FastAPI server
uvicorn main:app --reload --port 8000

# Or with custom host
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start at:
- **API**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### Start the Frontend

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Start the development server
npm run dev

# Or with yarn
yarn dev
```

The frontend will start at:
- **Application**: http://localhost:5173

### Access the Application

1. Open your browser and go to http://localhost:5173
2. Register a new account or log in
3. Start creating AI-powered documents!

---

## 📖 Usage Guide

### 1. User Registration & Login

**Register:**
- Click "Sign Up" on the homepage
- Enter email and password (minimum 6 characters)
- Click "Create Account"

**Login:**
- Enter your credentials
- Click "Sign In"
- You'll be redirected to the dashboard

### 2. Create a New Project

1. From the dashboard, click **"New Project"** or **"+ Create New Project"**
2. You'll be taken to the configuration wizard

### 3. Configure Your Document

**Step 1: Choose Document Type**
- Select **Word Document (.docx)** for text-based documents
- Select **PowerPoint (.pptx)** for presentations

**Step 2: Set Title and Topic**
- Enter a descriptive title (e.g., "Market Analysis Report")
- Enter the main topic/prompt for AI to use as context

**Step 3: Define Structure**

**Option A: Manual Configuration**
- For Word: Add section headers (Introduction, Analysis, Conclusion, etc.)
- For PowerPoint: Add slide titles (Title Slide, Overview, Key Points, etc.)
- Use the "+" button to add more
- Drag to reorder
- Click "×" to remove

**Option B: AI-Suggested Outline (Bonus Feature)**
- Click **"AI Suggest"** button
- AI generates a complete outline based on your topic
- Review and edit the suggestions
- Accept or modify as needed

**Step 4: Create Project**
- Click "Create Project" to proceed to the editor

### 4. Generate Content

In the editor interface:

1. **View Document Structure**: See all sections/slides on the left sidebar
2. **Generate Content**: Click **"Generate"** button for each section
   - AI creates professional content based on:
     - Section/slide title
     - Project topic
     - Document context
3. **Progress Indicator**: Watch the AI generate content in real-time
4. **Review Content**: Read the generated text in the main panel

### 5. Refine Content Iteratively

For each section/slide, you have several refinement options:

**AI Refinement:**
- Use the text input box to request changes
- Examples of refinement prompts:
  ```
  "Make this more formal and professional"
  "Convert this to bullet points"
  "Shorten to 150 words"
  "Add more technical details"
  "Make it more engaging"
  "Include statistics if relevant"
  ```
- Click **"Refine"** or press Enter
- AI updates the content based on your instruction
- Can refine multiple times until satisfied

**Feedback:**
- Click **👍 Like** if you're satisfied with the content
- Click **👎 Dislike** if it needs improvement
- Feedback is stored for quality tracking

**Comments:**
- Add personal notes or reminders
- Click **"Add Comment"** below the section
- Your comments are saved and visible later

### 6. Export Your Document

Once you're satisfied with all sections:

1. Click the **"Export"** button (top-right corner)
2. Backend assembles your document:
   - For Word: Creates .docx with all sections
   - For PowerPoint: Creates .pptx with all slides
3. File downloads automatically
4. **Format Features**:
   - Professional formatting
   - Proper headers and styling
   - All refined content included
   - Ready to use or further edit in Microsoft Office

### 7. Manage Projects

**Dashboard:**
- View all your projects
- See project type (Word/PowerPoint icon)
- Check last modified date
- Click to open and continue editing
- Delete projects you no longer need

---

## 🔌 API Documentation

### Base URL
- **Local**: `http://localhost:8000`
- **Production**: `http://34.224.28.22:8000`

### Interactive API Docs
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Authentication

All protected endpoints require a Bearer token in the header:

```http
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Projects

```http
# Get all user projects
GET /projects/
Authorization: Bearer <token>

# Create new project
POST /projects/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Document",
  "type": "docx"  // or "pptx"
}

# Get specific project
GET /projects/{project_id}
Authorization: Bearer <token>

# Delete project
DELETE /projects/{project_id}
Authorization: Bearer <token>
```

#### Sections

```http
# Get all sections of a project
GET /projects/{project_id}/sections
Authorization: Bearer <token>

# Create new section
POST /projects/{project_id}/sections
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction",
  "content": "",
  "order_index": 0
}

# Update section
PATCH /projects/{project_id}/sections/{section_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### AI Generation

```http
# Generate AI outline
POST /generate/outline
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "Market Analysis of Electric Vehicles",
  "type": "docx",
  "num_sections": 5
}

# Generate section content
POST /generate/section/{section_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "project_title": "My Document",
  "section_title": "Introduction"
}

# Refine section content
POST /generate/refine/{section_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "instruction": "Make this more formal"
}
```

#### Export

```http
# Export document
GET /export/{project_id}
Authorization: Bearer <token>

# Returns file download (.docx or .pptx)
```

#### Feedback & Comments

```http
# Add like/dislike feedback
POST /projects/sections/{section_id}/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "is_positive": true  // true for like, false for dislike
}

# Add comment
POST /projects/sections/{section_id}/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Remember to add more data here"
}

# Delete comment
DELETE /projects/comments/{comment_id}
Authorization: Bearer <token>
```

---

## 📁 Project Structure

```
NexWrit/
│
├── backend/                        # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── middleware/
│   │   │   └── auth.py            # JWT authentication middleware
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic models
│   │   ├── routers/
│   │   │   ├── auth.py            # Authentication endpoints
│   │   │   ├── projects.py        # Project CRUD operations
│   │   │   ├── generate.py        # AI generation endpoints
│   │   │   └── export.py          # Document export
│   │   └── services/
│   │       ├── supabase_client.py # Supabase connection
│   │       ├── llm_service.py     # Gemini AI integration
│   │       └── doc_gen_service.py # .docx/.pptx generation
│   ├── main.py                    # FastAPI application entry
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Environment variables (gitignored)
│   └── .gitignore
│
├── frontend/                       # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/               # Images, fonts, etc.
│   │   ├── components/           # Reusable components
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Dashboard.jsx     # Projects dashboard
│   │   │   ├── ConfigWizard.jsx  # Document configuration wizard
│   │   │   └── Editor.jsx        # Main editing interface
│   │   ├── AuthContext.jsx       # Authentication state
│   │   ├── api.js                # Axios API client
│   │   ├── supabaseClient.js     # Supabase client setup
│   │   ├── App.jsx               # Root component
│   │   ├── main.jsx              # Application entry
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── package.json              # Node dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # TailwindCSS config
│   ├── vercel.json               # Vercel deployment config
│   ├── .env                      # Environment variables (gitignored)
│   └── .gitignore
│
├── schema.sql                     # Database schema
├── README.md                      # This file
└── .gitignore                    # Global gitignore
```

### Key Files Explained

#### Backend

- **`main.py`**: FastAPI application setup, CORS configuration, router inclusion
- **`auth.py` (router)**: User registration, login, JWT token generation
- **`projects.py` (router)**: CRUD operations for projects and sections
- **`generate.py` (router)**: AI content generation and refinement
- **`export.py` (router)**: Document assembly and export
- **`llm_service.py`**: Gemini AI API integration with prompt engineering
- **`doc_gen_service.py`**: Logic to create .docx and .pptx files

#### Frontend

- **`AuthContext.jsx`**: Global authentication state management
- **`api.js`**: Axios instance with auth interceptors
- **`ConfigWizard.jsx`**: Multi-step form for document configuration
- **`Editor.jsx`**: Main interface for content generation and refinement
- **`Dashboard.jsx`**: Project list and management

---

## 🚀 Deployment

### Backend Deployment (AWS EC2)

The backend is deployed on AWS EC2 (Ubuntu 24.04):

**Deployment Steps:**

1. **Launch EC2 Instance**
   - Instance type: t2.micro (or t2.small for better performance)
   - Ubuntu Server 24.04 LTS
   - Security Group: Open port 8000 for HTTP

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv -y
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/nexwrit.git
   cd nexwrit/backend
   ```

4. **Setup Python Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

5. **Configure Environment**
   ```bash
   nano .env
   # Add all environment variables
   ```

6. **Run with Uvicorn**
   ```bash
   # For testing
   uvicorn main:app --host 0.0.0.0 --port 8000

   # For production (with process manager)
   nohup uvicorn main:app --host 0.0.0.0 --port 8000 &
   ```

7. **Optional: Setup Systemd Service**
   ```bash
   sudo nano /etc/systemd/system/nexwrit.service
   ```
   ```ini
   [Unit]
   Description=NexWrit FastAPI Application
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/nexwrit/backend
   Environment="PATH=/home/ubuntu/nexwrit/backend/venv/bin"
   ExecStart=/home/ubuntu/nexwrit/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000

   [Install]
   WantedBy=multi-user.target
   ```
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start nexwrit
   sudo systemctl enable nexwrit
   ```

**Current Deployment:**
- URL: `http://34.224.28.22:8000`
- API Docs: `http://34.224.28.22:8000/docs`

### Frontend Deployment (Vercel)

The frontend is deployed on Vercel:

**Deployment Steps:**

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Select your GitHub repository

2. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Set Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_KEY=your_supabase_anon_key
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Every push to main branch triggers auto-deployment

**Backend API Proxy (vercel.json):**

The `vercel.json` file configures API proxying:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://34.224.28.22:8000/:path*"
    }
  ]
}
```

**Current Deployment:**
- URL: https://nex-writ.vercel.app
- Automatic HTTPS
- Global CDN
- Auto-deployments from GitHub

---

## 🐛 Troubleshooting

### Backend Issues

#### Import Errors
```bash
# Ensure all dependencies are installed
pip install -r requirements.txt

# If specific package fails
pip install package-name --upgrade
```

#### Supabase Connection Errors
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- Check if Supabase project is active
- Ensure you're using the service_role key, not anon key for backend

#### Gemini API Errors
- Verify `GEMINI_API_KEY` is correct
- Check API quota in Google AI Studio
- Ensure you're using the correct model name

#### Port Already in Use
```bash
# Find process using port 8000
lsof -ti:8000

# Kill the process
kill -9 $(lsof -ti:8000)

# Or use a different port
uvicorn main:app --reload --port 8001
```

#### CORS Errors
- Ensure frontend URL is in CORS allowed origins (main.py)
- For production, add your Vercel URL to allowed origins

### Frontend Issues

#### Blank Page
- Open browser console (F12) for errors
- Check if backend is running
- Verify API URL in `.env`

#### Authentication Not Working
- Verify Supabase credentials match between frontend and backend
- Check if `.env` file exists and is loaded
- Clear browser localStorage and try again

#### API Calls Failing (Network Errors)
- Ensure backend is running on port 8000
- Check if `VITE_API_URL` is correct
- Verify no firewall blocking requests
- Check browser console for CORS issues

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Database Issues

#### RLS Policy Errors
- Ensure RLS policies are correctly set up (see schema.sql)
- Verify user is authenticated
- Check if user_id matches in auth.users

#### Migration Errors
- Drop all tables and re-run schema.sql
- Ensure UUID extension is enabled:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```

### Common Error Messages

| Error | Solution |
|-------|----------|
| `ModuleNotFoundError: No module named 'fastapi'` | Run `pip install -r requirements.txt` |
| `Failed to fetch from Supabase` | Check environment variables and Supabase project status |
| `401 Unauthorized` | Token expired or invalid, log in again |
| `404 Project not found` | Project might be deleted or belongs to different user |
| `Rate limit exceeded (Gemini API)` | Wait or upgrade Gemini API plan |
| `Vite network error` | Check if backend is running |

### Getting Help

If you encounter issues not covered here:

1. Check the [FastAPI Documentation](https://fastapi.tiangolo.com/)
2. Review [Supabase Docs](https://supabase.com/docs)
3. See [Gemini API Guide](https://ai.google.dev/docs)
4. Open an issue on GitHub 

---

## ✅ Assignment Fulfillment

This project fulfills all requirements of the AI-Assisted Document Authoring Platform assignment:

### Functional Requirements

| Requirement | Status | Implementation |
|------------|--------|----------------|
| **1. User Authentication & Project Management** | ✅ Complete | Supabase Auth with JWT, dashboard with all projects |
| **2. Document Configuration** | ✅ Complete | Multi-step wizard for .docx and .pptx configuration |
| **3. AI-Powered Content Generation** | ✅ Complete | Gemini AI generates section-by-section content |
| **4. Interactive Refinement Interface** | ✅ Complete | Natural language prompts, like/dislike, comments |
| **5. Document Export** | ✅ Complete | python-docx and python-pptx generate well-formatted files |
| **Bonus: AI-Generated Templates** | ⭐ Implemented | "AI Suggest" button generates outlines/slide titles |

### Evaluation Criteria

| Criteria | Status | Details |
|----------|--------|---------|
| **Functionality** | ✅ Complete | Full end-to-end flow works: Login → Configure → Generate → Refine → Export |
| **AI Integration** | ✅ Complete | Gemini API used for generation, refinement, and template suggestions |
| **User Experience** | ✅ Complete | Modern dark UI, responsive design, smooth animations |
| **Output Quality** | ✅ Complete | Professional .docx and .pptx files, well-formatted |
| **Code Quality** | ✅ Complete | Clean, modular code with logical folder structure |
| **Documentation** | ✅ Complete | Comprehensive README with setup, usage, and deployment |

### Technology Requirements

| Requirement | Technology Used |
|------------|-----------------|
| **Backend Framework** | FastAPI ✅ |
| **Database** | Supabase (PostgreSQL) ✅ |
| **Authentication** | Supabase Auth with JWT ✅ |
| **LLM** | Google Gemini API ✅ |
| **Document Generation** | python-docx, python-pptx ✅ |
| **Frontend** | React + Vite ✅ |
| **Styling** | TailwindCSS ✅ |



## 📝 License

This project is for **educational purposes** as part of an assignment to demonstrate full-stack development skills with AI integration.

**Technologies Used:**
- FastAPI (MIT License)
- React (MIT License)
- Supabase (Apache License 2.0)
- Google Gemini API (Google API Terms)
- python-docx (MIT License)
- python-pptx (MIT License)

---

## 👨‍💻 Author

**Shubham Gangwar**  
Email: shubhamgangwar244@gmail.com


Created as a comprehensive demonstration of:
- Full-stack web development
- AI integration with LLMs
- Modern React development
- RESTful API design
- Database management
- Cloud deployment
- Document processing

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI capabilities
- **Supabase** for excellent backend infrastructure
- **FastAPI** for the amazing Python web framework
- **React** and **Vite** for modern frontend development
- **TailwindCSS** for beautiful, utility-first styling
- **Vercel** and **AWS** for reliable hosting

---

## 🔗 Important Links

- **Live Application**: https://nex-writ.vercel.app
- **Backend API**: http://34.224.28.22:8000
- **API Documentation**: http://34.224.28.22:8000/docs


---

<div align="center">

**Made with ❤️ for AI-Powered Document Generation**

[⬆ Back to Top](#nexwrit---ai-assisted-document-authoring-platform)

</div>
