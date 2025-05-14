// tournamentClass.ts
import { Tournament } from "../interfaces/TournamentHeader";
import { query } from '../config/db.js';

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
        const future = await query(`SELECT * FROM tournaments WHERE status = 'Future' ORDER BY start_date DESC;`);
        const ongoing = await query(`SELECT * FROM tournaments WHERE status = 'Ongoing' ORDER BY start_date DESC;`);
        const finished = await query(`SELECT * FROM tournaments WHERE status = 'Finished' ORDER BY start_date DESC;`);
        return { future: future.rows, ongoing: ongoing.rows, finished: finished.rows };
    }

  
    // Get a specific tournament with its rounds and sets
    static async selectTournamentDB(id: number): Promise<any> {
        const result = await query(`
            SELECT 
                t.id as tournament_id, t.name, t.venue, t.start_date, t.end_date, t.status, t.organizer, t.contact, t.description,
                r.id as round_id, r.name as round_name,
                g.id as game_id, g.round_id, g.par1_id, g.par2_id, g.winner_id, g.time,
                s.id as set_id, s.points1, s.points2, s.game_id,
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
            WHERE t.id = $1;
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

    async saveTournamentDB(): Promise<void>{
      await query('INSERT INTO tournaments (name, venue, start_date, end_date, organizer, contact, status, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;', [this.name, this.venue, this.start_date, this.end_date, this.organizer, this.contact, this.status, this.description]);
    }
    
    // Edit an existing tournament
    async editTournamentDB(id: number, name: string, venue: string, start_date: Date, end_date: Date, organizer: string, contact: string, description: string): Promise<void> {
      await query('UPDATE tournaments SET name = $1, venue = $2, start_date = $3, end_date = $4, organizer = $5, contact = $6, description = $7 WHERE id = $8 RETURNING *;', [name, venue, start_date, end_date, organizer, contact, description, id]);
    }
    
      // Delete a tournament
    async deleteTournamentDB(): Promise<void> {
        await query('DELETE FROM tournaments WHERE id = $1 RETURNING *;', [this.id]);
    }    



    
    // Get Rounds for a specific tournament
//     async viewRoundsDB(): Promise<RoundClass[] | null> {
//       const result = await query(`SELECT Rounds.* FROM tournaments INNER JOIN Rounds ON tournaments.id = Rounds.tournament_id WHERE tournaments.id = $1;`, [this.id]);
//       if(result.rows.length == 0) return null;

//       return result.rows.map((row: any) => 
//         new RoundClass(
//           row.id,
//           row.name,
//           row.number,
//           row.position,
//           row.height_feet,
//           row.height_inches,
//           row.age,
//         )
//       );
//     }

//     // Get a specific Round
//     static async getRoundDB(id: number) {
//         const result = await query(`SELECT * FROM Rounds WHERE id = $1 LIMIT 1;`, [id]);
//         if(result.rows.length == 0) return null;
//         const row = result.rows[0];
//         return new RoundClass(
//           row.id,
//           row.name,
//           row.number,
//           row.position,
//           row.height_feet,
//           row.height_inches,
//           row.age,
//         );
//     }

//     async saveRoundDB(newRound: Round){
//       await query('INSERT INTO Rounds (name, tournament_id, number, position, height_feet, height_inches, age) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', [newRound.name, this.id, newRound.number, newRound.position, newRound.heightFeet, newRound.heightInches, newRound.age]);
//     }
    
//       // Edit a Round
//     async editRoundDB(id: number, name: string, number: number, position: string, heightFeet: number, heightInches: number, age: number): Promise<void> {
//       await query(`UPDATE Rounds SET name = $1, tournament_id = $2, number = $3, position = $4,
//       height_feet = $5, height_inches = $6, age = $7 WHERE id = $8 RETURNING *;`, [name, this.id, number, position, heightFeet, heightInches, age, id]);
//     }
    
//       // Delete a Round
//     async deleteRoundDB(id: number): Promise<void> {
//         await query('DELETE FROM Rounds WHERE id = $1 RETURNING *;', [id]);
//     }
// }

}
