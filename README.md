# Agent List Manager

A MERN stack application for managing agents and distributing contact lists.

## Live demo [https://adminpanel-rakeshpg-1.onrender.com]
## Features

- Admin User Authentication
- Agent creation and management
- List upload (CSV, XLS, XLSX) and automatic distribution
- Dashboard with statistics and analytics
- Responsive design for all devices

## Tech Stack

- **Frontend**: React with TypeScript, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Project Structure

The project follows a client-server architecture:

- `src/` - Frontend React application
- `server/` - Backend Node.js/Express application

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/agent-list-manager
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

### Installation and Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Seed the admin user:

   ```
   # Make a POST request to /api/auth/seed-admin
   # Default admin credentials:
   # Email: admin@example.com
   # Password: admin123
   ```

3. Start the development server:
   ```
   # Start both frontend and backend in development mode
   npm run dev
   # Start backend only
   npm run server
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user info

### Agents

- `POST /api/agents` - Create a new agent
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get agent by ID
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `GET /api/agents/:id/assigned-items` - Get agent's assigned items

### Lists

- `POST /api/lists/upload` - Upload and distribute a list
- `GET /api/lists` - Get all distributed lists
- `GET /api/lists/agent/:agentId` - Get lists assigned to an agent

## File Upload Format

The system accepts CSV, XLS, and XLSX files with the following columns:

- `FirstName` - Text field for the person's first name
- `Phone` - Number field for the contact phone number
- `Notes` - Text field for any additional information

## Distribution Logic

The system automatically distributes list items equally among all agents. If the total number of items is not divisible equally, the remaining items will be distributed sequentially.
