import './App.css';
import sampleData from './util/sampleData';
import { parseStudentSchedule } from './util/parseStudentSched';
import SetWithContentEquality, { Subject } from './types/SubjectSet';
import sectionSchedules from './schedules/schedules';
import { Section } from './types/enums';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import { useState } from 'react';
import { EventSourceInput } from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';

function App() {
	const [innerPadding, setInnerPadding] = useState<string>('');
	const [outerMargin, setOuterMargin] = useState<string>('');
	const [eventFontSize, setEventFontSize] = useState<string>('');
	const [textAlignment, setTextAlignment] = useState<string>('');

	const studentSched: string = sampleData;
	const subjectSet = new SetWithContentEquality<Subject>(
		(subject) => subject.code,
	);
	const subjectArray = parseStudentSchedule(studentSched);

	subjectArray.forEach((subject) => {
		const subjectDetails = subject.split('\n');
		const subjectCode = subjectDetails[0];
		const subjectSection = subjectDetails[1].split(' ')[0];
		const subjectLoc = subjectDetails[1].split(' ')[1];

		const final: Subject = {
			code: subjectCode,
			location: subjectLoc,
			section: subjectSection,
		};

		subjectSet.add(final);
	});

	const calendarItems = [];

	subjectSet.items.forEach((subject) => {
		const sectionKey = subject.section as Section;
		const combinedDetails = {
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
  console.log(calendarItems);

  // Find the minimum start time among all events
  const minStartTime = moment.min(
    calendarItems.map((item) => moment(item.startTime, "HH:mm:ss"))
  );

	const handleSliderChange =
		(
			property: string,
			dynamicState: React.Dispatch<React.SetStateAction<string>>,
		) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const root = document.documentElement.style;
			const value = parseInt(event.target.value, 10);
			const alignments = ['left', 'center', 'right'];

			dynamicState(value);

			if (property == 'event-text-alignment') {
				root.setProperty(`--${property}`, alignments[parseInt(value)]);
			} else {
				root.setProperty(`--${property}`, `${value * 0.01}rem`);
			}
		};

	return (
		<>
			<div className='actual-calendar'>
				<FullCalendar
					plugins={[timeGridPlugin, interactionPlugin]}
					headerToolbar={false}
					allDaySlot={false}
					dayHeaderContent={(args) => moment(args.date).format('ddd')}
					slotMinTime='07:30'
					slotMaxTime='20:00'
					slotDuration='00:20:00'
					events={calendarItems}
					hiddenDays={[0, 6]}
					// height={"auto"}
					contentHeight={'auto'}
					// aspectRatio={0.7}
					editable={true}
          eventClick={(info) => {console.log(info)}}
				/>
			</div>
			<div className='options'>
				<div className='options-slider'>
					Inner Padding
					<input
						type='range'
						min='0'
						max='100'
						value={innerPadding}
						onChange={handleSliderChange('inner-padding', setInnerPadding)}
					/>
				</div>
				<div className='options-slider'>
					Outer Margin
					<input
						type='range'
						min='0'
						max='100'
						value={outerMargin}
						onChange={handleSliderChange('outer-margin', setOuterMargin)}
					/>
				</div>
				<div className='options-slider'>
					Event Font Size
					<input
						type='range'
						min='0'
						max='200'
						value={eventFontSize}
						onChange={handleSliderChange('event-font-size', setEventFontSize)}
					/>
				</div>
				<div className='options-slider'>
					Text Alignment
					<input
						type='range'
						min='0'
						max='2'
						step='1'
						value={textAlignment}
						onChange={handleSliderChange('event-text-alignment', setTextAlignment)}
					/>
				</div>
			</div>
		</>
	);
}

export default App;
