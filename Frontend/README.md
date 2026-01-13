# Notes Dashboard Web App

## Overview

This is a **React.js + Node.js/MongoDB** web application for managing personal notes.  
It includes **authentication, CRUD operations, search/filter, profile display**, and a polished UI.  

This project was developed as a **Frontend Developer Intern Assignment**.

---

## Features

### Authentication
- Register new user  
- Login existing user  
- JWT-based authentication  
- Logout functionality  

### Dashboard
- Displays logged-in user profile  
- Add / Edit / Delete notes  
- Mark notes as favorite  
- Copy note content to clipboard  
- Search notes by title or content  
- Responsive and clean UI  

### Security
- Passwords hashed with bcrypt  
- Protected routes using JWT  
- Error handling for invalid requests  

---

## Backend (Node.js + Express + MongoDB)

### API Endpoints

#### Auth
- `POST /api/auth/register` → Register new user  
- `POST /api/auth/login` → Login and get JWT token  

#### Profile
- `GET /api/profile` → Get logged-in user profile (requires JWT)  

#### Notes
- `GET /api/notes` → Get all notes  
- `POST /api/notes` → Add new note  
- `PUT /api/notes/:id` → Update note  
- `DELETE /api/notes/:id` → Delete note  
- **All notes routes require JWT token**  

---

## Frontend (React.js)

### Pages
- `Login.js` → Login page  
- `Register.js` → Register page  
- `Dashboard.js` → Main dashboard with notes  
- `CreateNote.js` → Add/Edit notes  

### Features
- Notes grid layout  
- Buttons for edit, delete, copy, favorite  
- Search bar for filtering notes  
- Logout button  

---

## Setup Instructions

### Backend
1. Go to backend folder:  
cd backend

2. Install dependencies:

npm install

3. Create .env file:
PORT=5000
MONGO_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_secret_key


4. Start backend server:
node server.js

### Frontend
1. Go to frontend folder:
cd frontend


2. Install dependencies:
npm install


3. Start frontend server:
npm start


4. Open browser → http://localhost:3000

### How to Test APIs (Postman)
1. Login → POST http://localhost:5000/api/auth/login → get JWT token

Use Authorization header for protected routes:

Authorization: Bearer <token>

2. Test /api/profile and /api/notes endpoints

### Project Structure
notes-dashboard/
  frontend/
    src/
      pages/
      components/
      services/
      App.jsx
      index.js
    package.json
  backend/
    routes/
    models/
    middleware/
    index.js
    package.json
    .env

Author
Avanshika Singh
Frontend Developer Intern Assignment Submission

