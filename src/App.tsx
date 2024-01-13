import './App.css';
import sampleData from './util/sampleData';
import { parseStudentSchedule } from './util/parseStudentSched';
import SetWithContentEquality, { Subject } from './types/SubjectSet';
import sectionSchedules from './schedules/schedules';
import { Section } from './types/enums';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import { useState, useEffect } from 'react';
import interactionPlugin from '@fullcalendar/interaction';
import html2canvas from 'html2canvas';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {
	const [innerPadding, setInnerPadding] = useState<string>('');
	const [outerMargin, setOuterMargin] = useState<string>('');
	const [eventFontSize, setEventFontSize] = useState<string>('');
	const [textAlignment, setTextAlignment] = useState<string>('');
	const [backgroundColor, setBackgroundColor] = useState<string>('#F9F8F4');
	const [showTimeLabels, setShowTimeLabels] = useState(true);
	const [toggleState, setToggleState] = useState(0);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [showMore, setShowMore] = useState(false);

	useEffect(() => {
		document.documentElement.style.setProperty(
			'background-color',
			backgroundColor,
		);
	}, [backgroundColor]);

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
			color: '#DAF1FF',
		};

		calendarItems.push(combinedDetails);
	});
	console.log(calendarItems);

	const minStartTime = moment.min(
		calendarItems.map((item) => moment(item.startTime, 'HH:mm:ss')),
	);

	const maxEndTime = moment.max(
		calendarItems.map((item) => moment(item.endTime, 'HH:mm:ss')),
	);

	const adjustedMaxEndTime = maxEndTime.clone().add(1, 'hours');

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

	const handleBackgroundColorChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const root = document.documentElement.style;
		const value = event.target.value.startsWith('#')
			? event.target.value
			: `#${event.target.value}`;
		setBackgroundColor(value);
		root.setProperty('--background-color', value);
	};

	const handleDownload = () => {
		const targetNode = document.querySelector('.actual-calendar');

		targetNode.style.backgroundColor = backgroundColor;
		html2canvas(targetNode).then((canvas) => {
			const link = document.createElement('a');
			link.href = canvas.toDataURL('image/png');
			link.download = 'calendar.png';
			link.click();

			targetNode.style.backgroundColor = 'transparent';
		});
	};
	const options = [
		'Time Labels',
		'Inner Padding',
		'Outer Margin',
		'Event Font Size',
		'Text Alignment',
		'Background Color',
	];

	const optionsButtons = [];
	const fields = [];
	const toggleTab = (index) => {
		setToggleState(index);
	};

	const fieldMappings = {
		'Time Labels': (
			<div className="options-toggle">
				<label>Show Time Labels</label>
				<input
					type="checkbox"
					checked={showTimeLabels}
					onChange={() => setShowTimeLabels(!showTimeLabels)}
				/>
			</div>
		),
		'Inner Padding': (
			<div className="options-slider">
				Inner Padding
				<input
					type="range"
					min="0"
					max="100"
					value={innerPadding}
					onChange={handleSliderChange('inner-padding', setInnerPadding)}
				/>
			</div>
		),
		'Outer Margin': (
			<div className="options-slider">
				Outer Margin
				<input
					type="range"
					min="0"
					max="100"
					value={outerMargin}
					onChange={handleSliderChange('outer-margin', setOuterMargin)}
				/>
			</div>
		),
		'Event Font Size': (
			<div className="options-slider">
				Event Font Size
				<input
					type="range"
					min="0"
					max="200"
					value={eventFontSize}
					onChange={handleSliderChange('event-font-size', setEventFontSize)}
				/>
			</div>
		),
		'Text Alignment': (
			<div className="options-slider">
				Text Alignment
				<input
					type="range"
					min="0"
					max="2"
					step="1"
					value={textAlignment}
					onChange={handleSliderChange('event-text-alignment', setTextAlignment)}
				/>
			</div>
		),
		'Background Color': (
			<div className="options-color">
				Background Color
				<input
					type="color"
					value={backgroundColor}
					onChange={handleBackgroundColorChange}
				/>
			</div>
		),
	};

	options.forEach((key, i) => {
		const isActive = toggleState === i;
		const isHidden = isSmallScreen && !showMore && !isActive;
		const isHiddenClass = isHidden ? 'hidetab' : '';

		optionsButtons.push(
			<button
				key={key}
				className={`tabs ${isActive ? 'active-tabs' : ''} ${isHiddenClass}`}
				onClick={() => toggleTab(i)}
			>
				{key}
			</button>,
		);

		if (isActive) {
			fields.push(fieldMappings[key]);
		}
	});

	return (
		<>
			<div className="header">
				<h1>class schedule</h1>
			</div>
			<div className="actual-calendar">
				{showTimeLabels && (
					<div className="time-labels">
						{Array.from({ length: 24 }).map((_, index) => {
							const currentTime = minStartTime.clone().add(index, 'hours');
							if (currentTime.isBefore(adjustedMaxEndTime)) {
								return (
									<div key={index} className="time-label">
										{currentTime.format('HH:mm')}
									</div>
								);
							}
							return null;
						})}
					</div>
				)}
				<FullCalendar
					plugins={[timeGridPlugin, interactionPlugin]}
					headerToolbar={false}
					allDaySlot={false}
					dayHeaderContent={(args) => moment(args.date).format('ddd').toLowerCase()}
					slotMinTime="07:30"
					slotMaxTime="20:00"
					slotDuration="00:20:00"
					events={calendarItems}
					hiddenDays={[0, 6]}
					contentHeight={'auto'}
					editable={true}
					eventClick={(info) => {
						console.log(info);
					}}
				/>
			</div>
			<div className="download-container">
				<div className="options-download">
					<div onClick={handleDownload}>
						<i className="fas fa-download"></i> Download
					</div>
				</div>
			</div>
			<div className="options">
				{isSmallScreen && !showMore ? null : optionsButtons}
				{fields}
			</div>
		</>
	);
}

export default App;
