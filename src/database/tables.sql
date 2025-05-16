DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS sets;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS rounds;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS tournaments;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('official', 'admin'))
);

CREATE TABLE tournaments (
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'Future',
    description TEXT
);

CREATE TABLE teams (
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    rank INT,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE participants (
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tournament_id BIGINT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id BIGINT NOT NULL REFERENCES teams(id)
);

CREATE TABLE rounds (
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tournament_id BIGINT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE games (
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    round_id BIGINT NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    par1_id BIGINT REFERENCES participants(id),
    par2_id BIGINT REFERENCES participants(id),
    winner_id BIGINT REFERENCES participants(id),
    time TIME
);

CREATE TABLE sets (                 --store or calculate winner?
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    points1 INT,
    points2 INT
);

CREATE TABLE players (
    id serial PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    team_id BIGINT NOT NULL REFERENCES teams(id),
    name VARCHAR(255) NOT NULL,
    number INT NULL,
    position VARCHAR(255) NOT NULL,
    height_feet INT NULL,
    height_inches INT NULL,
    age INT,
    image VARCHAR(255)
);
