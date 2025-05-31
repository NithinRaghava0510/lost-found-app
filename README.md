# Lost/Found App

## Description

The Lost/Found App is a full-stack web application that allows users to register and log in, then report lost items or found items (with optional image uploads). Users can view, filter, and contact the reporter or finder via email. Administrators have a dedicated dashboard to view all users and all reports.

Built with:
- **Frontend:** React.js, React Router, Axios, Bootstrap  
- **Backend:** Node.js, Express.js, JSON Web Tokens, Multer (for file uploads)  
- **Database:** PostgreSQL  

---

## Prerequisites

- Node.js (v16 or newer) & npm  
- PostgreSQL (installed and running locally)  
- Git  

---

## Steps to Clone and Execute

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/lost-found-app.git
   cd lost-found-app

2. **Backend Setup**
   1. Navigate to the Backend Folder
   2. Create a .env file with the following contents (adjust the password and secrets as needed):
      ```ini
      PORT=5000
      DATABASE_URL=postgresql://postgres:<POSTGRES_PASSWORD>@localhost:5432/lostfound
      JWT_SECRET=<your_jwt_secret>
   3. Install Dependencies:
      ```bash
      npm install
   4. Ensure the uploads/ folder exists (Multer will auto-create on first upload, but you can create it now):
      ```bash
      mkdir uploads
   5. Create and initialize the PostgreSQL database:
      * Open a terminal or psql shell and run:
        ```sql
        CREATE DATABASE lostfound OWNER postgres;
      * Back in the backend/ directory, run:
        ```bash
        psql -U postgres -h localhost -W -d lostfound -f db_init.sql
   6. Start the backend server:
      ```bash
      npm run start
   You should see:
   ```bash
   Server listening on port 5000

3. **Frontend Setup**
   1. Open a new terminal and navigate to the frontend folder
   2. Install dependencies:
      ```bash
      npm install
   3. Start the frontend development server:
      ```bash
      npm start
The app should open at http://localhost:3000

**Usage**
- Register a new account with College ID, Email, and Password.
- Log in using your College ID and Password.
- Report Lost Items: fill in Title, Description, Date Lost, Location, and optional Image.
- Report Found Items: fill in Title, Description, Date Found, Location, and optional Image.
- View & Filter all reports by title or location.
- Contact the reporter or finder via the provided email link.

   

