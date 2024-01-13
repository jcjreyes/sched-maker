import SetWithContentEquality from '../types/SubjectSet';
import moment from 'moment';

export const convertSubjectSetToCalendarItems = (
	subjectSet: SetWithContentEquality<Subject>,
	sectionSchedules: Record<Section, Schedule>,
): EventSourceInput[] => {
	const calendarItems: EventSourceInput[] = [];

	subjectSet.items.forEach((subject) => {
		const sectionKey = subject.section as Section;
		const combinedDetails: EventSourceInput = {
			groupId: subject.code,
			title: subject.code,
			daysOfWeek: sectionSchedules[sectionKey].days,
			startTime: moment(sectionSchedules[sectionKey].startTime, 'hh:mm A').format(
				'HH:mm:ss',
			),
			endTime: moment(sectionSchedules[sectionKey].endTime, 'hh:mm A').format(
				'HH:mm:ss',
			),
			color: '#378006',
		};

		calendarItems.push(combinedDetails);
	});

	return calendarItems;
};
