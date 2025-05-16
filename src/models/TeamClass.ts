//TeamClass.ts

import { Team } from "../interfaces/TeamHeader";              //Explicitly throw errors?
import { Player } from "../interfaces/PlayerHeader";          //Add image to player
import { PlayerClass } from "./PlayerClass";
import { query } from '../config/db';

export class TeamClass implements Team {
    constructor(
        public id: number = 0,
        public name: string,
        public rank: number,
        public location: string,
    ) {}

    // Get all teams
    static async viewTeamsDB() {
        const result = await query(`SELECT * FROM teams ORDER BY rank ASC;`);
        return result.rows;
    }
    
    // Get a specific team
    static async getTeamDB(teamId: number): Promise<Team | null> {
        const result = await query(`SELECT * FROM teams WHERE id = $1 LIMIT 1;`, [teamId]);
        if(result.rows.length == 0) return null;
        const row = result.rows[0];
        const newTeam = new TeamClass(
          row.id,
          row.name,
          row.rank,
          row.location
        );
        return newTeam;
    }

    async saveTeamDB(): Promise<void>{
      await query('INSERT INTO teams (name, rank, location) VALUES ($1, $2, $3) RETURNING id;', [this.name, this.rank, this.location]);
    }
    
      // Edit an existing team
    async editTeamDB(id: number, name: string, location: string, rank: number): Promise<void> {     //We could first update the object, then call edit using this.property instead of passing in the properties.
      await query('UPDATE teams SET name = $1, location = $2, rank = $3 WHERE id = $4 RETURNING *;', [name, location, rank, id]);
    }
    
      // Delete a team
    async deleteTeamDB(): Promise<void> {
        await query('DELETE FROM teams WHERE id = $1 RETURNING *;', [this.id]);
    }    



    
    // Get players for a specific team
    async viewPlayersDB(): Promise<PlayerClass[] | null> {
      const result = await query(`SELECT players.* FROM teams INNER JOIN players ON teams.id = players.team_id WHERE teams.id = $1;`, [this.id]);
      if(result.rows.length == 0) return null;

      return result.rows.map((row: any) => 
        new PlayerClass(
          row.id,
          row.name,
          row.number,
          row.position,
          row.height_feet,
          row.height_inches,
          row.age,
        )
      );
    }

    // Get a specific player
    static async getPlayerDB(id: number) {
        const result = await query(`SELECT * FROM players WHERE id = $1 LIMIT 1;`, [id]);
        if(result.rows.length == 0) return null;
        const row = result.rows[0];
        return new PlayerClass(
          row.id,
          row.name,
          row.number,
          row.position,
          row.height_feet,
          row.height_inches,
          row.age,
        );
    }

    async savePlayerDB(newPlayer: Player){
      await query('INSERT INTO players (name, team_id, number, position, height_feet, height_inches, age) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', [newPlayer.name, this.id, newPlayer.number, newPlayer.position, newPlayer.heightFeet, newPlayer.heightInches, newPlayer.age]);
    }
    
      // Edit a player
    async editPlayerDB(id: number, name: string, number: number, position: string, heightFeet: number, heightInches: number, age: number): Promise<void> {
      await query(`UPDATE players SET name = $1, team_id = $2, number = $3, position = $4,
      height_feet = $5, height_inches = $6, age = $7 WHERE id = $8 RETURNING *;`, [name, this.id, number, position, heightFeet, heightInches, age, id]);
    }
    
      // Delete a player
    async deletePlayerDB(id: number): Promise<void> {
        await query('DELETE FROM players WHERE id = $1 RETURNING *;', [id]);
    }
}
