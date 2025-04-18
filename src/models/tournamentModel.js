class TournamentModel {
  // Get all tournaments, ordered by date (descending)
  static async getAllTournaments() {
    const query = `
      SELECT * FROM tournaments ORDER BY date DESC;
    `;
    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error('Error retrieving tournaments');
    }
  }

  // Get tournaments based on their status (Ongoing, Finished, or Future)
  static async getTournamentsByStatus(status) {
    const query = `
      SELECT * FROM tournaments WHERE status = $1 ORDER BY date DESC;
    `;
    try {
      const { rows } = await pool.query(query, [status]);
      return rows;
    } catch (error) {
      throw new Error(`Error retrieving ${status} tournaments`);
    }
  }

  // Get a specific tournament with its rounds and sets
  static async getTournamentWithRoundsAndSets(tournamentId) {
    const query = `
      SELECT t.*, r.*, g.*, s.*
      FROM tournaments t
      JOIN rounds r ON r.tournament_id = t.id
      JOIN games g ON g.round_id = r.id
      JOIN sets s ON s.game_id = g.id
      WHERE t.id = $1;
    `;
    try {
      const { rows } = await pool.query(query, [tournamentId]);
      return rows;
    } catch (error) {
      throw new Error('Error retrieving tournament with rounds and sets');
    }
  }
}

module.exports = TournamentModel;