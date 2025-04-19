"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const router = express_1.default.Router();
router.get('/', teamController_1.index);
// Tournament routes
// router.get('/tournaments', viewTournaments);
// router.get('/tournaments/:id', viewEvent);
// Teams routes
// router.get('/teams', viewTeams);
// router.post('/teams', createTeam);
// router.put('/teams/:id', editTeam);
// router.delete('/teams/:id', deleteTeam);
// Players routes under specific team
// router.get('/teams/:team_id/players', players);
// router.post('/teams/:team_id/players', createPlayer);
// router.put('/teams/:team_id/players/:id', editPlayer);
// router.delete('/teams/:team_id/players/:id', deletePlayer);
exports.default = router;
