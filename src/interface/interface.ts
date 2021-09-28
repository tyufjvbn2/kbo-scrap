import { ObjectId } from "mongoose";

export interface ScrapDataInterface {
	_id: ObjectId;
	date: Date;
	placeTime: string;
	homeTeam: string;
	awayTeam: string;
	inning: string;
	score: string;
	baseState: [number | undefined];
	ballCount: string;
	detailScore: object;
	createdAt: Date;
	updatedAt: Date;
}
