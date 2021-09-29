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

let startTime;

const start = () => {
	return new Promise(async (resolve, reject) => {
		const data = await run();

		resolve(data);
	});
};

//하루 한번만(날짜 바뀔때)
// schedule.scheduleJob("0 0 0 * * *", () => {
start().then((data: any) => {
	console.log("your shape?", data);
	create(data.totalGame);
	console.log("start time?", data.startTime);
	startTime = data.startTime;
});
// });

//경기 시작 30분 전부터 끝나고 30분 후까지 계속
schedule.scheduleJob("0 2 10 * * *", () => {
	start().then((data: any) => {
		setInterval(() => {
			update(data.totalGame);
		}, 8000);
	});
});

// run();
// const work = async () => {
// 	//스크래핑 데이터
// 	const data = run();

// 	console.log("start");

// 	setTimeout(() => {
// 		create(data);
// 	}, 5000);
// 	//db에 초기값 생성

// 	//경기 시작 후에 값 찍기 시작
// 	await update(data);

// 	console.log("end");
// };

// work();

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
