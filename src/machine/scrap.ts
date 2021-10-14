import axios from "axios";
import cheerio from "cheerio";
import { resDataStructure } from "../interface/interface";
import { ScrapDataInterface } from "../interface/interface";
import { timeChanger } from "./timechange";

export const run = () => {
	console.log("scrap start");
	interface dynamicObj {
		[key: number | string]: any;
	}

	const regex = /[^0-9]/g;

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
			console.error("Catching html error : ", err);
		}
	};

	return new Promise<resDataStructure>(async (resolve, reject) => {
		const data = getHtml()
			.then((html: any) => {
				const $ = cheerio.load(html.data);
				const totalGameSet = $(
					"div#cphContents_cphContents_cphContents_udpRecord"
				).children("div.smsScore");

				const baseOn =
					"//lgcxydabfbch3774324.cdn.ntruss.com/KBO_IMAGE/KBOHome/resources/images/common/base_on.png";

				let homeTeam: string[] = [];
				let awayTeam: string[] = [];
				let inning: string[] = [];
				let score: string[] = [];
				let baseState: dynamicObj = {};
				let ballCount: string[] = [];
				let detailScore: dynamicObj = {};
				let placeTime: string[] = [];

				// let testbed: any[] = [];

				const date = $("ul.date li.today span.date-txt").text();

				totalGameSet.each((i, ele) => {
					ballCount.push($(ele).find("div.base").text());
					homeTeam.push(
						$(ele).find("p.rightTeam strong.teamT").text()
					);
					awayTeam.push(
						$(ele).find("p.leftTeam strong.teamT").text()
					);
					inning.push($(ele).find("strong.flag span").text());
					score.push(
						`${$(ele).find("p.rightTeam em.score").text()}-${$(ele)
							.find("p.leftTeam em.score")
							.text()}`
					);
					let tempArr: number[] = [];
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

				console.log("scrap end");

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
					// detailScore,
				} = res;

				for (let i = 0; i < homeTeam.length; i++) {
					let eachRound;
					let eachQuarter = 0;

					if (inning[i] === "경기전") {
						eachRound = -1;
						eachQuarter = -1;
					} else if (inning[i] === "경기종료") {
						eachRound = 100;
						eachQuarter = 100;
					} else {
						eachRound = Number(inning[i].replace(regex, ""));
						if (inning[i].slice(-1) === "초") {
							eachQuarter = 1;
						} else if (inning[i].slice(-1) === "말") {
							eachQuarter = 2;
						}
					}

					//aws상에는 start_time에 time changer가 적용되어 있음 (kst값으로 저장됨)
					//로컬에서는 timeChanger 처리 (utc값으로 출력됨)
					const eachGame = {
						start_time: timeChanger(
							date + placeTime[i].split(" ")[1]
						).getTime(),
						content_id: 0,
						place: placeTime[i].split(" ")[0],
						home_team: homeTeam[i],
						away_team: awayTeam[i],
						play_info: {
							home_team: homeTeam[i],
							away_team: awayTeam[i],
							home_team_score:
								score[i] === "-"
									? 0
									: Number(score[i].split("-")[0]),
							away_team_score:
								score[i] === "-"
									? 0
									: Number(score[i].split("-")[1]),
							present_round: eachRound, //시작전 -1, 종료 100, 나머지는 해당 회의 숫자
							present_quarter: eachQuarter, // 경기전 -1, 경기종료 100, 초 1, 말 2
							base_status:
								baseState[i].length === 0
									? "000" //경기 종료후 베이스 초기화
									: baseState[i].join(""),
							ball:
								ballCount[i] === "- out" || ballCount[i] === ""
									? -1
									: Number(ballCount[i].split("-")[0]),
							strike:
								ballCount[i] === "- out" || ballCount[i] === ""
									? -1
									: Number(
											ballCount[i]
												.split("-")[1]
												.split(" ")[0]
									  ),
							out:
								ballCount[i] === "- out" || ballCount[i] === ""
									? -1
									: Number(
											ballCount[i]
												.split("-")[1]
												.split(" ")[1]
												.replace(regex, "")
									  ),
						},
					};
					totalGame.push(eachGame);
				}
				console.log("total recall?", totalGame);

				//이제 하나씩 뽑아서 atlas로 보내기

				console.log("game schedule?", res.placeTime);

				let earlyTime = res.placeTime
					.map((el) => {
						return el.split(" ")[1];
					})
					.sort()[0];
				console.log("most early time?", earlyTime);

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
