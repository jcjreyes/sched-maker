import "./App.css";
import sampleData from "./util/sampleData";
import { parseStudentSchedule } from "./util/parseStudentSched";
import SetWithContentEquality, { Subject } from "./types/SubjectSet";
import sectionSchedules from "./schedules/schedules";
import { Section } from "./types/enums";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";

function App() {
  const studentSched: string = sampleData;
  const subjectSet = new SetWithContentEquality<Subject>(
    (subject) => subject.code
  );
  const subjectArray = parseStudentSchedule(studentSched);

  subjectArray.forEach((subject) => {
    const subjectDetails = subject.split("\n");
    const subjectCode = subjectDetails[0];
    const subjectSection = subjectDetails[1].split(" ")[0];
    const subjectLoc = subjectDetails[1].split(" ")[1];

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
    const cleanedSectionKey = sectionKey.replace("-", "");
    console.log(subject, sectionSchedules[cleanedSectionKey]);

    const combinedDetails = {
      title: subject.code,
      daysOfWeek: sectionSchedules[sectionKey].days,
      startTime: moment(
        sectionSchedules[sectionKey].startTime,
        "hh:mm A"
      ).format("HH:mm:ss"),
      endTime: moment(sectionSchedules[sectionKey].endTime, "hh:mm A").format(
        "HH:mm:ss"
      ),
    };

    calendarItems.push(combinedDetails);
  });

  console.log(calendarItems);

  // Find the minimum start time among all events
  const minStartTime = moment.min(
    calendarItems.map((item) => moment(item.startTime, "HH:mm:ss"))
  );

  return (
    <>
      <div className="actual-calendar">
        <div className="time-labels">
          {Array.from({ length: 24 }).map((_, index) => (
            <div key={index} className="time-label">
              {minStartTime.clone().add(index, "hours").format("HH:mm")}
            </div>
          ))}
        </div>
        <FullCalendar
          plugins={[timeGridPlugin]}
          headerToolbar={false}
          allDaySlot={false}
          dayHeaderContent={(args) => moment(args.date).format("ddd")}
          slotMinTime="07:30"
          slotMaxTime="20:00"
          slotDuration="00:20:00"
          events={calendarItems}
          hiddenDays={[0, 6]}
          // height={"auto"}
          contentHeight={"auto"}
          // aspectRatio={0.7}
        />
      </div>
    </>
  );
}

export default App;
