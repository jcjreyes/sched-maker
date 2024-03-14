import { create } from 'zustand';
import { ClassCalendarItem } from '../model/ClassCalendarItem.ts';

interface ClassCalendarItemState {
	classes: ClassCalendarItem[];
	addClass: (
		code: string,
		location: string,
		section: string,
		daysOfWeek: number[],
		startTime: string,
		endTime: string,
		color: string,
	) => void;
	removeClass: (code: string) => void;
	editCode: (code: string, newCode: string) => void;
	editLocation: (code: string, newLoc: string) => void;
	editSection: (code: string, newSec: string) => void;
	editDaysOfWeek: (code: string, newDays: number[]) => void;
	editStartTime: (code: string, newStart: string) => void;
	editEndTime: (code: string, newEnd: string) => void;
	editColor: (code: string, newColor: string) => void;
}

const editProperty = (
	state: ClassCalendarItemState,
	code: string,
	property: string,
	value: string | number,
) => {
	const updatedClasses = state.classes.map((item) => {
		if (item.code === code) {
			return { ...item, [property]: value };
		}
		return item;
	});

	return { classes: updatedClasses };
};

const useStore = create<ClassCalendarItemState>((set) => ({
	classes: [],
	addClass: (
		code: string,
		location: string,
		section: string,
		daysOfWeek: number[],
		startTime: string,
		endTime: string,
		color: string,
	) => {
		set((state) => ({
			classes: [
				...state.classes,
				{
					code,
					location,
					section,
					daysOfWeek,
					startTime,
					endTime,
					color,
				} as ClassCalendarItem,
			],
		}));
	},
	removeClass: (code: string) => {
		set((state) => ({
			classes: state.classes.filter((item) => item.code !== code),
		}));
	},
	editCode: (code: string, newCode: string) => {
		set((state) => {
			const updatedClasses = state.classes.map((item) => {
				if (item.code === code) {
					return { ...item, code: newCode };
				}
				return item;
			});

			return { classes: updatedClasses };
		});
	},
	editLocation: (code: string, newLocation: string) => {
		set((state) => {
			const updatedClasses = state.classes.map((item) => {
				if (item.code === code) {
					return { ...item, location: newLocation };
				}
				return item;
			});

			return { classes: updatedClasses };
		});
	},
	editSection: (code: string, newSection: string) => {
		set((state) => {
			const updatedClasses = state.classes.map((item) => {
				if (item.code === code) {
					return { ...item, section: newSection };
				}
				return item;
			});

			return { classes: updatedClasses };
		});
	},
	editDaysOfWeek: (code: string, newDaysOfWeek: number[]) => {
		set((state) => {
			const updatedClasses = state.classes.map((item) => {
				if (item.code === code) {
					return { ...item, daysOfWeek: newDaysOfWeek };
				}
				return item;
			});

			return { classes: updatedClasses };
		});
	},
	editStartTime: (code: string, newStartTime: string) => {
		set((state) => {
			const updatedClasses = state.classes.map((item) => {
				if (item.code === code) {
					return { ...item, startTime: newStartTime };
				}
				return item;
			});

			return { classes: updatedClasses };
		});
	},
	editEndTime: (code: string, newEndTime: string) => {
		set((state) => {
			const updatedClasses = state.classes.map((item) => {
				if (item.code === code) {
					return { ...item, endTime: newEndTime };
				}
				return item;
			});

			return { classes: updatedClasses };
		});
	},
	editColor: (code: string, newColor: string) => {
		set((state) => {
			const updatedClasses = state.classes.map((item) => {
				if (item.code === code) {
					return { ...item, color: newColor };
				}
				return item;
			});

			return { classes: updatedClasses };
		});
	},
  editProperty: (code: string, property: string, value: string | number[]) => {
    set((state) => {
      const updatedClasses = state.classes.map((item) => {
        if (item.code === code) {
          return { ...item, [property]: value };
        }
        return item;
      });

      return { classes: updatedClasses };
    });
  },
}));

export default useStore;
