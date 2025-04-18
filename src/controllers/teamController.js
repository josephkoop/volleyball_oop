import bcrypt from "bcrypt";
import pool from "../config/db.js";


const TeamModel = require('../models/teamModel');

class TeamController {
  // Get all teams
  async teams(req, res) {
    try {
      const teams = await TeamModel.getTeams();
      res.render('pages/teams', { teams });
    } catch (error) {
      res.status(500).send('Error retrieving teams');
    }
  }

  // Get players for a specific team
  async players(req, res) {
    const { id } = req.params;
    try {
      const teams = await TeamModel.getTeams();
      const team = await TeamModel.getPlayersByTeam(id); // Players function is called here
      res.render('pages.players', { teams, team });
    } catch (error) {
      res.status(500).send('Error retrieving players');
    }
  }

  // Create a new team
  async createTeam(req, res) {
    const { name, location } = req.body;
    try {
      const newTeam = await TeamModel.createTeam(name, location);
      res.redirect('/teams').flash('success', 'Team Added');
    } catch (error) {
      res.status(500).send('Error creating team');
    }
  }

  // Edit an existing team
  async editTeam(req, res) {
    const { id } = req.params;
    const { name, location, rank } = req.body;
    try {
      const updatedTeam = await TeamModel.editTeam(id, name, location, rank);
      res.redirect('/teams').flash('success', 'Team Updated');
    } catch (error) {
      res.status(500).send('Error updating team');
    }
  }

  // Delete a team
  async deleteTeam(req, res) {
    const { id } = req.params;
    try {
      await TeamModel.deleteTeam(id);
      res.redirect('/teams').flash('success', 'Team Deleted');
    } catch (error) {
      res.status(500).send('Error deleting team');
    }
  }

  // Create a player
  async createPlayer(req, res) {
    const { name, teamId, number, position, heightFeet, heightInches, age, image } = req.body;
    try {
      await TeamModel.createPlayer(name, teamId, number, position, heightFeet, heightInches, age, image || 'images/profile.jpg');
      res.redirect(`/teams/${teamId}/players`).flash('success', 'Player Added');
    } catch (error) {
      res.status(500).send('Error creating player');
    }
  }

  // Edit a player
  async editPlayer(req, res) {
    const { id, teamId } = req.params;
    const { name, number, position, heightFeet, heightInches, age, image } = req.body;
    try {
      await TeamModel.editPlayer(id, name, teamId, number, position, heightFeet, heightInches, age, image || 'images/profile.jpg');
      res.redirect(`/teams/${teamId}/players`).flash('success', 'Player Updated');
    } catch (error) {
      res.status(500).send('Error updating player');
    }
  }

  // Delete a player
  async deletePlayer(req, res) {
    const { teamId, id } = req.params;
    try {
      await TeamModel.deletePlayer(teamId, id);
      res.redirect(`/teams/${teamId}/players`).flash('success', 'Player Deleted');
    } catch (error) {
      res.status(500).send('Error deleting player');
    }
  }
}

module.exports = TeamController;