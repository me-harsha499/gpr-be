# Consultation Backend

Node.js/Express backend for managing interior design consultations with PostgreSQL database.

## Features

- 🔐 JWT Authentication for admin access
- 📝 CRUD operations for consultations
- 🗄️ PostgreSQL database with Neon hosting
- 🔒 CORS enabled for frontend communication
- 📊 Admin dashboard integration


## Setup Instructions

### 1. Install Dependencies

```bash
cd consultation-backend
npm install
```

### 2. Database Setup

The database connection is already configured in `.env`. Run the SQL schema:

```bash
# Connect to your PostgreSQL database and run:
psql -d "postgresql://neondb_owner:npg_X4NmbdrO1Jhu@ep-withered-snow-ae41oqj5-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" -f init-db.sql
```

Or copy the contents of `init-db.sql` and run them in your database client.

### 3. Environment Variables

Your `.env` file is already configured with:

```
PORT=3001
DATABASE_URL="postgresql://neondb_owner:npg_X4NmbdrO1Jhu@ep-withered-snow-ae41oqj5-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_ACCESS_SECRET="91f7f7bfdf24c2914ae295640148e590"
JWT_REFRESH_SECRET="c52ff3f66a08fd157a9532239a9d2c9c"
ADMIN_USERNAME="Admin@example.com"
ADMIN_PASSWORD_HASH="$2a$10$on76TmJ/JMLR60kjF2kJkOtw7vqtkXJywgGCBYTIaKp4O7Kxbbqnq"
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `POST /api/consultations/create` - Create new consultation (no auth required)

### Admin Endpoints (require JWT token)
- `POST /api/auth/login` - Admin login
- `GET /api/consultations` - Get all consultations
- `GET /api/consultations/:id` - Get single consultation
- `PATCH /api/consultations/:id` - Update consultation

## Admin Credentials

- **Username**: Admin@example.com
- **Password**: Admin@123 (hashed in .env)

## Database Schema

The `consultations` table includes:

**Customer Information:**
- name, phone, email, city, address
- property_type, room_type, budget
- time_slot, consultation_date, message

**Admin Tracking:**
- last_call, next_call, call_status_message
- customer_visited, visited_date, project_status
- created_at, updated_at (auto-managed)

## Frontend Integration

The frontend (Next.js) connects to this backend via the API client in `/lib/api.ts`:

- Customer consultation form → `POST /api/consultations/create`
- Admin dashboard → Login + consultation management

## Development Notes

- CORS is configured for `localhost:3000` (Next.js default)
- JWT tokens expire in 15 minutes (access) / 7 days (refresh)
- Database connection uses SSL with Neon PostgreSQL
- All admin routes are protected with Bearer token authentication
