import bcrypt from "bcrypt";
import pool from "../config/db.js";


const TournamentModel = require('../models/tournamentModel');

class TournamentController {
  // Show all tournaments on the home page
  async home(req, res) {
    try {
      const tournaments = await TournamentModel.getAllTournaments();
      res.render('pages.home', { tournaments });
    } catch (error) {
      res.status(500).send('Error retrieving tournaments');
    }
  }

  // Show ongoing, finished, and future tournaments
  async tournaments(req, res) {
    try {
      const ongoingTournaments = await TournamentModel.getTournamentsByStatus('Ongoing');
      const finishedTournaments = await TournamentModel.getTournamentsByStatus('Finished');
      const futureTournaments = await TournamentModel.getTournamentsByStatus('Future');
      
      res.render('pages.tournaments', {
        ongoingTournaments,
        finishedTournaments,
        futureTournaments
      });
    } catch (error) {
      res.status(500).send('Error retrieving tournaments by status');
    }
  }

  // Show details of a specific tournament with its rounds and sets
  async events(req, res) {
    const { id } = req.params;
    try {
      const tournament = await TournamentModel.getTournamentWithRoundsAndSets(id);
      res.render('pages.events', { tournament });
    } catch (error) {
      res.status(500).send('Error retrieving tournament details');
    }
  }
}

module.exports = TournamentController;
