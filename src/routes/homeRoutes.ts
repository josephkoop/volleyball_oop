import express from "express";
import {
    
} from "../controllers/tournamentController.js";

import {
    
} from "../controllers/teamController.js";

const router = express.Router();

router.get('/', main);

// Tournament routes
router.get('/tournaments', viewTournaments);
router.get('/tournaments/:id', viewEvent);

// Teams routes
router.get('/teams', viewTeams);
router.post('/teams', createTeam);
router.put('/teams/:id', editTeam);
router.delete('/teams/:id', deleteTeam);

// Players routes under specific team
router.get('/teams/:team_id/players', players);
router.post('/teams/:team_id/players', createPlayer);
router.put('/teams/:team_id/players/:id', editPlayer);
router.delete('/teams/:team_id/players/:id', deletePlayer);

export default router;
