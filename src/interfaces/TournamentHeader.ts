//TournamentHeader.ts

export interface Tournament {
    id: number,
    name: string,
    venue: string,
    start_date: Date,
    end_date: Date,
    organizer: string,       //should link to users later. organizer_id
    contact: string,
    status: string,             //should be either Future, Ongoing, or Finished
    description: string,

    saveTournamentDB(newTournament: Tournament): any;
    editTournamentDB(): any;
    deleteTournamentDB(): any;
    addParticipantDB(team_id: number): any;
    updateTournamentDB(status: string): any;
    finishTournamentDB(): any;

    addRoundDB(name: string): any;
    saveRoundDB(): any;
    deleteRoundDB(round_id: number): any;
    addGameDB(round_id: number): any;
    editGameDB(game_id: number, par1: number, par2: number): any;
    deleteSetsDB(game_id: number): any;
    addSetDB(game_id: number, points1: number, points2: number): any;
}