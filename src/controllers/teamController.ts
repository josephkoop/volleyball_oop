//teamController.ts

import { TeamClass } from '../models/TeamClass';
import { PlayerClass } from '../models/PlayerClass';
import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import path from 'path';

export const index = async (req: Request, res: Response): Promise<void> => {            //move this function to different controller
    try {
        res.render('home');
    } catch (error) {
        console.error('Controller index error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
}

// Get all teams
export const viewTeams = async(req: Request, res: Response): Promise<void> => {
    try {
        const teams = await TeamClass.viewTeamsDB();
        res.render('teams', { 
            teams 
        });
    } catch (error) {
        console.error('Controller viewTeams error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
}

  // Get players for a specific team
export const viewPlayers = async(req: Request, res: Response): Promise<void> => {
    const { teamId } = req.params;
    try {
        const team = await TeamClass.getTeamDB(parseInt(teamId, 10));
        const teams = await TeamClass.viewTeamsDB();
        let players;
        if(team){
            players = await team.viewPlayersDB();
        }
        res.render('players', { team, teams, players });
    } catch (error) {
        console.error('Controller viewPlayers error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
}

export const validateTeam = [
    body('name').notEmpty().withMessage('Name is required.'),
    body('rank').isInt({ min: 1 }).withMessage('Rank must be a positive integer.'),
    body('location').notEmpty().withMessage('Location is required.'),
];
  
// Create
export const createTeam = async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, rank, location } = req.body;
    try {
      const newTeam = new TeamClass(undefined, name, rank, location);
      await newTeam.saveTeamDB();
      res.status(201).json({ message: 'Team added successfully', team: newTeam });
    } catch (error) {
      console.error('createTeam error:', error);
      res.status(500).json({ error: 'An error occured.' });
    }
};
  
  // Edit
export const editTeam = async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { id, name, location, rank } = req.body;
    try {
      const team = await TeamClass.getTeamDB(parseInt(id, 10));
      if (!team) return res.status(404).json({ error: 'Team not found' });
  
      team.name = name;
      team.location = location;
      team.rank = rank;
      await team.editTeamDB();
      
      res.status(200).json({ message: 'Team updated successfully' });
    } catch (error) {
      console.error('editTeam error:', error);
      res.status(500).json({ error: 'An error occured.' });
    }
};

  // Delete
  export const deleteTeam = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;
    try {
      const team = await TeamClass.getTeamDB(parseInt(id, 10));
      if (!team) return res.status(404).json({ error: 'Team not found' });
  
      await team.deleteTeamDB();
      res.status(200).json({ message: 'Team deleted successfully' });
    } catch (error) {
      console.error('deleteTeam error:', error);
      res.status(500).json({ error: 'An error occured.' });
    }
  };

  // Create a player
export const createPlayer = async(req: Request, res: Response): Promise<void> => {
    const { teamId } = req.params;
    const { name, number, position, heightFeet, heightInches, age } = req.body;
    try {
        const team = await TeamClass.getTeamDB(parseInt(teamId, 10));
        if(team){
            const newPlayer = new PlayerClass(
                undefined,
                name,
                number,
                position,
                heightFeet,
                heightInches,
                age
            );
        
            team.savePlayerDB(newPlayer);  
        }

        res.redirect(`/teams/${teamId}/players`)           //.flash('success', 'Player Added');
    } catch (error) {
        console.error('Controller createPlayer error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
  }

  // Edit a player
export const editPlayer = async(req: Request, res: Response): Promise<void> => {
    const { teamId } = req.params;
    const { id, name, number, position, heightFeet, heightInches, age, newTeamId } = req.body;          //Match newTeamId on front end
    try {
        const team = await TeamClass.getTeamDB(parseInt(newTeamId, 10));
        if(team){
            await team.editPlayerDB(parseInt(id, 10), name, number, position, heightFeet, heightInches, age);
        }
        res.redirect(`/teams/${teamId}/players`)           //.flash('success', 'Player Updated');
    } catch (error) {
        console.error('Controller editPlayer error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
  }

  // Delete a player
export const deletePlayer = async(req: Request, res: Response): Promise<void> => {
    const { teamId } = req.params;
    const { id } = req.body;
    try {
        const team = await TeamClass.getTeamDB(parseInt(teamId, 10));
        if(team){
            await team.deletePlayerDB(parseInt(id, 10));
        }
        res.redirect(`/teams/${teamId}/players`)           //.flash('success', 'Player Deleted');
    } catch (error) {
        console.error('Controller deletePlayer error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
}