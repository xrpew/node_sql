CREATE DATABASE test;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    documento VARCHAR(20) UNIQUE,
    fecha_inicio DATE,
    fecha_pago DATE,
    plan VARCHAR(50)
);

CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY,
    documento VARCHAR(20),
    fecha_asistencia TIMESTAMP,
    FOREIGN KEY (documento) REFERENCES usuarios(documento)
);

INSERT INTO usuarios (nombre, documento, fecha_inicio, fecha_pago, plan)
VALUES ('Sergio Pérez', '12345678', '2023-08-01', '2023-08-15', 'Básico');


INSERT INTO usuarios (nombre, documento, fecha_inicio, fecha_pago, plan)
VALUES ('Gabriela Marquez', '123123', '2023-08-11', '2023-08-25', 'Premium');


INSERT INTO asistencias (documento, fecha_asistencia)
VALUES ('12345678', NOW());
