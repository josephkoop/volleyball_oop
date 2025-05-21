import { Router } from "express";
import {
    getLogin, postLogin, getSignup, postSignup, logout, getUserManagement, postAddAdmin, postDeleteUser
} from "../controllers/userController";
import {
    index, viewTeams, createTeam, editTeam, deleteTeam,
    viewPlayers, createPlayer, editPlayer, deletePlayer, validateTeam
} from "../controllers/teamController";
import {
    viewTournaments, viewEvent, createTournament, editTournament,
    deleteTournament, validateTournament, startTournament,
    finishTournament, addRound, deleteRound, saveRound
} from "../controllers/tournamentController";
import { isAuthenticated, isNotAuthenticated, isAdmin } from "../middleware/auth";

const router = Router();

router.get('/', (req, res) => res.redirect('/home'));
router.get('/home', index);

router.get("/login", isNotAuthenticated, getLogin);
router.post("/login", isNotAuthenticated, postLogin);
router.get("/logout", isAuthenticated, logout); // protected

// User routes (admin only)
router.get("/users", isAdmin, getUserManagement);
router.post("/users/add", isAdmin, postAddAdmin);
router.post("/users/delete", isAdmin, postDeleteUser);

// Tournament routes
router.get('/tournaments', viewTournaments);
router.post('/tournaments/add', isAuthenticated, validateTournament, createTournament);
router.get('/tournaments/:id', viewEvent);
router.post('/tournaments/edit', isAuthenticated, validateTournament, editTournament);
router.post('/tournaments/delete', isAuthenticated, deleteTournament);
router.post('/tournaments/start', isAuthenticated, startTournament);
router.post('/tournaments/finish', isAuthenticated, finishTournament);
router.post('/tournaments/rounds/add', isAuthenticated, addRound);
router.post('/tournaments/rounds/save', isAuthenticated, saveRound);
router.post('/tournaments/rounds/delete', isAuthenticated, deleteRound);

// Teams routes
router.get('/teams', viewTeams);
router.post('/teams/add', isAuthenticated, validateTeam, createTeam);
router.post('/teams/edit', isAuthenticated, validateTeam, editTeam);
router.post('/teams/delete', isAuthenticated, deleteTeam);

// Players routes under specific team
router.get('/teams/:teamId/players', viewPlayers);
router.post('/teams/:teamId/players/add', isAuthenticated, createPlayer);
router.post('/teams/:teamId/players/edit', isAuthenticated, editPlayer);
router.post('/teams/:teamId/players/delete', isAuthenticated, deletePlayer);

export default router;
