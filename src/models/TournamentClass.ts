// tournamentClass.ts
import { Tournament } from "../interfaces/TournamentHeader";
import { query } from '../config/db';

export class TournamentClass implements Tournament {
    constructor(
        public id: number = 0,
        public name: string,
        public venue: string,
        public start_date: Date,
        public end_date: Date,
        public organizer: string,       //should link to users later. organizer_id
        public contact: string,
        public status: string,             //should be either Future, Ongoing, or Finished
        public description: string,
    ) {}

  
    // Get tournaments based on their status (Ongoing, Finished, or Future)
    static async selectTournamentsByStatusDB(): Promise<any> {
        const future = await query(`SELECT * FROM tournaments WHERE status = 'Future' ORDER BY start_date DESC`);
        const ongoing = await query(`SELECT * FROM tournaments WHERE status = 'Ongoing' ORDER BY start_date DESC`);
        const finished = await query(`SELECT * FROM tournaments WHERE status = 'Finished' ORDER BY start_date DESC`);
        return { future: future.rows, ongoing: ongoing.rows, finished: finished.rows };
    }

  
    // Get a specific tournament with its rounds and sets
    static async selectTournamentDB(id: number): Promise<any> {
        const result = await query(`
            SELECT 
                t.id as tournament_id, t.name, t.venue, t.start_date, t.end_date, t.status, t.organizer, t.contact, t.description,
                r.id as round_id, r.name as round_name,
                g.id as game_id, g.round_id as game_round_id, g.par1_id, g.par2_id, g.winner_id, g.time,
                s.id as set_id, s.points1, s.points2, s.game_id as sets_game_id,
                a.id as team1_id, a.name as team1_name,
                b.id as team2_id, b.name as team2_name
            FROM tournaments t 
            LEFT JOIN rounds r ON r.tournament_id = t.id 
            LEFT JOIN games g ON g.round_id = r.id 
            LEFT JOIN sets s ON s.game_id = g.id
            LEFT JOIN participants p1 on g.par1_id = p1.id
            LEFT JOIN participants p2 on g.par2_id = p2.id
            LEFT JOIN teams a on p1.team_id = a.id
            LEFT JOIN teams b on p2.team_id = b.id
            WHERE t.id = $1
            ORDER BY g.id;
        `, [id]);
        return result.rows;
    }




    // Get a specific tournament
    static async getTournamentDB(id: number): Promise<Tournament | null> {
        const result = await query(`SELECT * FROM tournaments WHERE id = $1 LIMIT 1;`, [id]);
        if(result.rows.length == 0) return null;
        const row = result.rows[0];
        const newTournament = new TournamentClass(
          row.id,
          row.name,
          row.venue,
          row.start_date,
          row.end_date,
          row.organizer,
          row.contact,
          row.status,
          row.description,
        );

        return newTournament;
    }

    async saveTournamentDB(): Promise<any>{
      await query('INSERT INTO tournaments (name, venue, start_date, end_date, organizer, contact, status, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;', [this.name, this.venue, this.start_date, this.end_date, this.organizer, this.contact, this.status, this.description]);
    }
    
    // Edit an existing tournament
    async editTournamentDB(): Promise<any> {
      await query('UPDATE tournaments SET name = $1, venue = $2, start_date = $3, end_date = $4, organizer = $5, contact = $6, description = $7 WHERE id = $8 RETURNING *;', [this.name, this.venue, this.start_date, this.end_date, this.organizer, this.contact, this.description, this.id]);
    }
    
      // Delete a tournament
    async deleteTournamentDB(): Promise<any> {
      await query('DELETE FROM tournaments WHERE id = $1 RETURNING *;', [this.id]);
    }    
    
    async updateTournamentDB(status: string): Promise<any> {
      await query('UPDATE tournaments SET status = $1 WHERE id = $2 RETURNING *;', [status, this.id]);
    }
    
    async addParticipantDB(team_id: number): Promise<any> {
      await query('INSERT INTO participants (tournament_id, team_id) VALUES ($1, $2)', [this.id, team_id]); 
    }
    
    static async viewParticipantsDB(id: number): Promise<any> {
      const result = await query('SELECT * FROM participants INNER JOIN teams ON participants.team_id = teams.id WHERE tournament_id = $1', [id]);
      return result.rows;
    }
    
    async addRoundDB(name: string): Promise<any> {
      const result = await query('INSERT INTO rounds (tournament_id, name) VALUES ($1, $2) RETURNING *', [this.id, name])
      return result.rows[0];
    }    
    
    async saveRoundDB(): Promise<any> {
      const result = await query('INSERT INTO rounds (tournament_id, name) VALUES ($1, $2) RETURNING *', [this.id, name])
      return result.rows[0];
    }    
    
    async deleteRoundDB(round_id: number): Promise<any> {
      await query('DELETE FROM rounds WHERE id = $1 RETURNING *;', [round_id]);
    }    
    
    async addGameDB(round_id: number): Promise<any> {
      const result = await query('INSERT INTO games (round_id) VALUES ($1) RETURNING *', [round_id]);
      return result.rows[0];
    }    
    
    async editGameDB(game_id: number, par1: number, par2: number): Promise<any>{
      const result = await query('UPDATE games SET par1_id = $1, par2_id = $2 WHERE id = $3 RETURNING *', [par1, par2, game_id]);
      return result.rows[0];
    }
    
    async deleteSetsDB(game_id: number): Promise<any>{
      await query('DELETE from sets WHERE game_id = $1', [game_id]);
    }
    
    async addSetDB(game_id: number, points1: number, points2: number): Promise<any>{
      await query('INSERT INTO sets (game_id, points1, points2) VALUES ($1, $2, $3)', [game_id, points1, points2]);
    }
    
    static async getGameIdsDB(tournament_id: number): Promise<any> {
      const result = await query(`SELECT g.id FROM games g INNER JOIN rounds r ON g.round_id = r.id WHERE r.tournament_id = $1;`, [tournament_id]);
      return result.rows;
    }

    static async getGameParticipantsDB(game_id: number): Promise<any> {
      const result = await query(`SELECT par1_id, par2_id FROM games WHERE id = $1`, [game_id]);
      return result.rows[0];
    }

    static async getSetsDB(game_id: number): Promise<any> {
      const result = await query(`SELECT points1, points2 FROM sets WHERE game_id = $1 ORDER BY id ASC`, [game_id]);
      return result.rows;
    }

    static async setGameWinnerDB(game_id: number, winner_id: number): Promise<any> {
      await query(`UPDATE games SET winner_id = $1 WHERE id = $2`, [winner_id, game_id]);
    }
}
