TRUNCATE TABLE tournaments, teams, rounds, games, sets, players, participants RESTART IDENTITY CASCADE;

-- INSERT INTO users (username, password, role) VALUES ('Admin', 'password', 'admin'),

-- Inserting data into the 'tournaments' table
INSERT INTO tournaments (name, venue, start_date, end_date, organizer, contact, status, description)
VALUES
    ('2024 Nationals', 'Countryside Park, Spanish Lookout', '2024-02-15', '2024-02-17', 'John Johnson', '000-0000', 'Finished', '12 teams competed in Belize\s biggest tournament.'),
    ('Spanish Lookout League Fall 2024', 'Countryside Park, Spanish Lookout', '2024-08-15', '2024-10-15', 'Brad Bradley', '000-0000', 'Finished', 'Spanish Lookout League.'),
    ('Belize City Clash', 'Belize City', '2024-12-15', '2024-12-15', 'Random Y', '000-0000', 'Finished', 'Blah blah blah.'),
    ('Dangriga Battle', 'Russel Stadium, Dangriga', '2024-02-07', '2024-02-07', 'Random X', '000-0000', 'Ongoing', 'Blah blah blah.'),
    ('Benque Championship', 'Benque', '2024-06-30', '2024-06-30', 'Random Z', '000-0000', 'Future', 'Blah blah blah.'),
    ('2025 Nationals', 'Countryside Park, Spanish Lookout', '2024-08-25', '2024-08-27', 'Tom Thomas', '000-0000', 'Future', '12 teams competing in Belize\s biggest tournament.');



-- Inserting data into the 'teams' table
INSERT INTO teams (rank, name, location) VALUES
    (9, 'Rednex B', 'Spanish Lookout'),
    (1, 'EA Warriors', 'Belize City'),
    (8, 'Alpha Warriors', 'Belize City'),
    (7, 'EA Warriors Junior', 'Belize City'),
    (2, 'Assassins', 'Toledo'),
    (4, 'Rednex A', 'Spanish Lookout'),
    (3, 'T-Sharp', 'Toledo'),
    (5, 'Jaguars', 'Belize City'),
    (12, 'Jaguars B', 'Belize City'),
    (6, 'UB', 'Belmopan'),
    (10, 'Dragons', 'Belize City'),
    (11, 'Shockwave', 'Spanish Lookout'),
    (NULL, 'Sharks', 'San Pedro'), -- Rank is empty, so it is set to NULL
    (NULL, 'Eagles', 'Belmopan'); -- Rank is empty, so it is set to NULL



