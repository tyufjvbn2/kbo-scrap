import express from "express";
import axios from "axios";
import FormData from "form-data";
import cheerio from "cheerio";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const postBody = {
	ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$scriptmanager1: `ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$udpRecord |
		ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$btnNextDate`,
	ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchDate:
		"20210927",
	__EVENTTARGET:
		"ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$btnNextDate",
	__VIEWSTATE:
		"/wEPDwUJNTI3NTA0NTg1D2QWAmYPZBYCZg9kFgJmD2QWAgIBD2QWAmYPZBYCAgEPZBYCAgMPZBYCAgEPZBYCZg9kFgYCAw8PFgIeBFRleHQFDzIwMjEuMDkuMjco7JuUKWRkAgcPFgIeC18hSXRlbUNvdW50ZmQCCQ8PFgIeB1Zpc2libGVnZGRktlcHQfoidliNudWx6f7RA9BGtfALQpDkzGgW6B/3tps=",
	__VIEWSTATEGENERATOR: "169B9AF4",
	__EVENTVALIDATION:
		"/wEdAAUJ0BN6NlWOaqm5pRfE62dLlEwcu7CwxNIMjgoCNV+DoOyPE1qDl/G2n2/9ckf4rHIe0OpQfhxR5FmU2jfEHnpq0+3SNFh3Hpdaa49BEvunoM0VrI6eZoe6S7NNzcUAejUFizuChGD8IFts1PIkmXAi",
	__ASYNCPOST: "true",
};
let form = new FormData();
form.append(
	"ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$scriptmanager1",
	`ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$udpRecord |
		ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$btnNextDate`
);
form.append(
	"ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchDate",
	"20210927"
);
form.append("__EVENTTARGET", postBody.__EVENTTARGET);
form.append(
	"__VIEWSTATE",
	"/wEPDwUJNTI3NTA0NTg1D2QWAmYPZBYCZg9kFgJmD2QWAgIBD2QWAmYPZBYCAgEPZBYCAgMPZBYCAgEPZBYCZg9kFgYCAw8PFgIeBFRleHQFDzIwMjEuMDkuMjco7JuUKWRkAgcPFgIeC18hSXRlbUNvdW50ZmQCCQ8PFgIeB1Zpc2libGVnZGRktlcHQfoidliNudWx6f7RA9BGtfALQpDkzGgW6B/3tps="
);
// form.append("__VIEWSTATEGENERATOR", postBody.__VIEWSTATEGENERATOR);
form.append("__EVENTVALIDATION", postBody.__EVENTVALIDATION);
form.append("__ASYNCPOST", postBody.__ASYNCPOST);

const getHtml = async () => {
	try {
		return await axios.post(
			"https://www.koreabaseball.com/Schedule/ScoreBoard.aspx",
			form,
			{
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
					// "Content-Type":
					// 	"application/x-www-form-urlencoded; charset=UTF-8",
				},
			}
		);
	} catch (err) {
		console.error(err);
	}
};

Promise.all([getHtml()]).then((val) => {
	console.log("html?", val);
});

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
