DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

--Creación de la tabla de usuarios

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Creación de la tabla de tareas

CREATE TABLE tasks (
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(200) NOT NULL,
    description    TEXT,
    status         VARCHAR(20)  NOT NULL DEFAULT 'pendiente'
                       CHECK (status IN ('pendiente', 'completada')),
    priority       VARCHAR(10)  NOT NULL DEFAULT 'media'
                       CHECK (priority IN ('alta', 'media', 'baja')),
    fecha_creacion TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    id_usuario     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE
);


CREATE INDEX idx_tasks_id_usuario ON tasks(id_usuario);
CREATE INDEX idx_tasks_status     ON tasks(status);
CREATE INDEX idx_tasks_priority   ON tasks(priority);

-- Usuario de prueba (User:prueba, password: "demo1234")
INSERT INTO users (username, email, password_hash) VALUES (
    'prueba',
    'prueba@gmail.com',
    '$2a$12$PN4OLWGy0g12cybbaMhdnuTubrdKOUkae7Hps4X/MOl/ke.CD87Im'
);
