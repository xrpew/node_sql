CREATE DATABASE test;

CREATE TABLE  users(
    id SERIAL PRIMARY  KEY,
    name VARCHAR(50),
    enail TEXT
);

INSERT INTO user(name, email) VALUES
    ('Sergio', 'sergio@mail.com'),
    ('Gabriela', 'gaby@mail.com')