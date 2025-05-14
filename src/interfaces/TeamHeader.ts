//TeamHeader.ts

import { Player } from "./PlayerHeader";

export interface Team {
    id: number,
    name: string,
    rank: number,
    location: string

    saveTeamDB(newTeam: Team): void;
    editTeamDB(id: number, name: string, location: string, rank: number): void;
    deleteTeamDB(): void;

    viewPlayersDB(): void;
    savePlayerDB(newPlayer: Player): void;
    editPlayerDB(id: number, name: string, number: number, position: string, heightFeet: number, heightInches: number, age: number): void;
    deletePlayerDB(id: number): void;
}