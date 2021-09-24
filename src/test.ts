import axios from "axios";
import cheerio from "cheerio";

const getHtml = async () => {
	try {
		return await axios.get(
			"https://sports.news.naver.com/kbaseball/record/index?category=kbo"
		);
	} catch (err) {
		console.error(err);
	}
};

getHtml()
	.then((html: any) => {
		let arr: any[] = [];
		const $ = cheerio.load(html.data);
		const bodyList = $("tbody#regularTeamRecordList_table").children("tr");
		console.log("anybody there?", bodyList);

		bodyList.each(function (i, ele) {
			// console.log("what is I", i);
			arr[i] = {
				team: $(this).find("td.tm span").text(),
			};
		});

		return arr;
	})
	.then((res) => console.log(res));
