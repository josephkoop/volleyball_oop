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
        res.status(500).json({ error: 'An error occured.' });
    }
}

 // Get rounds, games, and sets for a specific tournament
export const viewEvent = async(req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const rows = await TournamentClass.selectTournamentDB(parseInt(id, 10));
        const teams = await TeamClass.viewTeamsDB();
        let participants = await TournamentClass.viewParticipantsDB(parseInt(id, 10));

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

        res.render('event', { tournament, teams, participants });
    } catch (error) {
        console.error('Controller viewEvent error: ', error);
        res.status(500).json({ error: 'An error occurred.' });
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
        await newTournament.saveTournamentDB();
        res.status(201).json({ message: 'Tournament added successfully', tournament: newTournament });
    }catch(error){
        console.error('Controller createTournament error: ', error);
        res.status(500).json({ error: 'An error occured.' });
    }
}

export const editTournament = async(req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id, name, venue, start_date, end_date, organizer, contact, status, description } = req.body;            //Don't need status
    try {
        const tournament = await TournamentClass.getTournamentDB(parseInt(id, 10));
        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        tournament.name = name;
        tournament.venue = venue;
        tournament.start_date = start_date;
        tournament.end_date = end_date;
        tournament.organizer = organizer;
        tournament.contact = contact;
        tournament.description = description;
        const updatedTournament = await tournament.editTournamentDB();

        res.status(201).json({ message: 'Tournament updated successfully', tournament: updatedTournament });
    } catch (error) {
        console.error('Controller editTournament error: ', error);
        res.status(500).json({ error: 'An error occured.' });
    }
}

export const deleteTournament = async(req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    try {
        const tournament = await TournamentClass.getTournamentDB(parseInt(id, 10));
        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        let deletedTournament = await tournament.deleteTournamentDB();
        res.status(201).json({ message: 'Tournament deleted successfully', tournament: deletedTournament });
    } catch (error) {
        console.error('Controller deleteTournament error: ', error);
        res.status(500).json({ error: 'An error occured.' });
    }
}

export const startTournament = async(req: Request, res: Response): Promise<any> => {
    const { id, teams } = req.body;
    if(teams.length < 2){
        return res.status(400).json({ error: 'At least two teams are needed to start.' });
    }

    try {
        const tournament = await TournamentClass.getTournamentDB(parseInt(id, 10));
        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        for(const team of teams){
            await tournament.addParticipantDB(team);
        }

        let updatedTournament = await tournament.updateTournamentDB('Ongoing');
        res.status(201).json({ message: 'Tournament started successfully', tournament: updatedTournament });
    } catch (error) {
        console.error('Controller startTournament error: ', error);
        res.status(500).json({ error: 'An error occured.' });
    }
}

export const addRound = async(req: Request, res: Response): Promise<any> => {
    const { id, name, amount } = req.body;

    if(!name){
        return res.status(404).json({ error: 'Name is required' });
    }

    if(!amount || amount < 1){
        return res.status(404).json({ error: 'There must be at least one game per round' });
    }

    try {
        const tournament = await TournamentClass.getTournamentDB(parseInt(id, 10));
        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        let newRound = await tournament.addRoundDB(name);

        for(let i = 0; i < amount; i++){
            const newGame = await tournament.addGameDB(newRound.id);
        }

        res.status(201).json({ message: 'Round added successfully', round: newRound });
    } catch (error) {
        console.error('Controller addRound error: ', error);
        res.status(500).json({ error: 'An error occured.' });
    }
}

