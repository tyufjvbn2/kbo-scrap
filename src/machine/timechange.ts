export const timeChanger = (time: Date | string | number) => {
	return new Date(new Date(time).getTime() - 9 * 60 * 60 * 1000);
};
