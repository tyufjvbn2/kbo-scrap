import express from "express";
import { run } from "./machine/scrap";
import { create } from "./machine/create";
import { update } from "./machine/update";
import schedule from "node-schedule";
// import { ScrapDataInterface } from "./interface/interface";

// interface resDataStructure {
// 	totalGame: object
// 	placeTime: [string]
// }

const mongooseConfig = require("./config/config");

mongooseConfig();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let startTime = [];

const start = () => {
	return new Promise(async (resolve, reject) => {
		const data = await run();

		resolve(data);
	});
};

//하루 한번만(날짜 바뀔때)
schedule.scheduleJob("0 0 0 * * *", () => {
	start().then((data: any) => {
		console.log("your shape?", data);
		create(data.totalGame);
		console.log("start time?", data.startTime);
		startTime = data.startTime.split(":");

		console.log("checker?", data.gameChecker);
	});
});

const updater = () => {
	//시작시간을 catch하지 못한경우
	if (startTime.length === 0) {
		console.error("We failed to catch time of game start");
		start().then((data: any) => {
			console.log("Trying to catch time...");
			startTime = data.startTime.split(":");
			return updater();
		});
	} else {
		console.log("We catch game start time. It will be start on time");
		//지정된 경기 시작시간에 start, 모든 경기 끝나는 순간 end
		schedule.scheduleJob(`0 ${startTime[1]} ${startTime[0]} * * *`, () => {
			start().then((data: any) => {
				//종료할건지 계속 체크해야 함
				const repeat = setInterval(() => {
					if (data.gameChecker !== data.totalGame.length) {
						update(data.totalGame);
					} else {
						console.log("All game end");
						clearInterval(repeat);
					}
				}, 8000);
			});
		});
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
