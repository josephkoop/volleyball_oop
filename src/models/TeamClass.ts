// TeamClass.ts
import { Team } from "../interfaces/TeamHeader";
import { query } from '../config/db.js';

export class TeamClass implements Team {
    constructor(
    ) {}

    // Get all teams
    static async viewTeamsDB() {
        const result = await query(`SELECT * FROM teams ORDER BY rank ASC;`);
        return result.rows;
    }
    
    // Get players for a specific team
    static async viewPlayersDB(teamId: number) {
        const result = await query(`SELECT * FROM players WHERE team_id = $1 ORDER BY number ASC;`, [teamId]);
        //console.log('model-player: ', result);
        return result.rows;
    }
    
    // Get a specific team
    static async selectTeamDB(teamId: number) {
        const result = await query(`SELECT * FROM teams WHERE id = $1 LIMIT 1;`, [teamId]);
        console.log('model-team: ', result.rows[0]);
        return result.rows[0];
    }

    
      // Create a new team
    static async createTeamDB(name: string, location: string) {
        const result = await query('INSERT INTO teams (name, location) VALUES ($1, $2) RETURNING id;', [name, location]);
        return result.rows;
    }

    
      // Edit an existing team
    static async editTeamDB(id: number, name: string, location: string, rank: number) {
        const result = await query('UPDATE teams SET name = $1, location = $2, rank = $3 WHERE id = $4 RETURNING *;', [name, location, rank, id]);
        return result.rows;
    }
    

      // Delete a team
    static async deleteTeamDB(id: number) {
        const result = await query('DELETE FROM teams WHERE id = $1 RETURNING *;', [id]);
        return result.rows;
    }
      
    
      // Create a player
    static async createPlayerDB(name: string, teamId: number, number: number, position: string, heightFeet: number, heightInches: number, age: number, image: string) {
        const result = await query('INSERT INTO players (name, team_id, number, position, height_feet, height_inches, age, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;', [name, teamId, number, position, heightFeet, heightInches, age, image]);
        return result.rows;
    }

    
      // Edit a player
    static async editPlayerDB(id: number, name: string, teamId: number, number: number, position: string, heightFeet: number, heightInches: number, age: number, image: string) {
        const result = await query(`UPDATE players SET name = $1, team_id = $2, number = $3, position = $4,
        height_feet = $5, height_inches = $6, age = $7, image = $8 WHERE id = $9 RETURNING *;`, [name, teamId, number, position, heightFeet, heightInches, age, image, id]);
        return result.rows;
    }
    

      // Delete a player
    static async deletePlayerDB(teamId: number, id: number) {
        const result = await query('DELETE FROM players WHERE id = $1 AND team_id = $2 RETURNING *;', [id, teamId]);
        return result.rows;
    }
}
