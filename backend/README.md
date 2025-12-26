# FinEdge Backend - Spring Boot

Spring Boot backend for FinEdge Banking and Loan Management Platform.

## Technology Stack

- **Spring Boot 3.2.0** - Main framework
- **Java 17** - Programming language
- **Spring Data JPA** - Database access layer
- **Spring Security** - Authentication and authorization
- **PostgreSQL** - Database
- **Maven** - Build tool

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL database
- DATABASE_URL environment variable set

## Setup

1. **Configure Database**
   - Set `DATABASE_URL` environment variable
   - Format: `jdbc:postgresql://host:port/database`
   - Or set `DB_USERNAME` and `DB_PASSWORD` separately

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   Or run the JAR:
   ```bash
   java -jar target/finedge-backend-1.0.0.jar
   ```

## Configuration

Edit `src/main/resources/application.properties` to configure:
- Database connection
- Server port (default: 5000)
- CORS settings
- Session management

## API Endpoints

All endpoints are prefixed with `/api`:

- **Health**: `/api/health`, `/api/ready`, `/api/live`
- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Accounts**: `/api/accounts/*`
- **Transactions**: `/api/transactions/*`
- **Loans**: `/api/loans/*`, `/api/loan-applications/*`
- **Notifications**: `/api/notifications/*`
- **Analytics**: `/api/analytics/*`

## Project Structure

```
backend/
├── src/main/java/com/finedge/
│   ├── FinEdgeApplication.java
│   ├── config/          # Configuration classes
│   ├── model/           # JPA entities
│   ├── repository/      # Data access layer
│   ├── service/         # Business logic
│   ├── controller/      # REST controllers
│   ├── dto/             # Data transfer objects
│   └── exception/       # Exception handling
└── src/main/resources/
    └── application.properties
```

## Database

The application uses the same PostgreSQL database as the Node.js backend. JPA will automatically create/update tables based on entity definitions.

### Seed Data

The project includes a `data.sql` file with realistic mock data for development and testing:

- **Location**: `src/main/resources/data.sql`
- **Auto-execution**: Enabled by default via `spring.sql.init.mode=always`
- **Default Password**: All users have password `password123` (BCrypt hashed)

**Test Accounts:**
- Admin: `admin@finedge.com` / `password123`
- Banker: `banker1@finedge.com` / `password123`
- Customer: `john.doe@email.com` / `password123`

**Note**: After the first run, consider changing `spring.sql.init.mode=never` in `application.properties` to prevent duplicate data on subsequent restarts.

## Security

- Session-based authentication
- Role-based authorization (CUSTOMER, BANKER, ADMIN)
- BCrypt password hashing
- CORS enabled for frontend

## Development

Run in development mode:
```bash
mvn spring-boot:run
```

The application will start on port 5000 (or PORT environment variable).

