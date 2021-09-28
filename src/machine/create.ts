const Data = require("../model/data");
// import { ScrapDataInterface } from "../interface/interface";
// import { ObjectId } from "mongoose";

// interface ScrapDataInterface {
// 	_id: ObjectId;
// 	date: Date;
// 	placeTime: string;
// 	homeTeam: string;
// 	awayTeam: string;
// 	inning: string;
// 	score: string;
// 	baseState: [number | undefined];
// 	ballCount: string;
// 	detailScore: object;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

export const create = (scrapData: any) => {
	console.log("create come?", scrapData);
	scrapData.forEach(async (ele: any) => {
		const uniqueKey = {
			date: ele.date,
			placeTime: ele.placeTime,
			homeTeam: ele.homeTeam,
			awayTeam: ele.awayTeam,
		};

		const newData = await Data.findOneAndUpdate(
			uniqueKey,
			{
				...ele,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{ upsert: true }
		);
		console.log("each data?", newData);
	});
};
