import React from "react";

interface TimeSelectorProps {
  onSelect: (selectedTime: string) => void;
  bookedTimes: string[];
}

interface TimeSelectorState {
  selectedTime: string;
  bookedTimes: string[];
}

class TimeSelector extends React.Component<
  TimeSelectorProps,
  TimeSelectorState
> {
  constructor(props: TimeSelectorProps) {
    super(props);
    this.state = {
      selectedTime: "",
      bookedTimes: props.bookedTimes, // Get bookedTimes from props
    };
  }

  handleTimeSelect = (selectedTime: string) => {
    this.setState({ selectedTime });
    this.props.onSelect(selectedTime);
  };

  render() {
    const startTime = 9 * 60; // 9:00 in minutes
    const endTime = 17 * 60; // 16:00 in minutes
    const interval = 15; // 15 minutes interval
    const times = [];

    for (let i = startTime; i < endTime; i += interval) {
      const hour = Math.floor(i / 60);
      const minute = i % 60;
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      const isBooked = this.state.bookedTimes
        ? this.state.bookedTimes.includes(timeString)
        : false;

      times.push(
        <div
          key={i}
          className={`cursor-pointer border-solid border-2 rounded border-sky-100 w-32 text-center ${
            isBooked ? "booked" : ""
          }`}
          onClick={() => (!isBooked ? this.handleTimeSelect(timeString) : null)}
        >
          {timeString} {isBooked ? "(Booked)" : ""}
        </div>
      );
    }
    console.log(times);
    return (
      <div className='h-3/4 overflow-y-auto w-48 bg-blue'>
        <div className='flex flex-col list-none gap-2 justify-center items-center'>
          {times}
        </div>
      </div>
    );
  }
}

export default TimeSelector;
