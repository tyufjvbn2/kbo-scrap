import { ObjectId } from "mongoose";

interface PlayInfoStructure {
	home_team_score: number;
	away_team_score: number;
	present_round: number;
	present_quarter: number;
	base_status: string;
	ball: number;
	strike: number;
	out: number;
}

export interface ScrapDataInterface {
	_id?: ObjectId;
	start_time: number;
	place: string;
	home_team: string;
	away_team: string;
	play_info: PlayInfoStructure;
	createdAt?: number;
	updatedAt?: number;
}

export interface resDataStructure {
	totalGame: ScrapDataInterface[];
	startTime: string;
	gameChecker: number;
}

// export interface newScrapDataInterface {
// 	_id?: ObjectId
// 	date: Date
// 	place: string
// 	time: string
// 	homeTeam: string
// 	awayTeam: string
// 	homeTeamScore: number
// 	awayTeamScore: number
// 	presentRound: number
// 	presentQuarter: number
// 	baseStatus: string
// 	etc: object
// }
