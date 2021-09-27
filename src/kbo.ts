import axios from "axios";
import cheerio from "cheerio";

interface dynamicObj {
	[key: number | string]: any;
}

const getHtml = async () => {
	try {
		return await axios.get(
			"https://www.koreabaseball.com/Schedule/ScoreBoard.aspx"
		);
	} catch (err) {
		console.error(err);
	}
};

getHtml()
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
			homeTeam.push($(ele).find("p.leftTeam strong.teamT").text());
			awayTeam.push($(ele).find("p.rightTeam strong.teamT").text());
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

		// const scoreObj = {
		// 	1: "",
		// 	2: "",
		// 	3: "",
		// 	4: "",
		// 	5: "",
		// 	6: "",
		// 	7: "",
		// 	8: "",
		// 	9: "",
		// 	10: "",
		// 	11: "",
		// 	12: "",
		// 	R: "",
		// 	H: "",
		// 	E: "",
		// 	B: "",
		// };
	})
	.then((res) => {
		console.log(res);
		const {
			date,
			homeTeam,
			awayTeam,
			inning,
			score,
			baseState,
			ballCount,
			detailScore,
			placeTime,
		} = res;
		const gameCount = res.homeTeam.length;

		// for (let i = 0; i < gameCount; i++)
		// 	let dataMold = {
		// 		date: date,
		// 		time: "",
		// 		homeTeam: "",
		// 		awayTeam: "",
		// 	};

		//이제 하나씩 뽑아서 atlas로 보낼거임
	});
