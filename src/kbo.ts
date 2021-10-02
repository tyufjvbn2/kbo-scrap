import express from "express";
import schedule from "node-schedule";
import { run } from "./machine/scrap";
import { create } from "./machine/create";
// import { update } from "./machine/update";
import { repeater } from "./machine/repeat";
// import { ScrapDataInterface } from "./interface/interface";
import { resDataStructure } from "./interface/interface";
const mongooseConfig = require("./config/config");

try {
	mongooseConfig();
	const app = express();

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	let startTime: string[] = [];

	function scrap() {
		return new Promise<resDataStructure>(async (resolve, reject) => {
			let data = await run();

			resolve(data);
		});
	}

	function init() {
		scrap().then((data: resDataStructure) => {
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
			scrap().then((data: resDataStructure) => {
				console.log("Trying to catch time...");
				startTime = data.startTime.split(":");
				return updater();
			});
		} else {
			console.log("We catch game start time. It will be start on time");

			//현재시간 확인
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
				// repeat;
				repeater();
				console.log("too late end");
			} else if (trimmedStartTime > trimmedCurrentTime) {
				console.log("not yet");
				//경기 시작시간보다 미리 켠 경우
				//지정된 경기 시작시간에 start, 모든 경기 끝나는 순간 end
				schedule.scheduleJob(
					`0 ${startTime[1]} ${startTime[0]} * * *`,
					repeater
				);
			}
		}
	};

	const dailyRepeat = () => {
		schedule.scheduleJob("0 0 0 * * *", () => {
			init()
			updater()
		})
	}
	
	//하루 한번만 실행(날짜 바뀔때) 또는 서버 실행시 바로 실행
	dailyRepeat()  //실행 예약하기
	init();        //초기스크랩 실행
	updater();     //업데이트 진행

	const router = express.Router();

	app.use(router);

	router.get("/", (req, res) => {
		res.status(200).send("Scrap Server!!");
	});

	// router.get("/data", (req, res) => {
	// 	res.status(200).json({ data: data });
	// });

	app.listen(3333, () => {
		console.log("Data scraping servering is running");
	});
} catch (err) {
	console.error("Scraping Server running problem : ", err);
}
