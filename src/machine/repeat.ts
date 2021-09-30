import { run } from "./scrap";
import { update } from "./update";
import { resDataStructure } from "../interface/interface";

function scrap() {
	return new Promise<resDataStructure>(async (resolve, reject) => {
		let data = await run();

		resolve(data);
	});
}

export const repeater = () => {
	const keepUpdate = setInterval(() => {
		//종료할건지 계속 체크해야 함
		scrap().then((data: resDataStructure) => {
			//아직 진행중인 경기가 있을때
			if (data.gameChecker !== data.totalGame.length) {
				update(data.totalGame);
			} else {
				//모든 경기 종료시
				console.log("All game end");
				clearInterval(keepUpdate);
			}
		});
	}, 5000);
};
