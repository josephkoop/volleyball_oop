// TeamClass.ts
import { Tournament } from "../interfaces/TournamentHeader";
import { query } from '../config/db.js';

export class TournamentClass implements Tournament {
    constructor(
    ) {}

  
    // Get tournaments based on their status (Ongoing, Finished, or Future)
    static async selectTournamentsByStatusDB() {
        const future = await query(`SELECT * FROM tournaments WHERE status = 'Future' ORDER BY date DESC;`);
        const ongoing = await query(`SELECT * FROM tournaments WHERE status = 'Ongoing' ORDER BY date DESC;`);
        const finished = await query(`SELECT * FROM tournaments WHERE status = 'Finished' ORDER BY date DESC;`);
        return { future: future.rows, ongoing: ongoing.rows, finished: finished.rows };
    }

  
    // Get a specific tournament with its rounds and sets
    static async selectTournamentDB(tournamentId: number) {
        const result = await query(`
            SELECT 
                t.id as tournament_id, t.name, t.venue, t.date, t.time, t.organizer, t.contact, t.description,
                r.id as round_id, r.name as round_name,
                g.id as game_id, g.round_id, g.team1_id, g.team2_id, g.winner_id, g.time,
                s.id as set_id, s.points1, s.points2, s.game_id
            FROM tournaments t 
            JOIN rounds r ON r.tournament_id = t.id 
            JOIN games g ON g.round_id = r.id 
            JOIN sets s ON s.game_id = g.id 
            WHERE t.id = $1;
        `, [tournamentId]);
        return result.rows;
    }
}
