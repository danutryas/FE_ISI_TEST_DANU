DROP TABLE IF EXISTS task_assignments CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS logs CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('lead', 'team')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Not Started'
        CHECK (status IN ('Not Started', 'On Progress', 'Done', 'Reject')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(task_id, user_id)
);

CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('INSERT', 'UPDATE', 'DELETE')),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger Action
CREATE OR REPLACE FUNCTION log_users_changes() RETURNS TRIGGER AS $$
BEGIN
    -- Log insert
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO logs (action_type, table_name, record_id, new_data)
        VALUES ('INSERT', 'users', NEW.id, to_jsonb(NEW));

    -- Log update
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO logs (action_type, table_name, record_id, old_data, new_data)
        VALUES ('UPDATE', 'users', NEW.id, to_jsonb(OLD), to_jsonb(NEW));

    -- Log delete
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO logs (action_type, table_name, record_id, old_data)
        VALUES ('DELETE', 'users', OLD.id, to_jsonb(OLD));
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT operation on 'users' table
CREATE TRIGGER log_users_insert
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION log_users_changes();

-- Trigger for UPDATE operation on 'users' table
CREATE TRIGGER log_users_update
AFTER UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION log_users_changes();

-- Trigger for DELETE operation on 'users' table
CREATE TRIGGER log_users_delete
AFTER DELETE ON users
FOR EACH ROW EXECUTE FUNCTION log_users_changes();


CREATE OR REPLACE FUNCTION log_tasks_and_assignments() RETURNS TRIGGER AS $$
DECLARE
    changer UUID := NULL;
BEGIN
    IF TG_OP = 'INSERT' THEN
        changer := NEW.updated_by;
        INSERT INTO logs (action_type, table_name, record_id, new_data, changed_by)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW), changer);

    ELSIF TG_OP = 'UPDATE' THEN
        changer := COALESCE(NEW.updated_by, OLD.updated_by);
        INSERT INTO logs (action_type, table_name, record_id, old_data, new_data, changed_by)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW), changer);

    ELSIF TG_OP = 'DELETE' THEN
        changer := OLD.updated_by;
        INSERT INTO logs (action_type, table_name, record_id, old_data, changed_by)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD), changer);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- tasks
-- INSERT
CREATE TRIGGER log_tasks_insert
AFTER INSERT ON tasks
FOR EACH ROW EXECUTE FUNCTION log_tasks_and_assignments();

-- UPDATE
CREATE TRIGGER log_tasks_update
AFTER UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION log_tasks_and_assignments();

-- DELETE
CREATE TRIGGER log_tasks_delete
AFTER DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION log_tasks_and_assignments();

-- assignment
-- INSERT
CREATE TRIGGER log_task_assignments_insert
AFTER INSERT ON task_assignments
FOR EACH ROW EXECUTE FUNCTION log_tasks_and_assignments();

-- UPDATE
CREATE TRIGGER log_task_assignments_update
AFTER UPDATE ON task_assignments
FOR EACH ROW EXECUTE FUNCTION log_tasks_and_assignments();

-- DELETE
CREATE TRIGGER log_task_assignments_delete
AFTER DELETE ON task_assignments
FOR EACH ROW EXECUTE FUNCTION log_tasks_and_assignments();
