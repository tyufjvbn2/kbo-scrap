import express from "express";
import { run } from "./machine/scrap";
import { create } from "./machine/create";
import { update } from "./machine/update";
import schedule from "node-schedule";
import { data } from "cheerio/lib/api/attributes";
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

function start() {
	return new Promise((resolve, reject) => {
		const data = run();

		resolve(data);
	});
}

let timeCheck;

//하루 한번만(날짜 바뀔때)
// schedule.scheduleJob("0 0 0 * * *", () => {
start().then((data: any) => {
	create(data.totalGame);
	console.log("placeTime?", data.placeTime);
	let trimmed = data.placeTime.map((el) => {
		return el.split(" ")[1];
	});
	console.log("trimmed?", trimmed);
});
// });

//경기 시작 30분 전부터 끝나고 30분 후까지 계속
schedule.scheduleJob("0 0 15 * * *", () => {
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
