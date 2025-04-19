import { TeamClass } from '../models/TeamClass';
import { Request, Response } from 'express';
import path from 'path';

export const index = async (req: Request, res: Response): Promise<void> => {
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
    const { team_id } = req.params;
    //console.log("id is ", team_id);
    try {
        const team = await TeamClass.selectTeamDB(parseInt(team_id, 10));
        const players = await TeamClass.viewPlayersDB(parseInt(team_id, 10));
        console.log('controller: ', team);
        res.render('players', { team, players });
    } catch (error) {
        console.error('Controller viewPlayers error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
}

  // Create a new team
export const createTeam = async(req: Request, res: Response): Promise<void> => {
    const { name, location } = req.body;
    try {
        const newTeam = await TeamClass.createTeamDB(name, location);
        res.redirect('/teams')         //.flash('success', 'Team Added');
    } catch (error) {
        console.error('Controller createTeam error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
  }

  // Edit an existing team
export const editTeam = async(req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, location, rank } = req.body;
    try {
        const updatedTeam = await TeamClass.editTeamDB(parseInt(id, 10), name, location, rank);
        res.redirect('/teams')         //.flash('success', 'Team Updated');
    } catch (error) {
        console.error('Controller editTeam error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
  }

  // Delete a team
export const deleteTeam = async(req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        await TeamClass.deleteTeamDB(parseInt(id, 10));
        res.redirect('/teams')         //.flash('success', 'Team Deleted');
    } catch (error) {
        console.error('Controller deleteTeam error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
  }

  // Create a player
export const createPlayer = async(req: Request, res: Response): Promise<void> => {
    const { name, teamId, number, position, heightFeet, heightInches, age, image } = req.body;
    try {
        await TeamClass.createPlayerDB(name, teamId, number, position, heightFeet, heightInches, age, image || 'images/profile.jpg');
        res.redirect(`/teams/${teamId}/players`)           //.flash('success', 'Player Added');
    } catch (error) {
        console.error('Controller createPlayer error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
  }

  // Edit a player
export const editPlayer = async(req: Request, res: Response): Promise<void> => {
    const { id, teamId } = req.params;
    const { name, number, position, heightFeet, heightInches, age, image } = req.body;
    try {
        await TeamClass.editPlayerDB(parseInt(id, 10), name, parseInt(teamId, 10), number, position, heightFeet, heightInches, age, image || 'images/profile.jpg');
        res.redirect(`/teams/${teamId}/players`)           //.flash('success', 'Player Updated');
    } catch (error) {
        console.error('Controller editPlayer error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
  }

  // Delete a player
export const deletePlayer = async(req: Request, res: Response): Promise<void> => {
    const { teamId, id } = req.params;
    try {
        await TeamClass.deletePlayerDB(parseInt(teamId, 10), parseInt(id, 10));
        res.redirect(`/teams/${teamId}/players`)           //.flash('success', 'Player Deleted');
    } catch (error) {
        console.error('Controller deletePlayer error: ', error);
        res.status(500).json({ err: 'An error occured.' });
    }
}