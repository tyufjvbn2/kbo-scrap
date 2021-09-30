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
	totalGame: newScrapDataInterface[];
	startTime: string;
	gameChecker: number;
}

export interface newScrapDataInterface {
	_id?: ObjectId
	date: Date
	place: string
	time: string
	homeTeam: string
	awayTeam: string
	homeTeamScore: number
	awayTeamScore: number
	presentRound: number
	presentQuarter: number
	baseStatus: string
	etc: object
}