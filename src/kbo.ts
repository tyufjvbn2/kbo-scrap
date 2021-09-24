import axios from "axios";
import cheerio from "cheerio";

interface dynamicObj {
	[key: string]: any;
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

		let homeTeam: any[] = [];
		let awayTeam: any[] = [];
		let ballCount: any[] = [];
		let score: any[] = [];

		// let totalBallCount = $("div.smsScore div.base").text().split("out");
		// let totalGameScore = $("div.smsScore em.score").text();

		totalGameSet.each((i, ele) => {
			ballCount.push($(ele).find("div.base").text());
			homeTeam.push($(ele).find("p.leftTeam strong.teamT").text());
			awayTeam.push($(ele).find("p.rightTeam strong.teamT").text());
		});

		return {
			homeTeam,
			awayTeam,
			ballCount,
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
