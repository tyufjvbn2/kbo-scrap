import axios from "axios";
import cheerio from "cheerio";

const getHtml = async () => {
	try {
		return await axios.get(
			"https://www.koreabaseball.com/Schedule/ScoreBoard.aspx"
		);
	} catch (err) {
		console.error(err);
	}
};

getHtml().then((html: any) => {
	const dictionary = ["KT", "한화", "SSG"];
	let arr: any[] = [];
	let startTime: any[] = [];
	let inningState: any[] = [];
	let dhCheck: any[] = [];
	const $ = cheerio.load(html.data);
	// const htmlDoc = $("body");
	// console.log("html body", $.html()); //전체 html 확인

	const playBoardList = $(
		"div#cphContents_cphContents_cphContents_udpRecord"
	).children("div.smsScore");

	// console.log("anybody there?", bodyList);

	playBoardList.each((i, ele) => {
		// console.log("what is I", i);
		// console.log($(ele).html());

		if (
			dictionary.indexOf(
				$(ele).find("p.rightTeam strong.teamT").text()
			) !== -1
		) {
			arr.push($(ele).find("p.rightTeam strong.teamT").text());
			startTime.push($(ele).find("p.place").text());
			inningState.push($(ele).find("strong.flag span").text());
			dhCheck.push($(ele).find("p.dh").text());
		}
	});

	console.log("team get", arr);
	console.log("start time get", startTime);
	console.log("inning state get", inningState);
	console.log("doubl header get", dhCheck);

	// return arr;
});
// .then((res) => console.log(res));
