#!/usr/bin/env bash

#########################################
# Lost/Found App Setup Script
# Run each command in your terminal.
# Comments start with “#”.
#########################################

# 1. Clone the repository
git clone https://github.com/<your-username>/lost-found-app.git
cd lost-found-app

# 2. Create a .gitignore (if not already present)
cat << 'EOF' > .gitignore
node_modules/
backend/node_modules/
frontend/node_modules/
frontend/build/
.env
uploads/
*.log
EOF

# 3. Database Setup

## 3.1. (Windows) Set postgres password if not set / unknown
# Open “SQL Shell (psql)” and run:
#   ALTER ROLE postgres WITH LOGIN PASSWORD 'YourNewStrongPassword';
#   \q

## 3.2. Create the `lostfound` database
# If `createdb` is in PATH:
createdb -U postgres -h localhost -W lostfound
# When prompted, enter YourNewStrongPassword.

# If `createdb` not found, navigate to PostgreSQL bin (example path):
# cd "C:\Program Files\PostgreSQL\<version>\bin"
# ./createdb.exe -U postgres -h localhost -W lostfound

## 3.3. Initialize Tables

# A) For fresh database:
psql -U postgres -h localhost -W -d lostfound -f backend/db_init.sql

# or B) If tables exist and you only need image columns:
psql -U postgres -h localhost -W -d lostfound -f backend/db_alter_add_image.sql

#########################################
# 4. Backend Setup
#########################################

cd backend

# 4.1. Create .env
cat << 'EOF' > .env
PORT=5000
DATABASE_URL=postgresql://postgres:YourNewStrongPassword@localhost:5432/lostfound
JWT_SECRET=someRandomJWTsecret
EOF
# Replace “YourNewStrongPassword” and “someRandomJWTsecret” accordingly.

# 4.2. Install dependencies
npm install

# 4.3. Ensure uploads/ folder exists
mkdir -p uploads

# 4.4. Start the backend server
npm run start
# You should see:
#   Connected to PostgreSQL
#   Server listening on port 5000

#########################################
# 5. Frontend Setup
#########################################

cd ../frontend

# 5.1. Install dependencies
npm install

# 5.2. If using Node 17+ and encountering OpenSSL errors:
# In Command Prompt:
#   set NODE_OPTIONS=--openssl-legacy-provider
#   npm start
# In PowerShell:
#   $env:NODE_OPTIONS="--openssl-legacy-provider"
#   npm start
# Alternatively, modify package.json “start” script as follows:
#   "scripts": {
#     "start": "set \"NODE_OPTIONS=--openssl-legacy-provider\"&& react-scripts start",
#     "build": "react-scripts build",
#     "test": "react-scripts test",
#     "eject": "react-scripts eject"
#   }

# 5.3. Start the React development server
npm start
# The app should open at http://localhost:3000

#########################################
# 6. Running the Application
#########################################

# 6.1. In one terminal: (already in frontend)
#     npm start

# 6.2. In another terminal: run backend again if needed
# cd lost-found-app/backend
# npm run start

#########################################
# 7. Usage Guide
#########################################

: '
1. Register a New User:
   - Click “Register” in the navbar.
   - Enter College ID, Email, Password.
   - On success, redirected to “Lost Items”.

2. Log In:
   - Click “Login” and sign in with College ID and Password.

3. Report Lost Items:
   - Navigate to “Lost Items”.
   - Fill Title, Description, Date Lost, Location, and optional Image.
   - Submit → appears under “All Lost Items” and “My Lost Items”.

4. Report Found Items:
   - Navigate to “Found Items”.
   - Fill Title, Description, Date Found, Location, and optional Image.
   - Submit → appears under “All Found Items” and “My Found Items”.

5. View & Filter Reports:
   - Use the search box to filter by title or location.
   - Uploaded image thumbnails appear if provided.

6. Contact Reporter/Finder:
   - Click “Contact Reporter” or “Contact Finder” to open mail client.

7. Admin Dashboard:
   - Grant admin rights in DB (psql -U postgres ...):
       UPDATE users SET is_admin = TRUE WHERE college_id = '<your_college_id>';
   - Log in as that user and click “Admin” in navbar.
   - View all users, lost items (with reporter email), and found items (with finder email).
'

#########################################
# 8. Troubleshooting
#########################################

: '
- ERR_OSSL_EVP_UNSUPPORTED when starting React:
   Use NODE_OPTIONS=--openssl-legacy-provider as shown above.

- “password authentication failed” for Postgres:
   Verify .env DATABASE_URL is correct.
   Test manual login:
     psql -U postgres -h localhost -W lostfound

- createdb not found:
   Navigate to Postgres bin folder:
     cd "C:\Program Files\PostgreSQL\<version>\bin"
     ./createdb.exe -U postgres -h localhost -W lostfound

- Uploads folder missing or images 404:
   Ensure backend/uploads/ exists.
   Verify Express serving static:
     app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

- SQL migration permission errors:
   Run psql as postgres user:
     psql -U postgres -h localhost -W -d lostfound -f backend/db_init.sql
   Ensure postgres owns the database:
     ALTER DATABASE lostfound OWNER TO postgres;
'

#########################################
# End of Script
#########################################
