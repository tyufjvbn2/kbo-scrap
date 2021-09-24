import axios from "axios";
import cheerio from "cheerio";

interface dynamicObj {
	[key: number]: any;
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
		let ballCount: any[] = [];
		let score: any[] = [];
		let baseState: any[] = [];

		let testbed: any[] = [];
		let testobj: dynamicObj = {};

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
			baseState.push($(ele).find("div.base span img").attr("src"));
			$(ele)
				.find(`div.base span`)
				.each((j, el) => {
					// console.log("show me j", j);
					let baselive = $(el).find("img").attr("src");
					if (baselive !== undefined) {
						if (baselive === baseOn) {
							testobj[i] = testbed.push(1);
						} else {
							testobj[i] = testbed.push(0);
						}
					}
				});
		});

		return {
			homeTeam,
			awayTeam,
			inning,
			score,
			ballCount,
			// baseState,
			testobj,
			// totalBallCount,
			// totalGameScore,
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
