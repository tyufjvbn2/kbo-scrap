import express from "express";
import { run } from "./machine/scrap";
import { create } from "./machine/create";
import { update } from "./machine/update";
import schedule from "node-schedule";
const mongooseConfig = require("./config/config");
// import { ScrapDataInterface } from "./interface/interface";
import { resDataStructure } from "./interface/interface";

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

	//하루 한번만 실행(날짜 바뀔때) 또는 실행시 바로 실행
	init();
	schedule.scheduleJob("0 0 0 * * *", () => {
		init();
	});

	const updater = () => {
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

			const repeater = setInterval(() => {
				//종료할건지 계속 체크해야 함
				scrap().then((data: resDataStructure) => {
					//아직 진행중인 경기가 있을때
					if (data.gameChecker !== data.totalGame.length) {
						update(data.totalGame);
					} else {
						//모든 경기 종료시
						console.log("All game end");
						clearInterval(repeater);
					}
				});
			}, 5000);

			console.log("check point");
			console.log("current", trimmedCurrentTime);
			console.log("plan", trimmedStartTime);

			//경기 시작시간보다 서버 늦게 켜진 경우
			if (trimmedStartTime <= trimmedCurrentTime) {
				repeater;
			} else {
				//경기 시작시간보다 미리 켠 경우
				//지정된 경기 시작시간에 start, 모든 경기 끝나는 순간 end
				schedule.scheduleJob(
					`0 ${startTime[1]} ${startTime[0]} * * *`,
					() => repeater
				);
			}
		}
	};

	updater();

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
