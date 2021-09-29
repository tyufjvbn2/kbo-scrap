import { ObjectId } from "mongoose";

export interface ScrapDataInterface {
	_id?: ObjectId;
	date: string;
	placeTime: string;
	homeTeam: string;
	awayTeam: string;
	inning: string;
	score: string;
	baseState: [number | undefined];
	ballCount: string;
	detailScore: object;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface resDataStructure {
	totalGame: object;
	placeTime: string;
	gameChecker: number;
}
