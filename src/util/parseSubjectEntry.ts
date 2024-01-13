export const parseSubjectEntry = (entry: string): Subject => {
	const [subjectCode, rest] = entry.split('\n');
	const [subjectSection, subjectLoc] = rest.split(' ');

	return {
		code: subjectCode,
		location: subjectLoc,
		section: subjectSection,
	};
};
