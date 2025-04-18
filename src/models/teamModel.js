class TeamModel {
    // Get all teams
    static async getTeams() {
      const query = `
        SELECT * FROM teams
        ORDER BY CASE WHEN rank IS NULL THEN 1 ELSE 0 END, rank ASC;
      `;
      try {
        const { rows } = await pool.query(query);
        return rows;
      } catch (error) {
        throw new Error('Error retrieving teams');
      }
    }
  
    // Get players for a specific team
    static async getPlayersByTeam(teamId) {
      const query = `
        SELECT * FROM players WHERE team_id = $1 ORDER BY number ASC;
      `;
      try {
        const { rows } = await pool.query(query, [teamId]);
        return rows;
      } catch (error) {
        throw new Error('Error retrieving players');
      }
    }
  
    // Create a new team
    static async createTeam(name, location) {
      const query = `
        INSERT INTO teams (name, location) VALUES ($1, $2) RETURNING id;
      `;
      try {
        const { rows } = await pool.query(query, [name, location]);
        return rows[0];
      } catch (error) {
        throw new Error('Error creating team');
      }
    }
  
    // Edit an existing team
    static async editTeam(id, name, location, rank) {
      const query = `
        UPDATE teams SET name = $1, location = $2, rank = $3 WHERE id = $4 RETURNING *;
      `;
      try {
        const { rows } = await pool.query(query, [name, location, rank, id]);
        return rows[0];
      } catch (error) {
        throw new Error('Error editing team');
      }
    }
  
    // Delete a team
    static async deleteTeam(id) {
      const query = `
        DELETE FROM teams WHERE id = $1 RETURNING *;
      `;
      try {
        const { rows } = await pool.query(query, [id]);
        return rows[0];
      } catch (error) {
        throw new Error('Error deleting team');
      }
    }
  
    // Create a player
    static async createPlayer(name, teamId, number, position, heightFeet, heightInches, age, image) {
      const query = `
        INSERT INTO players (name, team_id, number, position, height_feet, height_inches, age, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `;
      try {
        const { rows } = await pool.query(query, [name, teamId, number, position, heightFeet, heightInches, age, image]);
        return rows[0];
      } catch (error) {
        throw new Error('Error creating player');
      }
    }
  
    // Edit a player
    static async editPlayer(id, name, teamId, number, position, heightFeet, heightInches, age, image) {
      const query = `
        UPDATE players SET name = $1, team_id = $2, number = $3, position = $4,
        height_feet = $5, height_inches = $6, age = $7, image = $8 WHERE id = $9 RETURNING *;
      `;
      try {
        const { rows } = await pool.query(query, [name, teamId, number, position, heightFeet, heightInches, age, image, id]);
        return rows[0];
      } catch (error) {
        throw new Error('Error editing player');
      }
    }
  
    // Delete a player
    static async deletePlayer(teamId, id) {
      const query = `
        DELETE FROM players WHERE id = $1 AND team_id = $2 RETURNING *;
      `;
      try {
        const { rows } = await pool.query(query, [id, teamId]);
        return rows[0];
      } catch (error) {
        throw new Error('Error deleting player');
      }
    }
  }
  
  module.exports = TeamModel;