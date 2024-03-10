// Sé que no es la mejor forma de hacerlo, peeero...
export const timeObjectFromSeconds = (millis = 0) => {
    const timeObject = {
        totalSeconds: Math.floor(millis / 1000),
    };
    timeObject.minutes = Math.floor(timeObject.totalSeconds / 60);
    timeObject.seconds = timeObject.totalSeconds % 60

    timeObject.stringified = {
        minutes: timeObject.minutes.toString().padStart(2, '0'),
        seconds: timeObject.seconds.toString().padStart(2, '0'),
    };

    return timeObject;
}