-- Initialize Wood Panel Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if not exists (already created by POSTGRES_DB env var)
-- CREATE DATABASE IF NOT EXISTS woodpanel_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create initial admin user (password: admin123)
-- This will be handled by the application migration scripts

-- Set timezone
SET timezone = 'UTC';

-- Create indexes for better performance (will be created by Drizzle migrations)
-- These are just examples, actual indexes will be created by the ORM

COMMENT ON DATABASE woodpanel_db IS 'Wood Panel Admin Dashboard Database';

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Wood Panel Database initialized successfully';
END $$;
