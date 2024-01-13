import { Day, Section } from '../types/enums';

type Schedule = {
	days: Day[];
	startTime: string;
	endTime: string;
};

const sectionASched: Schedule = {
	days: [Day.Mon, Day.Thur],
	startTime: '08:00 AM',
	endTime: '09:30 AM',
};

const sectionBSched: Schedule = {
	days: [Day.Mon, Day.Thur],
	startTime: '09:30 AM',
	endTime: '11:00 AM',
};

const sectionCSched: Schedule = {
	days: [Day.Mon, Day.Thur],
	startTime: '11:00 AM',
	endTime: '12:30 PM',
};

const sectionDSched: Schedule = {
	days: [Day.Mon, Day.Thur],
	startTime: '12:30 PM',
	endTime: '02:00 PM',
};

const sectionESched: Schedule = {
	days: [Day.Mon, Day.Thur],
	startTime: '02:00 PM',
	endTime: '03:30 PM',
};

const sectionFSched: Schedule = {
	days: [Day.Mon, Day.Thur],
	startTime: '03:30 PM',
	endTime: '05:00 PM',
};

const sectionGSched: Schedule = {
	days: [Day.Mon, Day.Thur],
	startTime: '05:00 PM',
	endTime: '06:30 PM',
};

const sectionHSched: Schedule = {
	days: [Day.Mon, Day.Thur],
	startTime: '06:30 PM',
	endTime: '08:00 PM',
};

const sectionJSched: Schedule = {
	days: [Day.Tue, Day.Fri],
	startTime: '08:00 AM',
	endTime: '09:30 AM',
};

const sectionKSched: Schedule = {
	days: [Day.Tue, Day.Fri],
	startTime: '09:30 AM',
	endTime: '11:00 AM',
};

const sectionLSched: Schedule = {
	days: [Day.Tue, Day.Fri],
	startTime: '11:00 AM',
	endTime: '12:30 PM',
};

const sectionMSched: Schedule = {
	days: [Day.Tue, Day.Fri],
	startTime: '12:30 PM',
	endTime: '02:00 PM',
};

const sectionNSched: Schedule = {
	days: [Day.Tue, Day.Fri],
	startTime: '02:00 PM',
	endTime: '03:30 PM',
};

const sectionOSched: Schedule = {
	days: [Day.Tue, Day.Fri],
	startTime: '03:30 PM',
	endTime: '05:00 PM',
};

const sectionNWAMSched: Schedule = {
	days: [Day.Wed],
	startTime: '8:00 AM',
	endTime: '12:00 PM',
};

const sectionNSPM1Sched: Schedule = {
  days: [Day.Sat],
  startTime: '1:00 PM',
  endTime: '5:00 PM'
}

// const generateSubsectionSchedules = (
//   baseSchedule: Schedule,
//   subsections: number,
// ): Record<Section, Schedule> => {
//   const schedules: Record<Section, Schedule> = {};
//
//   for (let i = 1; i <= subsections; i++) {
//     const subsectionKey = `${baseSchedule.days[0]}${i}` as Section;
//     console.log(subsectionKey)
//     schedules[subsectionKey] = baseSchedule;
//   }
//
//   return schedules;
// };

