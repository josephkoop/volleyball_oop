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

    saveTournamentDB(newTournament: Tournament): void;
    editTournamentDB(id: number, name: string, venue: string, start_date: Date, end_date: Date, organizer: string, contact: string, description: string): void;
    deleteTournamentDB(): void;
}