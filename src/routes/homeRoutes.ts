import { Router } from "express";
import { 
    getLogin, postLogin, getSignup, postSignup, logout, getDashboard, getUserManagement, postAddAdmin, postDeleteUser
} from "../controllers/userController";

import {
    index, viewTeams, createTeam, editTeam, deleteTeam, viewPlayers, createPlayer, editPlayer, deletePlayer, validateTeam
} from "../controllers/teamController";

import {
    viewTournaments, viewEvent, createTournament, editTournament, deleteTournament, validateTournament, startTournament, finishTournament, addRound, deleteRound, saveRound
} from "../controllers/tournamentController";

const router = Router();


router.get('/', (req, res) => res.redirect('/home'));
router.get('/home', index);

router.get("/login", getLogin);
router.post("/login", postLogin);

router.get("/logout", logout);


// User routes
router.get("/users", getUserManagement);  // User management route
router.post("/users/add-admin", postAddAdmin);  // Add admin
router.post("/users/delete-user", postDeleteUser);  // Delete user (admin or regular)
router.get("/users/signup", getSignup);
router.post("/users/signup", postSignup);


// Tournament routes
router.get('/tournaments', viewTournaments);
router.post('/tournaments/add', validateTournament, createTournament);

router.get('/tournaments/:id', viewEvent);
router.post('/tournaments/edit', validateTournament, editTournament);
router.post('/tournaments/delete', deleteTournament);
router.post('/tournaments/start', startTournament);
router.post('/tournaments/finish', finishTournament);
router.post('/tournaments/rounds/add', addRound);
router.post('/tournaments/rounds/save', saveRound);
router.post('/tournaments/rounds/delete', deleteRound);


// Teams routes
router.get('/teams', viewTeams);
router.post('/teams/add', validateTeam, createTeam);
router.post('/teams/edit', validateTeam, editTeam);               //using post for all
router.post('/teams/delete', deleteTeam);


// Players routes under specific team
router.get('/teams/:teamId/players', viewPlayers);
router.post('/teams/:teamId/players/add', createPlayer);
router.post('/teams/:teamId/players/edit', editPlayer);
router.post('/teams/:teamId/players/delete', deletePlayer);


export default router;
