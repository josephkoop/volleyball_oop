DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS sets;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS rounds;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS tournaments;

CREATE TABLE tournaments (
    id serial PRIMARY KEY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'Future',
    description TEXT
);

CREATE TABLE teams (
    id serial PRIMARY KEY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    rank INT,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE rounds (
    id serial PRIMARY KEY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    tournament_id BIGINT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE games (
    id serial PRIMARY KEY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    round_id BIGINT NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    team1_id BIGINT NOT NULL REFERENCES teams(id),
    team2_id BIGINT NOT NULL REFERENCES teams(id),
    winner_id BIGINT NOT NULL REFERENCES teams(id),
    time TIME NOT NULL
);

CREATE TABLE sets (                 --store or calculate winner?
    id serial PRIMARY KEY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    game_id BIGINT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    points1 INT NOT NULL,
    points2 INT NOT NULL
);

CREATE TABLE players (
    id serial PRIMARY KEY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    team_id BIGINT NOT NULL REFERENCES teams(id),
    name VARCHAR(255) NOT NULL,
    number INT NULL,
    position VARCHAR(255) NOT NULL,
    height_feet INT NULL,
    height_inches INT NULL,
    age INT,
    image VARCHAR(255)
);

CREATE TABLE participants (
    id serial PRIMARY KEY,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    tournament_id BIGINT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id BIGINT NOT NULL REFERENCES teams(id)
);
