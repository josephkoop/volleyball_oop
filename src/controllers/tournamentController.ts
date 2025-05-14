import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { TournamentClass } from '../models/TournamentClass';
import path from 'path';
import { TeamClass } from '../models/TeamClass';

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
export const viewEvent = async(req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const rows = await TournamentClass.selectTournamentDB(parseInt(id, 10));
        const teams = await TeamClass.viewTeamsDB();

        if (!rows || rows.length === 0) {
            return res.render('event', { tournament: null });
        }

        const tournament: any = {
            id: rows[0].tournament_id,
            name: rows[0].name,
            venue: rows[0].venue,
            start_date: rows[0].start_date,
            end_date: rows[0].end_date,
            status: rows[0].status,
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
                    par1_id: row.par1_id,
                    par2_id: row.par2_id,
                    winner_id: row.winner_id,
                    time: row.time,
                    par1: { name: `${row.team1_name}` },
                    par2: { name: `${row.team2_name}` },
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

        res.render('event', { tournament, teams });
    } catch (error) {
        console.error('Controller viewEvent error: ', error);
        res.status(500).json({ err: 'An error occurred.' });
    }
};

export const validateTournament = [
    body('name')
      .notEmpty()
      .withMessage('Name is required.'),
  
    body('venue')
      .notEmpty()
      .withMessage('Venue is required.'),
  
    body('start_date')
      .notEmpty()
      .withMessage('Start date is required.')
      .isISO8601()
      .withMessage('Start date must be a valid date.'),
  
    body('end_date')
      .notEmpty()
      .withMessage('End date is required.')
      .isISO8601()
      .withMessage('End date must be a valid date.')
      .custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.start_date)) {
          throw new Error('End date cannot be before start date.');
        }
        return true;
      }),
  
    body('organizer')
      .notEmpty()
      .withMessage('Organizer is required.'),
  
    body('contact')
      .notEmpty()
      .withMessage('Contact number is required.')
      .matches(/^\+?[0-9\s\-]{7,15}$/)
      .withMessage('Contact number must be valid (digits, spaces, dashes allowed).'),
  
    body('description')
      .optional({ checkFalsy: true })
      .isLength({ max: 500 })
      .withMessage('Description must be 500 characters or fewer.')
];

export const createTournament = async(req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, venue, start_date, end_date, organizer, contact, description } = req.body;
    try {
        const newTournament = new TournamentClass(
            undefined,
            name,
            venue,
            start_date,
            end_date,
            organizer,
            contact,
            "Future",
            description
        );
        newTournament.saveTournamentDB();
        res.status(201).json({ message: 'Tournament added successfully', tournament: newTournament });
    }catch(error){
        console.error('Controller createTournament error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
}

export const editTournament = async(req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id, name, venue, start_date, end_date, organizer, contact, status, description } = req.body;
    try {
        const tournament = await TournamentClass.getTournamentDB(parseInt(id, 10));
        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        let newTournament = await tournament.editTournamentDB(parseInt(id, 10), name, venue, start_date, end_date, organizer, contact, description);
        res.status(201).json({ message: 'Tournament updated successfully', tournament: newTournament });
    } catch (error) {
        console.error('Controller editTournament error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
  }

export const deleteTournament = async(req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    try {
        const tournament = await TournamentClass.getTournamentDB(parseInt(id, 10));
        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        let newTournament = await tournament.deleteTournamentDB();
        res.status(201).json({ message: 'Tournament deleted successfully', tournament: newTournament });
    } catch (error) {
        console.error('Controller deleteTournament error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
}