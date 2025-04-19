import { Request, Response } from 'express';
import { TournamentClass } from '../models/TournamentClass';
import path from 'path';

// Get all tournaments
export const viewTournaments = async(req: Request, res: Response): Promise<void> => {
    try {
        const { ongoing: ongoingTournaments, finished: finishedTournaments, future: futureTournaments } = await TournamentClass.selectTournamentsByStatusDB();
        
        res.render('tournaments', {
            ongoingTournaments,
            finishedTournaments,
            futureTournaments
        });

    } catch (error) {
        console.error('Controller viewTournaments error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
}

 // Get rounds, games, and sets for a specific tournament
export const viewEvent = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const rows = await TournamentClass.selectTournamentDB(parseInt(id, 10));

        if (!rows || rows.length === 0) {
            return res.render('event', { tournament: null });
        }

        const tournament: any = {
            id: rows[0].tournament_id,
            name: rows[0].name,
            venue: rows[0].venue,
            date: rows[0].date,
            time: rows[0].time,
            organizer: rows[0].organizer,
            contact: rows[0].contact,
            description: rows[0].description,
            rounds: []
        };

        const roundMap = new Map<number, any>();

        for (const row of rows) {
            if (!row.round_id) continue; // skip if round is missing

            if (!roundMap.has(row.round_id)) {
                const newRound = {
                    id: row.round_id,
                    name: row.round_name || `Round ${row.round_id}`,
                    games: []
                };
                roundMap.set(row.round_id, newRound);
                tournament.rounds.push(newRound);
            }

            const round = roundMap.get(row.round_id);

            if (!row.game_id) continue; // skip if game is missing

            let game = round.games.find((g: any) => g.id === row.game_id);

            if (!game) {
                game = {
                    id: row.game_id,
                    team1_id: row.team1_id,
                    team2_id: row.team2_id,
                    winner_id: row.winner_id,
                    time: row.time,
                    team1: { name: `Team ${row.team1_id}` },
                    team2: { name: `Team ${row.team2_id}` },
                    sets: []
                };
                round.games.push(game);
            }

            // Check that set data exists before pushing
            if (row.points1 !== null && row.points2 !== null) {
                game.sets.push({
                    points1: row.points1,
                    points2: row.points2
                });
            }
        }

        res.render('event', { tournament });
    } catch (error) {
        console.error('Controller viewEvent error: ', error);
        res.status(500).json({ err: 'An error occurred.' });
    }
};