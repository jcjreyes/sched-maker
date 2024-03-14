import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

// Import styles
import './App.css';

// Import data and utility functions
import { parseStudentSchedule } from './util/parseStudentSched';

// Import types and schedules
import SetWithContentEquality, { Subject } from './types/SubjectSet';
import sectionSchedules from './schedules/schedules';
import '@fortawesome/fontawesome-free/css/all.css';

// Import components
import TextAreaModal from './components/TextAreaModal';
import { toPng } from 'html-to-image';
import useStore from './store/useStore';
import { Section } from './types/enums';

function App() {
	const exportRef = useRef<HTMLDivElement>(null);
	const [showTextArea, setShowTextArea] = useState(false);
	const [rawSched, setRawSched] = useState<string>('');
	const userClasses = useStore((state) => state.classes);
	const userClassesToCalendar = userClasses.map((userClass) => {
		return {
			groupId: userClass.code,
			title: userClass.code,
			daysOfWeek: userClass.daysOfWeek,
			startTime: moment(userClass.startTime, 'hh:mm A').format('HH:mm:ss'),
			endTime: moment(userClass.endTime, 'hh:mm A').format('HH:mm:ss'),
			color: userClass.color,
			extra: 'This is extra information',
			section: userClass.section,
			location: userClass.location,
		};
	});

	const [opacity, setOpacity] = useState<number>(100);
	const [innerPadding, setInnerPadding] = useState<string>('');
	const [outerMargin, setOuterMargin] = useState<number>(0);
	const [eventFontSize, setEventFontSize] = useState<string>('');
	const [textAlignment, setTextAlignment] = useState<string>('');
	const [backgroundColor, setBackgroundColor] = useState<string>('#F9F8F4');
	const [showTimeLabels, setShowTimeLabels] = useState(true);
	const [horizontalOffset, setHorizontalOffset] = useState<number>(0);
	const [verticalOffset, setVerticalOffset] = useState<number>(0);
	const [zoomLevel, setZoomLevel] = useState<number>(100); // 100% initial zoom
	const handleHorizontalChange = (event) => {
		setHorizontalOffset(event.target.value);
	};

	const handleVerticalChange = (event) => {
		setVerticalOffset(event.target.value);
	};

	const handleZoomChange = (event) => {
		setZoomLevel(event.target.value);
	};

	const toggleTextAreaVisibility = () => {
		setShowTextArea((prev) => !prev);
	};

	const handleSaveTextArea = (inputText: string) => {
		setRawSched(inputText);
		setShowTextArea(false);
	};

	useEffect(
		function populateSubjectSetAfterPasting() {
			const subjectArray = parseStudentSchedule(rawSched);
			const subjectSet = new SetWithContentEquality<Subject>(
				(subject) => subject.code,
			);

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

			subjectSet.values().forEach((subject) => {
				const sectionKey = subject.section as Section;
				useStore
					.getState()
					.addClass(
						subject.code,
						subject.location,
						subject.section,
						sectionSchedules[sectionKey].days,
						sectionSchedules[sectionKey].startTime,
						sectionSchedules[sectionKey].endTime,
						'#378006',
					);
			});
		},
		[rawSched],
	);

	function renderEventContent(eventInfo) {
		const [timeStart, timeEnd] = eventInfo.timeText.split('-');
		return (
			<>
				<div className='event-main-frame'>
					<b className='event-start-time'>{timeStart}</b>
					<div className='event-text'>
						<span className='event-title'>{eventInfo.event.title}</span>
						<span className='event-section'>
							{eventInfo.event.extendedProps.location}
						</span>
					</div>
					<b className='event-end-time'>{timeEnd}</b>
				</div>
			</>
		);
	}

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
			} else if (property == 'event-opacity') {
				root.setProperty(`--${property}`, value * 0.01);
			} else {
				root.setProperty(`--${property}`, `${value * 0.01}rem`);
			}
		};

	return (
		<>
			<div onClick={toggleTextAreaVisibility}>
				<i className='fa-solid fa-calendar-days'></i> Schedule
			</div>
			<TextAreaModal
				isOpen={showTextArea}
				onClose={toggleTextAreaVisibility}
				onSave={handleSaveTextArea}
			/>
			<p>Please enter your schedule :)</p>
			<div>
				{userClasses.map((item, index) => (
					<div key={index}>
						{Object.keys(item).map((property) =>
							!(typeof item[property] === 'object') ? (
								<label key={property}>
									<input
										type='text'
										value={item[property]}
										onChange={(e) =>
											useStore.getState().editProperty(item.code, property, e.target.value)
										}
									/>
								</label>
							) : (
								[0, 1, 2, 3, 4, 5, 6].map((day) => (
									<label key={day}>
										<input
											type='checkbox'
											checked={item[property].includes(day.toString())}
											value={day}
											onChange={(e) => {
												const checkedDayIndex = e.target.value;
												const updatedDays = e.target.checked
													? [...item[property], checkedDayIndex]
													: item[property].filter((day) => day !== checkedDayIndex);
												useStore.getState().editProperty(item.code, property, updatedDays);
											}}
										/>
									</label>
								))
							),
						)}
					</div>
				))}
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
			<div
				className='actual-calendar'
				style={{
					backgroundImage: `url(https://images.unsplash.com/photo-1704911206175-666dc9d9c4cc)`,
					backgroundPosition: `${horizontalOffset}% ${verticalOffset}%`,
					backgroundSize: `${zoomLevel}%`,
					backgroundRepeat: 'no-repeat',
				}}
			>
				<div className='calendar-container' style={{ width: '80%' }}>
					<FullCalendar
						plugins={[timeGridPlugin, interactionPlugin]}
						headerToolbar={false}
						allDaySlot={false}
						dayHeaderContent={(args) => moment(args.date).format('ddd').toLowerCase()}
						slotMinTime='07:30'
						slotMaxTime='20:00'
						slotDuration='00:15:00'
						events={userClassesToCalendar}
						hiddenDays={[0, 6]}
						eventClick={(info) => {
							const event = calendarItems.find(
								(item) => item.title == info.event.title,
							);
							setSelectedEvent(event);
						}}
						eventContent={renderEventContent}
					/>
				</div>
			</div>
		</>
	);
}

export default App;
