-- 1) Create the database if it doesn’t exist:
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT 1
      FROM pg_database
      WHERE datname = 'tutoring_db'
   ) THEN
      CREATE DATABASE tutoring_db;
   END IF;
END
$$;

-- 2) Create or alter the tutor_user role with the exact password Spring Boot expects:
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'tutor_user'
   ) THEN
      CREATE ROLE tutor_user WITH LOGIN PASSWORD 'StrongP@ssw0rd';
   ELSE
      ALTER ROLE tutor_user WITH PASSWORD 'StrongP@ssw0rd';
   END IF;
END
$$;

-- 3) Grant ALL PRIVILEGES on the database to tutor_user
GRANT ALL PRIVILEGES
  ON DATABASE tutoring_db
  TO tutor_user;

-- 4) Connect to tutoring_db, then make tutor_user the owner of the public schema:
\connect tutoring_db

ALTER SCHEMA public OWNER TO tutor_user;
GRANT ALL ON SCHEMA public TO tutor_user;
