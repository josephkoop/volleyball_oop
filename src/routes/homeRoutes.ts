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
    index, viewTeams, createTeam, editTeam, deleteTeam, viewPlayers, createPlayer, editPlayer, deletePlayer, validateTeam
} from "../controllers/teamController";

import {
    viewTournaments, viewEvent, createTournament, editTournament, deleteTournament, validateTournament
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
router.post('/home/tournaments/add', validateTournament, createTournament);

router.get('/home/tournaments/:id', viewEvent);
router.post('/home/tournaments/edit', validateTournament, editTournament);
router.post('/home/tournaments/delete', deleteTournament);


// Teams routes
router.get('/home/teams', viewTeams);
router.post('/home/teams/add', validateTeam, createTeam);
router.post('/home/teams/edit', validateTeam, editTeam);               //using post for all
router.post('/home/teams/delete', deleteTeam);


// Players routes under specific team
router.get('/home/teams/:teamId/players', viewPlayers);
router.post('/home/teams/:teamId/players/add', createPlayer);
router.post('/home/teams/:teamId/players/edit', editPlayer);
router.post('/home/teams/:teamId/players/delete', deletePlayer);


export default router;
