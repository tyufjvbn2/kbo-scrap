import axios from "axios";
import cheerio from "cheerio";
const Data = require("../model/data");
import { resDataStructure } from "../interface/interface";
import { ScrapDataInterface } from "../interface/interface";

export const run = () => {
	interface dynamicObj {
		[key: number | string]: any;
	}

	// interface DataStructure {
	// 	date?: string;
	// 	homeTeam?: any[];
	// 	awayTeam?: any[];
	// 	inning?: any[]; //일시적값 >> 업데이트 할것 (경기종료, 경기전 예외처리 )
	// 	score?: any[]; // 경기 시작전 점수 안나오는 부분 예외처리
	// 	baseState?: dynamicObj; //일시적값 >> 업데이트 할것 (빈배열은 시작전 또는 끝난뒤 / 예외처리)
	// 	ballCount?: any[]; //일시적값 >> 업데이트 할것 ( - out은 시작전, 빈스트링은 끝난뒤 / 예외처리)
	// 	detailScore?: dynamicObj;
	// 	placeTime?: any[];
	// }

	let totalGame: ScrapDataInterface[] = [];

	const getHtml = async () => {
		try {
			return await axios.get(
				"https://www.koreabaseball.com/Schedule/ScoreBoard.aspx"
			);
		} catch (err) {
			console.error(err);
		}
	};

	return new Promise(async (resolve, reject) => {
		const data = getHtml()
			.then((html: any) => {
				const $ = cheerio.load(html.data);
				const totalGameSet = $(
					"div#cphContents_cphContents_cphContents_udpRecord"
				).children("div.smsScore");

				const baseOn =
					"//lgcxydabfbch3774324.cdn.ntruss.com/KBO_IMAGE/KBOHome/resources/images/common/base_on.png";

				let homeTeam: any[] = [];
				let awayTeam: any[] = [];
				let inning: any[] = [];
				let score: any[] = [];
				let baseState: dynamicObj = {};
				let ballCount: any[] = [];
				let detailScore: dynamicObj = {};
				let placeTime: any[] = [];

				let testbed: any[] = [];

				const date = $("ul.date li.today span.date-txt").text();

				totalGameSet.each((i, ele) => {
					ballCount.push($(ele).find("div.base").text());
					homeTeam.push(
						$(ele).find("p.leftTeam strong.teamT").text()
					);
					awayTeam.push(
						$(ele).find("p.rightTeam strong.teamT").text()
					);
					inning.push($(ele).find("strong.flag span").text());
					score.push(
						`${$(ele).find("p.leftTeam em.score").text()}-${$(ele)
							.find("p.rightTeam em.score")
							.text()}`
					);
					let tempArr: any[] = [];
					$(ele)
						.find("div.base span")
						.each((j, el) => {
							let baselive = $(el).find("img").attr("src");
							if (baselive !== undefined) {
								if (baselive === baseOn) {
									tempArr.push(1);
								} else {
									tempArr.push(0);
								}
							}
						});
					baseState[i] = tempArr;

					let n: number = 0;
					detailScore[i] = { 0: [], 1: [] };
					while (n < 2) {
						$(ele)
							.find("table.tScore tbody tr")
							.eq(n)
							.children("td")
							.each((j, el) => {
								detailScore[i][n].push($(el).text());
							});
						n++;
					}

					placeTime.push($(ele).find("p.place").text());
				});

				return {
					date,
					homeTeam,
					awayTeam,
					inning, //일시적값 >> 업데이트 할것 (경기종료, 경기전 예외처리 )
					score, // 경기 시작전 점수 안나오는 부분 예외처리
					baseState, //일시적값 >> 업데이트 할것 (빈배열은 시작전 또는 끝난뒤 / 예외처리)
					ballCount, //일시적값 >> 업데이트 할것 ( - out은 시작전, 빈스트링은 끝난뒤 / 예외처리)
					detailScore,
					placeTime,
				};
			})
			.then(async (res) => {
				console.log("raw", res);
				// dataSet = res;
				const {
					date,
					homeTeam,
					awayTeam,
					placeTime,
					inning,
					score,
					baseState,
					ballCount,
					detailScore,
				} = res;

				for (let i = 0; i < homeTeam.length; i++) {
					const eachGame = {
						date: date,
						placeTime: placeTime[i],
						homeTeam: homeTeam[i],
						awayTeam: awayTeam[i],
						inning: inning[i],
						score: score[i] === "-" ? "0-0" : score[i],
						baseState:
							baseState[i].length === 0
								? "dont update"
								: baseState[i],

						ballCount:
							ballCount[i] === "- out" || ""
								? "0-0 0out"
								: ballCount[i],
						detailScore: {
							home: {
								1: detailScore[i][0][0],
								2: detailScore[i][0][1],
								3: detailScore[i][0][2],
								4: detailScore[i][0][3],
								5: detailScore[i][0][4],
								6: detailScore[i][0][5],
								7: detailScore[i][0][6],
								8: detailScore[i][0][7],
								9: detailScore[i][0][8],
								10: detailScore[i][0][9],
								11: detailScore[i][0][10],
								12: detailScore[i][0][11],
								R: detailScore[i][0][12],
								E: detailScore[i][0][13],
								H: detailScore[i][0][14],
								B: detailScore[i][0][15],
							},
							away: {
								1: detailScore[i][1][0],
								2: detailScore[i][1][1],
								3: detailScore[i][1][2],
								4: detailScore[i][1][3],
								5: detailScore[i][1][4],
								6: detailScore[i][1][5],
								7: detailScore[i][1][6],
								8: detailScore[i][1][7],
								9: detailScore[i][1][8],
								10: detailScore[i][1][9],
								11: detailScore[i][1][10],
								12: detailScore[i][1][11],
								R: detailScore[i][1][12],
								E: detailScore[i][1][13],
								H: detailScore[i][1][14],
								B: detailScore[i][1][15],
							},
						},
					};
					totalGame.push(eachGame);
				}
				console.log("total recall?", totalGame);

				//이제 하나씩 뽑아서 atlas로 보낼거임

				console.log("why???", res.placeTime);

				let earlyTime = res.placeTime
					.map((el) => {
						return el.split(" ")[1];
					})
					.sort()[0];
				console.log("time?", earlyTime);

				let gameCheker = res.inning.reduce((acc, el) => {
					if (el === "경기종료") {
						acc++;
					}
					return acc;
				}, 0);

				return {
					totalGame: totalGame,
					startTime: earlyTime,
					gameChecker: gameCheker,
				};
			});

		resolve(data);
	});

	// console.log("return ok?", totalGame);
	// return totalGame;
};
