export const parseStudentSchedule = (studentSched: string): string[] => {
	return studentSched
		.split('\t')
		.filter((item) => item !== ' ')
		.filter((item) => !/^\s/.test(item))
		.filter((item) => /\s/.test(item))
		.filter(
			(item) =>
				!['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'].some((day) =>
					item.includes(day),
				),
		);
};