INSERT INTO participants (tournament_id, team_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (1, 6),
    (1, 7),
    (1, 8),
    (1, 9),
    (1, 10),
    (1, 11),
    (1, 12),

    (2, 1),
    (2, 6),
    (2, 7),
    (2, 8),
    (2, 12),
    (2, 14),

    (3, 2),
    (3, 3),
    (3, 4),
    (3, 5);



-- Inserting data into the 'rounds' table
INSERT INTO rounds (tournament_id, name) VALUES
    (1, 'Round 1'),
    (1, 'Round 2'),
    (1, 'Round 3'),
    (1, 'Quarter Finals'),
    (1, 'Semi Finals'),
    (1, 'Finals'),

    (2, 'Round 1'),
    (2, 'Round 2'),
    (2, 'Round 3'),
    (2, 'Round 4'),
    (2, 'Round 5'),
    (2, 'Semi Finals'),
    (2, 'Finals'),

    (3, 'Semi Finals'),
    (3, 'Finals');



-- Inserting data into the 'games' table
INSERT INTO games (round_id, par1_id, par2_id, winner_id, time) VALUES
    (1, 1, 3, 3, '7:00'),
    (1, 2, 12, 2, '7:00'),
    (1, 6, 4, 4, '8:00'),
    (1, 10, 11, 10, '8:00'),
    (1, 5, 8, 8, '9:00'),
    (1, 7, 9, 7, '9:00'),

    (2, 1, 2, 2, '9:00'),
    (2, 3, 12, 3, '9:00'),
    (2, 6, 11, 6, '10:00'),
    (2, 4, 10, 4, '10:00'),
    (2, 5, 7, 7, '11:00'),
    (2, 8, 9, 8, '11:00'),

    (3, 1, 12, 1, '12:00'),
    (3, 2, 3, 2, '12:00'),
    (3, 6, 10, 6, '1:00'),
    (3, 4, 11, 4, '1:00'),
    (3, 5, 9, 5, '2:00'),
    (3, 7, 8, 7, '2:00'),

    (4, 1, 9, 1, '3:00'),
    (4, 12, 11, 11, '3:00'),
    (4, 2, 4, 2, '4:00'),
    (4, 3, 7, 7, '4:00'),
    (4, 5, 8, 8, '5:00'),
    (4, 6, 10, 6, '5:00'),

    (5, 1, 11, 1, '6:00'),
    (5, 9, 12, 12, '6:00'),
    (5, 2, 6, 2, '7:00'),
    (5, 5, 7, 5, '7:00'),
    (5, 3, 10, 10, '8:00'),
    (5, 4, 8, 8, '8:00'),

    (6, 2, 5, 2, '9:00'),
    (6, 6, 7, 7, '9:00'),
    (6, 3, 4, 4, '12:00'),
    (6, 8, 10, 8, '12:00'),

    (7, 13, 15, 13, '7:00'),
    (7, 17, 16, 17, '7:00'),
    (7, 14, 18, 14, '7:00'),

    (8, 13, 14, 13, '7:00'),
    (8, 17, 15, 17, '7:00'),
    (8, 18, 16, 18, '7:00'),

    (9, 13, 17, 17, '7:00'),
    (9, 18, 15, 15, '7:00'),
    (9, 16, 14, 16, '7:00'),

    (10, 13, 14, 14, '7:00'),
    (10, 17, 18, 17, '7:00'),
    (10, 15, 16, 16, '7:00'),

    (11, 13, 16, 13, '7:00'),
    (11, 17, 15, 17, '7:00'),
    (11, 14, 18, 14, '7:00'),

    (12, 13, 14, 14, '7:00'),
    (12, 16, 17, 16, '7:00'),

    (13, 13, 17, 17, '7:00'),
    (13, 14, 16, 14, '7:00'),

    (14, 19, 20, 19, '7:00'),
    (14, 21, 22, 21, '7:00'),

    (15, 19, 21, 19, '7:00'),
    (15, 20, 22, 20, '7:00');



-- Inserting data into the 'sets' table
INSERT INTO sets (game_id, points1, points2) VALUES
(1, 15, 25), (1, 25, 14), (1, 12, 15),
(2, 25, 17), (2, 25, 13),
(3, 20, 25), (3, 25, 14), (3, 9, 15),
(4, 25, 19), (4, 25, 17),
(5, 22, 25), (5, 25, 19), (5, 7, 15),
(6, 25, 11), (6, 25, 18),
(7, 23, 25), (7, 21, 25),
(8, 25, 11), (8, 25, 15),
(9, 25, 13), (9, 23, 25), (9, 15, 10),
(10, 25, 19), (10, 25, 20),
(11, 18, 25), (11, 25, 13), (11, 15, 9),
(12, 25, 15), (12, 25, 14),
(13, 25, 22), (13, 25, 23),
(14, 25, 15), (14, 23, 25), (14, 15, 10),
(15, 25, 11), (15, 25, 13),
(16, 25, 12), (16, 25, 22),
(17, 25, 21), (17, 25, 19),
(18, 14, 25), (18, 25, 20), (18, 12, 15),
(19, 25, 13), (19, 23, 25), (19, 9, 15),
(20, 25, 11), (20, 20, 25), (20, 11, 15),
(21, 25, 18), (21, 25, 17),
(22, 19, 25), (22, 25, 12), (22, 15, 9),
(23, 25, 13), (23, 25, 11),
(24, 25, 16), (24, 19, 25), (24, 13, 15),
(25, 17, 25), (25, 25, 14), (25, 15, 7),
(26, 25, 10), (26, 25, 11),
(27, 25, 20), (27, 19, 25), (27, 15, 6),
(28, 25, 15), (28, 21, 25), (28, 15, 11),
(29, 22, 25), (29, 25, 17), (29, 12, 15),
(30, 25, 18), (30, 25, 14),
(31, 25, 19), (31, 25, 20),
(32, 17, 25), (32, 25, 12), (32, 15, 13),
(33, 24, 25), (33, 25, 19), (33, 15, 7),
(34, 25, 13), (34, 25, 18),
(35, 8, 25), (35, 23, 25),
(36, 17, 25), (36, 4, 25), (36, 15, 5),
(37, 2, 25), (37, 6, 25),
(38, 0, 25), (38, 7, 25), (38, 15, 5),
(39, 4, 25), (39, 3, 25), (39, 15, 4),
(40, 0, 25), (40, 16, 25), (40, 15, 10),
(41, 0, 25), (41, 7, 25), (41, 15, 10),
(42, 16, 25), (42, 7, 25),
(43, 0, 25), (43, 23, 25),
(44, 8, 25), (44, 17, 25), (44, 15, 2),
(45, 22, 25), (45, 10, 25), (45, 15, 8),
(46, 18, 25), (46, 3, 25), (46, 15, 4),
(47, 14, 25), (47, 16, 25), (47, 15, 11),
(48, 2, 25), (48, 18, 25), (48, 15, 10),
(49, 3, 25), (49, 18, 25), (49, 15, 9),
(50, 20, 25), (50, 13, 25),
(51, 21, 25), (51, 21, 25),
(52, 5, 25), (52, 9, 25),
(53, 19, 25), (53, 21, 25), (53, 15, 8),
(54, 16, 25), (54, 23, 25), (54, 15, 12),
(55, 3, 25), (55, 10, 25), (55, 15, 1),
(56, 7, 25), (56, 20, 25), (56, 15, 10),
(57, 20, 25), (57, 16, 25);




-- Inserting data into the 'players' table
INSERT INTO players (team_id, name, number, position, height_feet, height_inches, age, image) VALUES
    (6, 'Logan', 1, 'Outside Hitter', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Mason', 2, 'Outside Hitter', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Caleb', 3, 'Outside Hitter', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Dominic', 4, 'Outside Hitter', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Gavin', 5, 'Middle Blocker', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Victor', 6, 'Middle Blocker', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Miles', 7, 'Middle Blocker', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Elias', 8, 'Setter', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Zane', 9, 'Setter', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Wesley', 10, 'Opposite', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Ronan', 11, 'Libero', 6, 0, 25, 'images/profile.jpg'),
    (6, 'Jace', 12, 'Libero', 6, 0, 25, 'images/profile.jpg'),

    (1, 'Silas', 1, 'Outside Hitter', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Hudson', 2, 'Outside Hitter', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Beckett', 3, 'Outside Hitter', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Emmett', 4, 'Outside Hitter', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Cody', 5, 'Middle Blocker', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Tobias', 6, 'Middle Blocker', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Finn', 7, 'Middle Blocker', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Reed', 8, 'Middle Blocker', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Rowan', 9, 'Setter', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Trent', 10, 'Setter', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Seth', 11, 'Opposite', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Declan', 12, 'Opposite', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Quentin', 13, 'Libero', 6, 0, 25, 'images/profile.jpg'),
    (1, 'Marshall', 14, 'Libero', 6, 0, 25, 'images/profile.jpg'),

    (2, 'Leo Brown', 1, 'Setter', 5, 6, 35, 'images/profile.jpg'),
    (2, 'Hayden Moore', 2, 'Libero', 6, 6, 19, 'images/profile.jpg'),
    (2, 'Evan Brown', 3, 'Outside Hitter', 7, 6, 21, 'images/profile.jpg'),
    (2, 'Leo Brown', 4, 'Outside Hitter', 6, 6, 19, 'images/profile.jpg'),
    (2, 'Blake Davis', 5, 'Middle Blocker', 6, 1, 26, 'images/profile.jpg'),
    (2, 'Casey Wilson', 6, 'Opposite', 6, 5, 25, 'images/profile.jpg'),
    (2, 'Evan Moore', 7, 'Outside Hitter', 7, 7, 29, 'images/profile.jpg'),

    (3, 'Blake Brown', 1, 'Outside Hitter', 5, 4, 27, 'images/profile.jpg'),
    (3, 'Flynn Johnson', 2, 'Outside Hitter', 7, 10, 20, 'images/profile.jpg'),
    (3, 'Blake Davis', 3, 'Libero', 5, 6, 19, 'images/profile.jpg'),
    (3, 'Leo Smith', 4, 'Setter', 7, 0, 22, 'images/profile.jpg'),
    (3, 'Blake Taylor', 5, 'Middle Blocker', 6, 0, 23, 'images/profile.jpg'),
    (3, 'Hayden Davis', 6, 'Opposite', 5, 8, 35, 'images/profile.jpg'),
    (3, 'Hayden Moore', 7, 'Opposite', 6, 3, 34, 'images/profile.jpg'),

    (4, 'Flynn Davis', 1, 'Opposite', 6, 2, 22, 'images/profile.jpg'),
    (4, 'Flynn Brown', 2, 'Outside Hitter', 7, 9, 21, 'images/profile.jpg'),
    (4, 'Drew Miller', 3, 'Libero', 5, 1, 21, 'images/profile.jpg'),
    (4, 'Gabe Taylor', 4, 'Middle Blocker', 5, 4, 34, 'images/profile.jpg'),
    (4, 'Casey Wilson', 5, 'Middle Blocker', 6, 0, 22, 'images/profile.jpg'),
    (4, 'Drew Davis', 6, 'Middle Blocker', 6, 4, 29, 'images/profile.jpg'),
    (4, 'Blake Taylor', 7, 'Opposite', 6, 7, 25, 'images/profile.jpg'),

    (5, 'Hayden Brown', 1, 'Opposite', 5, 8, 35, 'images/profile.jpg'),
    (5, 'Casey Davis', 2, 'Setter', 6, 10, 33, 'images/profile.jpg'),
    (5, 'Jace Taylor', 3, 'Outside Hitter', 6, 10, 27, 'images/profile.jpg'),
    (5, 'Evan Davis', 4, 'Middle Blocker', 6, 10, 20, 'images/profile.jpg'),
    (5, 'Leo Smith', 5, 'Setter', 5, 10, 21, 'images/profile.jpg'),
    (5, 'Blake Davis', 6, 'Middle Blocker', 7, 8, 21, 'images/profile.jpg'),
    (5, 'Jace Davis', 7, 'Outside Hitter', 5, 4, 34, 'images/profile.jpg'),

    (7, 'Flynn Brown', 1, 'Libero', 7, 6, 30, 'images/profile.jpg'),
    (7, 'Ivan Moore', 2, 'Opposite', 7, 10, 26, 'images/profile.jpg'),
    (7, 'Leo Brown', 3, 'Opposite', 5, 11, 21, 'images/profile.jpg'),
    (7, 'Kai Johnson', 4, 'Libero', 5, 1, 19, 'images/profile.jpg'),
    (7, 'Drew Wilson', 5, 'Outside Hitter', 5, 4, 34, 'images/profile.jpg'),
    (7, 'Alex Smith', 6, 'Outside Hitter', 5, 3, 30, 'images/profile.jpg'),
    (7, 'Hayden Davis', 7, 'Outside Hitter', 6, 9, 25, 'images/profile.jpg'),

    (8, 'Alex Davis', 1, 'Opposite', 6, 4, 35, 'images/profile.jpg'),
    (8, 'Gabe Brown', 2, 'Libero', 6, 2, 32, 'images/profile.jpg'),
    (8, 'Flynn Johnson', 3, 'Opposite', 5, 1, 19, 'images/profile.jpg'),
    (8, 'Jace Smith', 4, 'Setter', 5, 3, 19, 'images/profile.jpg'),
    (8, 'Flynn Johnson', 5, 'Outside Hitter', 5, 9, 33, 'images/profile.jpg'),
    (8, 'Flynn Johnson', 6, 'Libero', 6, 2, 28, 'images/profile.jpg'),
    (8, 'Leo Moore', 7, 'Middle Blocker', 6, 11, 34, 'images/profile.jpg'),

    (9, 'Casey Smith', 1, 'Opposite', 7, 1, 29, 'images/profile.jpg'),
    (9, 'Flynn Smith', 2, 'Libero', 5, 2, 26, 'images/profile.jpg'),
    (9, 'Drew Taylor', 3, 'Middle Blocker', 6, 2, 32, 'images/profile.jpg'),
    (9, 'Alex Smith', 4, 'Opposite', 7, 10, 21, 'images/profile.jpg'),
    (9, 'Kai Davis', 5, 'Outside Hitter', 5, 10, 24, 'images/profile.jpg'),
    (9, 'Ivan Johnson', 6, 'Libero', 6, 3, 28, 'images/profile.jpg'),
    (9, 'Ivan Davis', 7, 'Middle Blocker', 7, 7, 30, 'images/profile.jpg'),

    (10, 'Kai Brown', 1, 'Opposite', 5, 4, 27, 'images/profile.jpg'),
    (10, 'Leo Davis', 2, 'Opposite', 5, 2, 25, 'images/profile.jpg'),
    (10, 'Leo Davis', 3, 'Outside Hitter', 6, 6, 23, 'images/profile.jpg'),
    (10, 'Drew Davis', 4, 'Libero', 6, 10, 29, 'images/profile.jpg'),
    (10, 'Kai Moore', 5, 'Outside Hitter', 6, 7, 27, 'images/profile.jpg'),
    (10, 'Drew Taylor', 6, 'Outside Hitter', 6, 4, 19, 'images/profile.jpg'),
    (10, 'Flynn Davis', 7, 'Opposite', 5, 3, 24, 'images/profile.jpg'),

    (11, 'Blake Davis', 1, 'Outside Hitter', 5, 4, 19, 'images/profile.jpg'),
    (11, 'Blake Moore', 2, 'Libero', 5, 8, 30, 'images/profile.jpg'),
    (11, 'Drew Moore', 3, 'Opposite', 6, 6, 32, 'images/profile.jpg'),
    (11, 'Flynn Brown', 4, 'Outside Hitter', 6, 8, 35, 'images/profile.jpg'),
    (11, 'Hayden Taylor', 5, 'Opposite', 5, 0, 23, 'images/profile.jpg'),
    (11, 'Gabe Johnson', 6, 'Libero', 7, 6, 27, 'images/profile.jpg'),
    (11, 'Ivan Davis', 7, 'Opposite', 5, 9, 26, 'images/profile.jpg'),

    (12, 'Ivan Taylor', 1, 'Middle Blocker', 5, 0, 32, 'images/profile.jpg'),
    (12, 'Hayden Brown', 2, 'Libero', 5, 3, 30, 'images/profile.jpg'),
    (12, 'Leo Johnson', 3, 'Setter', 6, 4, 28, 'images/profile.jpg'),
    (12, 'Casey Davis', 4, 'Outside Hitter', 5, 4, 30, 'images/profile.jpg'),
    (12, 'Kai Smith', 5, 'Outside Hitter', 6, 6, 27, 'images/profile.jpg'),
    (12, 'Ivan Johnson', 6, 'Middle Blocker', 6, 11, 27, 'images/profile.jpg'),
    (12, 'Leo Johnson', 7, 'Outside Hitter', 5, 1, 25, 'images/profile.jpg');