export const saveRound = async(req: Request, res: Response): Promise<any> => {
    let { id, round_id, game_id, par1, par2, points1_1, points2_1, points1_2, points2_2, points1_3, points2_3 } = req.body;

    const formatPoints = (val: any) => {
        return val === '' || val === null || val === undefined ? null : Number(val);
    };

        points1_1 = formatPoints(points1_1);
        points2_1 = formatPoints(points2_1);
        points1_2 = formatPoints(points1_2);
        points2_2 = formatPoints(points2_2);
        points1_3 = formatPoints(points1_3);
        points2_3 = formatPoints(points2_3);

    if(!par1 || !par2 || par1 == par2){
        return res.status(404).json({ error: 'Both teams are required.' });
    }

    if(points1_1 < 0 || points2_1 < 0 || points1_2 < 0 || points2_2 < 0 || points1_3 < 0 || points2_3 < 0){
        return res.status(404).json({ error: 'Points cannot be negative.' });
    }

    if(points1_1 || points2_1){
        if(points1_1 == null || points2_1 == null){
            return res.status(404).json({ error: 'Both teams must have points (set #1).' });
        }
        if(points1_1 > 25 || points2_1 > 25){
            if(Math.abs(points1_1 - points2_1) != 2){
                return res.status(404).json({ error: 'The point difference must be exactly 2 in extended games (set #1).' });
            }
        }
    }

    if(points1_2 || points2_2){
        if(points1_2 == null || points2_2 == null){
            return res.status(404).json({ error: 'Both teams must have points (set #2).' });
        }
        if(points1_1 < 25 && points2_1 < 25){
            return res.status(404).json({ error: '25 points are needed to win (set #1).' });
        }else{
            if(Math.abs(points1_1 - points2_1) < 2){
                return res.status(404).json({ error: 'The point difference cannot be less than 2 (set #1).' });
            }
        }
        if(points1_2 > 25 || points2_2 > 25){
            if(Math.abs(points1_2 - points2_2) != 2){
                return res.status(404).json({ error: 'The point difference must be exactly 2 in extended games (set #2).' });
            }
        }
    }

    if(points1_3 || points2_3){
        if(points1_3 == null || points2_3 == null){
            return res.status(404).json({ error: 'Both teams must have points (set #3).' });
        }
        if(points1_2 < 25 && points2_2 < 25){
            return res.status(404).json({ error: '25 points are needed to win (set #2).' });
        }else{
            if(Math.abs(points1_2 - points2_2) < 2){
                return res.status(404).json({ error: 'The point difference cannot be less than 2 (set #2).' });
            }
        }
        if((points1_1 > points2_1 && points1_2 > points2_2) || (points2_1 > points1_1 && points2_2 > points1_2)){
            return res.status(404).json({ error: 'Games cannot go to three sets unless each team wins 1 set.' });
        }
        if(points1_3 > 15 || points2_3 > 15){
            if(Math.abs(points1_3 - points2_3) != 2){
                return res.status(404).json({ error: 'The point difference must be exactly 2 in extended games (set #3).' });
            }
        }
    }


    if(!id || !round_id || !game_id){       //Also check if round and game are in database
        return res.status(404).json({ error: 'Something went wrong.' });
    }


    try {
        const tournament = await TournamentClass.getTournamentDB(parseInt(id, 10));
        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        const updatedGame = await tournament.editGameDB(game_id, par1, par2);

        await tournament.deleteSetsDB(game_id);
        if(points1_1 != null){
            await tournament.addSetDB(game_id, points1_1, points2_1);
            if(points1_2 != null){
                await tournament.addSetDB(game_id, points1_2, points2_2);
                if(points1_3 != null){
                    await tournament.addSetDB(game_id, points1_3, points2_3);
                }
            }
        }

        res.status(201).json({ message: 'Game saved successfully' });
    } catch (error) {
        console.error('Controller saveRound error: ', error);
        res.status(500).json({ error: 'An error occured.' });
    }
}

export const deleteRound = async(req: Request, res: Response): Promise<any> => {
    const { id, round_id } = req.body;

    try {
        const tournament = await TournamentClass.getTournamentDB(parseInt(id, 10));
        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        let deletedRound = await tournament.deleteRoundDB(round_id);
        res.status(201).json({ message: 'Round deleted successfully', round: deletedRound });
    } catch (error) {
        console.error('Controller deleteRound error: ', error);
        res.status(500).json({ error: 'An error occured.' });
    }
}

export const addGame = async(req: Request, res: Response): Promise<any> => {
    const { id } = req.body;

    try {
        const tournament = await TournamentClass.getTournamentDB(parseInt(id, 10));
        if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

        let updatedTournament = await tournament.updateTournamentDB('Ongoing');
        res.status(201).json({ message: 'Tournament startd successfully', tournament: updatedTournament });
    } catch (error) {
        console.error('Controller addGame error: ', error);
        res.status(500).json({ error: 'An error occured.' });
    }
}

export const finishTournament = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.body;
    const tournament = await TournamentClass.getTournamentDB(id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const gameRows = await TournamentClass.getGameIdsDB(id);
    for (const game of gameRows) {
      const game_id = game.id;
      const sets = await TournamentClass.getSetsDB(game_id);

      if (sets.length < 2 || sets.length > 3) {
        return res.status(400).json({ error: `Not all games have 2 or 3 sets.` });
      }

      let wins1 = 0;
      let wins2 = 0;

      for (let i = 0; i < sets.length; i++) {
        const { points1, points2 } = sets[i];
        if (i < 2) {
          if (points1 >= 25 && points1 > points2) wins1++;
          else if (points2 >= 25 && points2 > points1) wins2++;
        } else {
          if (points1 >= 15 && points1 > points2) wins1++;
          else if (points2 >= 15 && points2 > points1) wins2++;
        }
      }

      if ((wins1 === 2 && wins2 < 2) || (wins2 === 2 && wins1 < 2)) {
        const { par1_id, par2_id } = await TournamentClass.getGameParticipantsDB(game_id);
        const winner_id = wins1 === 2 ? par1_id : par2_id;
        await TournamentClass.setGameWinnerDB(game_id, winner_id);
      } else {
        return res.status(400).json({ error: `Game ${game_id} does not have a valid winner.` });
      }
    }

    await tournament.updateTournamentDB("Finished");
    res.status(200).json({ message: "Tournament finished successfully." });

  } catch (err) {
    console.error("Error in finishTournament:", err);
    res.status(500).json({ error: "An error occurred while finishing the tournament." });
  }
}