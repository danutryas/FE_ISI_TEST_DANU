CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- USERS
INSERT INTO users (id, email, name ,password, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'test@test.com','test1', crypt('test1234', gen_salt('bf')), 'lead'),
  ('22222222-2222-2222-2222-222222222222', 'team1@example.com','test2', crypt('hashed_password2', gen_salt('bf')), 'team'),
  ('33333333-3333-3333-3333-333333333333', 'team2@example.com','test3', crypt('hashed_password3', gen_salt('bf')), 'team');

-- TASKS
INSERT INTO tasks (id, title, description, status, created_by, updated_by)
VALUES 
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Design Homepage', 'Create a responsive homepage', 'Not Started', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Build API', 'Develop authentication endpoints', 'On Progress', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222');

