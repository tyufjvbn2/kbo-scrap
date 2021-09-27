import express from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express();

// const getHtml = async () => {
// 	try {
// 		return await axios.get(
// 			"https://base.uplus.co.kr/match/20210922/20210922KTHT0/smsRelay"
// 		);
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

// getHtml()
// 	.then((html: any) => {
// 		let ulList: any[] = [];
// 		const $ = cheerio.load(html.data);
// 		const $bodyList = $("ul.count_desc").children("li");
// 		console.log("check", $bodyList);

// 		$bodyList.each((i, ele) => {
// 			ulList[i] = {
// 				judge: $(this).find("b.name").text(),
// 				ballType: $(this).find("span.desc").text(),
// 				ballCount: $(this).find("span.count").text(),
// 			};
// 		});

// 		const data = ulList.filter((n) => n);
// 		return data;
// 	})
// 	.then((res) => console.log(res));

app.listen(3333, () => {
	console.log("Data scraping servering is running");
});
