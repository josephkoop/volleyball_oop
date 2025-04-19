import express from "express";
import {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    logout,
    getDashboard,
    getUserManagement,
    postAddAdmin,
    postDeleteUser
} from "../controllers/authController.js";

import {
    index, viewTeams, createTeam, editTeam, deleteTeam, viewPlayers, createPlayer, editPlayer, deletePlayer
} from "../controllers/teamController";

import {
    viewTournaments, viewEvent
} from "../controllers/tournamentController";

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/logout", logout);

router.get("/dashboard", getDashboard);

router.get("/usermanagement", getUserManagement);  // User management route
router.post("/usermanagement/add-admin", postAddAdmin);  // Add admin
router.post("/usermanagement/delete-user", postDeleteUser);  // Delete user (admin or regular)



router.get('/home', index);


// Tournament routes
router.get('/home/tournaments', viewTournaments);
router.get('/home/tournaments/:id', viewEvent);


// Teams routes
router.get('/home/teams', viewTeams);
router.post('/home/teams', createTeam);
router.put('/home/teams/:id', editTeam);
router.delete('/home/teams/:id', deleteTeam);


// Players routes under specific team
router.get('/home/teams/:team_id/players', viewPlayers);
router.post('/home/teams/:team_id/players', createPlayer);
router.put('/home/teams/:team_id/players/:id', editPlayer);
router.delete('/home/teams/:team_id/players/:id', deletePlayer);


export default router;
