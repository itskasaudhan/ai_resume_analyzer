# 📄 ResuMate — AI Resume Analyzer

ResuMate is a full-stack AI-powered resume analysis platform that helps job seekers analyze their resumes, identify areas for improvement, and compare their resumes with specific job descriptions.

The application uses AI to evaluate resume content and provide actionable feedback related to ATS compatibility, keywords, skills, and resume structure.

## 🚀 Features

- 📄 **Resume Analysis**
  - Upload and analyze resumes
  - Extract relevant resume information
  - Generate AI-powered feedback

- 📊 **ATS Resume Scoring**
  - Analyze resume content for ATS compatibility
  - Identify potential improvements
  - Provide an overall resume score

- 🔍 **Job Description Matcher**
  - Compare a resume against a job description
  - Identify matching keywords and skills
  - Highlight missing skills and keywords
  - Generate recommendations for improving the resume

- 🤖 **AI-Powered Analysis**
  - Uses Groq API for AI-based resume analysis
  - Generates personalized suggestions based on resume content

- 🔐 **Authentication**
  - JWT-based authentication
  - Secure password hashing using bcrypt
  - Protected application routes

- 🗄️ **Database**
  - MongoDB for storing user and application data
  - Mongoose for database interaction

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- Vite
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Bcrypt

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### AI

- Groq API

### Tools

- Git
- GitHub
- Postman

## 📁 Project Structure

```text
ai_resume_analyzer/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas account
- Git
- Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/itskasaudhan/ai_resume_analyzer.git
```

```bash
cd ai_resume_analyzer
```

## 💻 Frontend Setup

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

## 🖥️ Backend Setup

Open another terminal and navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

If your `package.json` uses a different development command, use the command defined in the project.

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
```

> Never commit your `.env` file or expose API keys and authentication secrets publicly.

## 🔄 How It Works

```text
                User
                  │
                  ▼
          React Frontend
                  │
                  ▼
          Express REST API
             │          │
             │          └──────────────► MongoDB
             │
             ▼
           Groq API
             │
             ▼
      AI Resume Analysis
             │
       ┌─────┴──────┐
       ▼            ▼
   ATS Score    Suggestions
       │            │
       └─────┬──────┘
             ▼
       User Dashboard
```

## 🧠 AI Resume Analysis

The application processes resume information and uses the Groq API to generate AI-powered analysis.

The analysis can provide:

- Resume scoring
- Resume improvement suggestions
- Keyword recommendations
- Skill analysis
- Structural feedback

## 🔍 Job Description Matching

One of the main features of ResuMate is the Job Description Matcher.

Users can provide a job description and compare it with their resume.

The application identifies:

- Matching skills
- Relevant keywords
- Missing skills
- Missing keywords
- Areas that can be improved

This helps users tailor their resumes for specific job opportunities.

## 🔐 Authentication

ResuMate uses JWT-based authentication to protect user-specific functionality.

Security-related technologies include:

- JSON Web Tokens (JWT)
- bcrypt password hashing
- Protected API routes
- Environment variables for sensitive configuration

## 🗄️ Database

MongoDB is used as the application's database, with Mongoose providing the object modeling layer.

The database is used to manage application and user-related data.



```

## 🎯 Use Cases

ResuMate can be useful for:

- Students preparing for placements
- Freshers applying for jobs
- Developers applying for technical roles
- Job seekers improving their resumes
- Candidates tailoring resumes to specific job descriptions

## 🌱 Future Improvements

- [ ] Resume templates
- [ ] Resume PDF generation
- [ ] More detailed ATS analysis
- [ ] Job recommendation system
- [ ] Resume version management
- [ ] More detailed skill-gap analysis
- [ ] AI-generated resume improvements
- [ ] Support for multiple resume formats

## 🌐 Project

**GitHub:**  
https://github.com/itskasaudhan/ai_resume_analyzer

## 👨‍💻 Author

**Pawan Kumar Kasaudhan**

Full Stack Developer | MERN Stack

- GitHub: https://github.com/itskasaudhan
- LinkedIn: https://www.linkedin.com/in/pawan-kasaudhan-b0ba09343/

---

⭐ If you find this project useful, consider giving the repository a star!
```

