export const timeToSeconds = (time: string): number => {
    const [hours, minutes, secondsMs] = time.split(':');
    const [seconds, milliseconds] = secondsMs.split(',');
  
    return (
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(seconds) +
      parseInt(milliseconds) / 1000
    );
  };