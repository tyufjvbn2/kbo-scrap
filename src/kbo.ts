import express from "express";
import schedule from "node-schedule";
import cors from "cors";
import * as dotenv from "dotenv";
import { run } from "./machine/scrap";
import { create } from "./machine/create";
// import { update } from "./machine/update";
import { repeater } from "./machine/repeat";
// import { ScrapDataInterface } from "./interface/interface";
import { resDataStructure } from "./interface/interface";
const mongooseConfig = require("./config/config");
const Kbo_crawl = require("./model/data");
dotenv.config();

// let daily
let routine: any;

try {
	mongooseConfig();
	const app = express();

	app.use(cors());

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	let startTime: string[] = [];

	function scrap() {
		return new Promise<resDataStructure | undefined>(
			async (resolve, reject) => {
				let data = await run();

				resolve(data);
			}
		);
	}

	function init() {
		scrap().then((data: any) => {
			console.log("your shape?", data);
			create(data.totalGame);
			console.log("start time?", data.startTime);
			startTime = data.startTime.split(":");

			console.log("checker?", data.gameChecker);
		});
	}
	const updater = () => {
		console.log("normal updater");
		//시작시간을 catch하지 못한경우
		if (startTime.length === 0) {
			console.error("We failed to catch time of game start");
			scrap().then((data: any) => {
				console.log("Trying to catch time...");
				startTime = data.startTime.split(":");
				return updater();
			});
		} else {
			console.log("We catch game start time. It will be start on time");

			//현재시간 확인
			//로컬에서는 new date만
			//aws에서는 +9시간 적용되어야 함
			let currentTime = new Date()
				.toString()
				.split(" ")[4]
				.slice(0, 5)
				.split(":");

			let trimmedStartTime = Number(startTime.join(""));
			let trimmedCurrentTime = Number(currentTime.join(""));

			console.log("time done");

			console.log("check point");
			console.log("current", trimmedCurrentTime);
			console.log("plan", trimmedStartTime);

			//경기 시작시간보다 서버 늦게 켜진 경우
			if (trimmedStartTime <= trimmedCurrentTime) {
				console.log("too late");
				//반복실행
				repeater();
				console.log("too late end");
			} else if (trimmedStartTime > trimmedCurrentTime) {
				console.log("not yet");
				//경기 시작시간보다 미리 켠 경우
				//지정된 경기 시작시간에 start, 모든 경기 끝나는 순간 end
				routine = schedule.scheduleJob(
					`0 ${startTime[1]} ${startTime[0]} * * *`,
					repeater
				);
				console.log("cron schedule add!");
			}
		}
	};

	const dailyRepeat = () => {
		console.log("daily routine start!");
		schedule.scheduleJob("0 0 0 * * *", () => {
			if (!routine) {
				console.log("cron didn't set. I will set again");
			} else {
				routine.cancel();
				console.log("cron schedule reset!");
			}
			init();
			updater();
		});
	};

	//하루 한번만 실행(날짜 바뀔때) 또는 서버 실행시 바로 실행
	dailyRepeat(); //실행 예약하기
	init(); //초기스크랩 실행
	updater(); //업데이트 진행

	const router = express.Router();

	app.use(router);

	router.get("/", (req, res) => {
		res.status(200).send("Scrap Server!!");
	});

	// router.post("/content/kbo/", async (req, res) => {
	// 	const target = await Kbo_crawl.findOne({ play_key: req.body.play_key });
	// 	console.log("content_id update", target);

	// 	if (!target) {
	// 		res.status(403).json({ message: "There is no play key in DB" });
	// 	} else {
	// 		const updatedData = await Kbo_crawl.findOneAndUpdate(
	// 			{ play_key: req.body.play_key },
	// 			{ content_id: req.body.content_id }
	// 		);
	// 		console.log("update?", updatedData);
	// 		res.status(200).json({ message: "Content ID update success!" });
	// 	}

	// 	//게임 찾고 req의 값 받아서 업데이트,
	// 	//업데이트 된 값 내려주기
	// });

	// router.get("/data", (req, res) => {
	// 	res.status(200).json({ data: data });
	// });

	app.listen(process.env.PORT, () => {
		console.log("Data scraping servering is running");
	});
} catch (err) {
	console.error("Scraping Server running problem : ", err);
}
