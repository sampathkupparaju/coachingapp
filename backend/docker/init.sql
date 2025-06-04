-- docker/init.sql

-- 1) Create the database (if it doesn’t already exist)
--    (Postgres init scripts only run on first container startup)
CREATE DATABASE tutoring_db
  WITH OWNER = postgres    -- or any superuser
       ENCODING = 'UTF8'
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE   = 'en_US.UTF-8'
       TEMPLATE = template0;

-- 2) Create the role/user with password (if not exists)
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT 1
      FROM pg_catalog.pg_roles
      WHERE rolname = 'tutor_user'
   ) THEN
      CREATE ROLE tutor_user WITH LOGIN PASSWORD 'StrongP@ssw0rd';
   END IF;
END
$$;

-- 3) Grant privileges on the database
GRANT ALL PRIVILEGES ON DATABASE tutoring_db TO tutor_user;
