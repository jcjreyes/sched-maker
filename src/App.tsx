import React, { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import html2canvas from 'html2canvas';
import moment from 'moment';

// Import styles
import './App.css';

// Import data and utility functions
import sampleData from './util/sampleData';
import { parseStudentSchedule } from './util/parseStudentSched';
import { convertSubjectSetToCalendarItems } from './util/subjectSetToCalendarItem';
import { parseSubjectEntry } from './util/parseSubjectEntry';

// Import types and schedules
import SetWithContentEquality, { Subject } from './types/SubjectSet';
import sectionSchedules from './schedules/schedules';
import { EventSourceInput } from '@fullcalendar/core/index.js';
import { toPng } from 'html-to-image';

function App() {
	// Data
	const [rawSched, setRawSched] = useState<string>('');
	const [studentSched, setStudentSched] = useState<string>('');

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
  const exportRef = useRef<HTMLDivElement>(null)

  const onButtonClick = useCallback(() => {
    if (exportRef.current === null) {
      return
    }

    toPng(exportRef.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'my-image-name.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [exportRef])

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

	return (
		<>
			<div className='header'>
				<h1>class schedule</h1>
			</div>
				<div className='options'>
					<div className='options-download'>
						<button onClick={handleDownload}>Download as PNG</button>
					</div>
					<div className='options-toggle'>
						<label>Show Time Labels</label>
						<input
							type='checkbox'
							checked={showTimeLabels}
							onChange={() => setShowTimeLabels(!showTimeLabels)}
						/>
					</div>
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
					<div className='options-slider'>
						Class Cell Opacity
						<input
							type='range'
							min='50'
							max='100'
							value={opacity}
							onChange={handleSliderChange('event-opacity', setOpacity)}
						/>
					</div>
					<div className='options-color'>
						Background Color
						<input
							type='color'
							value={backgroundColor}
							onChange={handleBackgroundColorChange}
						/>
					</div>
					{JSON.stringify(selectedEvent)}
					<div className='options-color'>
						Event Color
						<input
							type='color'
							value={eventColor}
							onChange={handleEventColorChange}
						/>
					</div>
				</div>
				<textarea value={rawSched} onInput={(e) => setRawSched(e.target.value)} />
				<button onClick={() => setStudentSched(rawSched)}>Generate</button>
        <button onClick={onButtonClick}>Click me</button>
			<div
				className='background'
				style={{
					backgroundImage: `url(https://images.unsplash.com/photo-1704911206175-666dc9d9c4cc)`,
				}}
        ref={exportRef}
			>
				<div className='actual-calendar'>
					{showTimeLabels && (
						<div className='time-labels'>
							{Array.from({ length: 24 }).map((_, index) => {
								const currentTime = minStartTime.clone().add(index, 'hours');
								if (currentTime.isBefore(adjustedMaxEndTime)) {
									return (
										<div key={index} className='time-label'>
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
						slotMinTime='07:30'
						slotMaxTime='20:00'
						slotDuration='00:20:00'
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
			</div>
		</>
	);
}

export default App;