const sectionSchedules: Record<Section, Schedule> = {
	[Section.A]: sectionASched,
	[Section.A1]: sectionASched,
	[Section.A2]: sectionASched,
	[Section.A3]: sectionASched,
	[Section.A4]: sectionASched,
	[Section.A5]: sectionASched,
	[Section.B]: sectionBSched,
	[Section.B1]: sectionBSched,
	[Section.B2]: sectionBSched,
	[Section.B3]: sectionBSched,
	[Section.B4]: sectionBSched,
	[Section.B5]: sectionBSched,
	[Section.C]: sectionCSched,
	[Section.C1]: sectionCSched,
	[Section.C2]: sectionCSched,
	[Section.C3]: sectionCSched,
	[Section.C4]: sectionCSched,
	[Section.C5]: sectionCSched,
	[Section.D]: sectionDSched,
	[Section.D1]: sectionDSched,
	[Section.D2]: sectionDSched,
	[Section.D3]: sectionDSched,
	[Section.D4]: sectionDSched,
	[Section.D5]: sectionDSched,
	[Section.E]: sectionESched,
	[Section.E1]: sectionESched,
	[Section.E2]: sectionESched,
	[Section.E3]: sectionESched,
	[Section.E4]: sectionESched,
	[Section.E5]: sectionESched,
	[Section.F]: sectionFSched,
	[Section.F1]: sectionFSched,
	[Section.F2]: sectionFSched,
	[Section.F3]: sectionFSched,
	[Section.F4]: sectionFSched,
	[Section.F5]: sectionFSched,
	[Section.G]: sectionGSched,
	[Section.G1]: sectionGSched,
	[Section.G2]: sectionGSched,
	[Section.G3]: sectionGSched,
	[Section.G4]: sectionGSched,
	[Section.G5]: sectionGSched,
	[Section.H]: sectionHSched,
	[Section.H1]: sectionHSched,
	[Section.H2]: sectionHSched,
	[Section.H3]: sectionHSched,
	[Section.H4]: sectionHSched,
	[Section.H5]: sectionHSched,
	[Section.J]: sectionJSched,
	[Section.J1]: sectionJSched,
	[Section.J2]: sectionJSched,
	[Section.J3]: sectionJSched,
	[Section.J4]: sectionJSched,
	[Section.J5]: sectionJSched,
	[Section.K]: sectionKSched,
	[Section.K1]: sectionKSched,
	[Section.K2]: sectionKSched,
	[Section.K3]: sectionKSched,
	[Section.K4]: sectionKSched,
	[Section.K5]: sectionKSched,
	[Section.L]: sectionLSched,
	[Section.L1]: sectionLSched,
	[Section.L2]: sectionLSched,
	[Section.L3]: sectionLSched,
	[Section.L4]: sectionLSched,
	[Section.L5]: sectionLSched,
	[Section.M]: sectionMSched,
	[Section.M1]: sectionMSched,
	[Section.M2]: sectionMSched,
	[Section.M3]: sectionMSched,
	[Section.M4]: sectionMSched,
	[Section.M5]: sectionMSched,
	[Section.N]: sectionNSched,
	[Section.N1]: sectionNSched,
	[Section.N2]: sectionNSched,
	[Section.N3]: sectionNSched,
	[Section.N4]: sectionNSched,
	[Section.N5]: sectionNSched,
	[Section.O]: sectionOSched,
	[Section.O1]: sectionOSched,
	[Section.O2]: sectionOSched,
	[Section.O3]: sectionOSched,
	[Section.O4]: sectionOSched,
	[Section.O5]: sectionOSched,
	[Section.NWAM]: sectionNWAMSched,
  [Section.NSPM1]: sectionNSPM1Sched
	// ...generateSubsectionSchedules(sectionASched, 5),
	// ...generateSubsectionSchedules(sectionBSched, 5),
	// ...generateSubsectionSchedules(sectionCSched, 5),
	// ...generateSubsectionSchedules(sectionDSched, 5),
	// ...generateSubsectionSchedules(sectionESched, 5),
	// ...generateSubsectionSchedules(sectionFSched, 5),
	// ...generateSubsectionSchedules(sectionGSched, 5),
	// ...generateSubsectionSchedules(sectionHSched, 5),
	// ...generateSubsectionSchedules(sectionJSched, 5),
	// ...generateSubsectionSchedules(sectionKSched, 5),
	// ...generateSubsectionSchedules(sectionLSched, 5),
	// ...generateSubsectionSchedules(sectionMSched, 5),
	// ...generateSubsectionSchedules(sectionNSched, 5),
	// ...generateSubsectionSchedules(sectionOSched, 5),
};

export default sectionSchedules;
