import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import html2canvas from 'html2canvas';
import moment from 'moment';

// Import styles
import './App.css';

// Import data and utility functions
import { parseStudentSchedule } from './util/parseStudentSched';
import { convertSubjectSetToCalendarItems } from './util/subjectSetToCalendarItem';

// Import types and schedules
import SetWithContentEquality, { Subject } from './types/SubjectSet';
import sectionSchedules from './schedules/schedules';
import '@fortawesome/fontawesome-free/css/all.css';

// Import components
import TextAreaModal from './components/TextAreaModal';
import { toPng } from 'html-to-image';

function App() {
	// Data
	// Data
	const [rawSched, setRawSched] = useState<string>('');
	const [studentSched, setStudentSched] = useState<string>('');
	const [showTextArea, setShowTextArea] = useState(false);

	// Cosmetics
	const [opacity, setOpacity] = useState<number>(100);
	const [innerPadding, setInnerPadding] = useState<string>('');
	const [outerMargin, setOuterMargin] = useState<string>('');
	const [eventFontSize, setEventFontSize] = useState<string>('');
	const [textAlignment, setTextAlignment] = useState<string>('');
	const [backgroundColor, setBackgroundColor] = useState<string>('#F9F8F4');
	const [showTimeLabels, setShowTimeLabels] = useState(true);

	// Data Editing
	const [eventColor, setEventColor] = useState<string>('#F9F8F4');
	const [selectedEvent, setSelectedEvent] = useState<EventSourceInput>();
	const [calendarItems, setCalendarItems] = useState<EventSourceInput[]>([]);

	// Options
	const [toggleState, setToggleState] = useState(0);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const exportRef = useRef<HTMLDivElement>(null);

	const onButtonClick = useCallback(() => {
		if (exportRef.current === null) {
			return;
		}

		toPng(exportRef.current, { cacheBust: true })
			.then((dataUrl) => {
				const link = document.createElement('a');
				link.download = 'my-image-name.png';
				link.href = dataUrl;
				link.click();
			})
			.catch((err) => {
				console.log(err);
			});
	}, [exportRef]);

	useEffect(() => {
		document.documentElement.style.setProperty(
			'background-color',
			backgroundColor,
		);
	}, [backgroundColor]);

	useEffect(() => {
		const subjectArray = parseStudentSchedule(studentSched);
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

		const calendarItems = convertSubjectSetToCalendarItems(
			subjectSet,
			sectionSchedules,
		);
		setCalendarItems(calendarItems);
	}, [studentSched]);
	console.log('Calendar items: ', calendarItems);
	const minStartTime = moment('08:00', 'HH:mm');

	const maxEndTime = moment.max(
		calendarItems.map((item) => moment(item.endTime, 'HH:mm:ss')),
	);

	const adjustedMaxEndTime = maxEndTime.clone().add(1, 'hours');
	const toggleTextAreaVisibility = () => {
		setShowTextArea((prev) => !prev);
	};

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

	const handleEventColorChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setEventColor(event.target.value);
		setSelectedEvent({ ...selectedEvent, color: eventColor });
		setCalendarItems((prevCalendarItems) => {
			const updatedItemIndex = prevCalendarItems.findIndex(
				(item) => item.title == selectedEvent?.title,
			);
			if (updatedItemIndex !== -1) {
				const updatedCalendarItems = [...prevCalendarItems];
				updatedCalendarItems[updatedItemIndex] = selectedEvent;
				return updatedCalendarItems;
			}
			return prevCalendarItems;
		});
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

	const handleSaveTextArea = (inputText: string) => {
		setRawSched(inputText);
		setStudentSched(inputText);
		setShowTextArea(false);
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

	return (
		<>
			<div className="header">
				<h1>class schedule</h1>
			</div>
			<button onClick={toggleTextAreaVisibility}>
				{showTextArea ? 'Hide Textarea' : 'Show Textarea'}
			</button>
			{showTextArea && (
				<TextAreaModal
					isOpen={showTextArea}
					onClose={toggleTextAreaVisibility}
					onSave={handleSaveTextArea}
				/>
			)}
			{calendarItems && calendarItems.length > 0 && (
				<>
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
							dayHeaderContent={(args) =>
								moment(args.date).format('ddd').toLowerCase()
							}
							slotMinTime="07:30"
							slotMaxTime="20:00"
							slotDuration="00:20:00"
							events={calendarItems}
							hiddenDays={[0, 6]}
							contentHeight={'auto'}
							editable={true}
							eventClick={(info) => {
								const event = calendarItems.find(
									(item) => item.title == info.event.title,
								);
								setSelectedEvent(event);
							}}
						/>
					</div>
					<div className="download-container">
						<div className="options-download">
							<div onClick={handleDownload}>
								<i className="fas fa-download"></i> Download
							</div>
						</div>
						{JSON.stringify(selectedEvent)}
						<div className="options-color">
							Event Color
							<input
								type="color"
								value={eventColor}
								onChange={handleEventColorChange}
							/>
						</div>
					</div>
					<div className="options">
						{isSmallScreen && !showMore ? null : optionsButtons}
						{fields}
					</div>
				</>
			)}
		</>
	);
}

export default App;
