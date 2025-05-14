//PlayerClass.ts

import { Player } from "../interfaces/PlayerHeader";

export class PlayerClass implements Player {            //should the be private?
    constructor(
        public id: number = 0,
        public name: string,
        public number: number,
        public position: string,
        public heightFeet: number,
        public heightInches: number,
        public age: number,
    ) {}
}
