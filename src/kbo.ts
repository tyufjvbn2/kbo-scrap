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
		// console.log("length?", totalgameset.length);

		const baseOn =
			"//lgcxydabfbch3774324.cdn.ntruss.com/KBO_IMAGE/KBOHome/resources/images/common/base_on.png";

		let homeTeam: any[] = [];
		let awayTeam: any[] = [];
		let inning: any[] = [];
		let score: any[] = [];
		let baseState: dynamicObj = {};
		let ballCount: any[] = [];
		let eachInningScore: dynamicObj = {};

		let testbed2: any[] = [];

		let testObj: dynamicObj = {};

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

			let n: number = 0;

			while (n < 2) {
				let testbed: any[] = [];
				$(ele)
					.find("table.tScore tbody tr")
					.eq(n)
					.children("td")
					.each((j, el) => {
						// const colName = $(el).text()
						testbed.push($(el).text());
					});
				n++;
				testObj[i][n] = testbed;
			}

			//홈팀 점수만
			// $(ele)
			// 	.find("table.tScore tbody tr")
			// 	.eq(0)
			// 	.children("td")
			// 	.each((j, el) => {
			// 		// const colName = $(el).text()
			// 		testbed.push($(el).text());
			// 	});

			//어웨이팀 점수만
			// $(ele)
			// 	.find("table.tScore tbody tr")
			// 	.eq(1)
			// 	.children("td")
			// 	.each((j, el) => {
			// 		// const colName = $(el).text()
			// 		testbed2.push($(el).text());
			// 	});
		});

		return {
			homeTeam,
			awayTeam,
			inning,
			score,
			baseState,
			ballCount,
			testObj,
			// testbed,
			// testbed2,
		};

		/*
		let root: any[] = [];
		let game: dynamicObj = {};
		let base: any[] = [];
		let onebasestate: any[] = [];
		let totalballcount: any[] = [];
		let test: any[] = [];
		// let changeList: any[] = [];
		// let ballList: any[] = [];
		// let when: any[] = [];
		// const bodyList = $("div.content_scroll").children("div.inner");
		// const big = $(
		// 	"div#cphContents_cphContents_cphContents_udpRecord"
		// ).children("div.smsScore");


		const game2base1 = $(
			"div#cphContents_cphContents_cphContents_udpRecord div.smsScore div.score_wrap div.base span.base1"
		).eq(1);
		const sosmall = $(
			"div#cphContents_cphContents_cphContents_udpRecord div.smsScore div.score_wrap div.base"
		);

		root.push($.root().html());
		// const trimed = big.text().split("\n");
		// console.log("trimed", trimed);

		onebasestate.push(game2base1.find("img").attr("src"));

		totalballcount.push(sosmall.text());
		big.each((i, ele) => {
			test[i] = {
				data: $(this)
					.find("div.score_wrap div.base span.base1 img")
					.attr("src"),
			};
		});

		game2base1.each((i, ele) => {
			// console.log("why???");
			const wanna = $(this).find("img").attr("src");

			base.push(wanna);
		});
		
		return {
			game,
			base,
			totalballcount,
			test,
			onebasestate,
		};
		*/
	})
	.then((res) => console.log(res));
