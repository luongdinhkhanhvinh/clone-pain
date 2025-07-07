# Dependencies Installation

## Frontend Dependencies
```bash
npm install @tanstack/react-table @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install lucide-react date-fns
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-toast @radix-ui/react-select
```

## Backend Dependencies
```bash
npm install express cors helmet morgan
npm install drizzle-orm drizzle-kit
npm install postgres pg @types/pg
npm install bcryptjs jsonwebtoken
npm install multer @types/multer
npm install dotenv
npm install @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
```

## Database Setup
```bash
# Create .env file
DATABASE_URL=postgresql://username:password@localhost:5432/woodpanel_db
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```
