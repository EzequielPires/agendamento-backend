import { BusinessHour, Timeday } from "src/entities/businessHour.entity";
import { Scheduling } from "src/entities/scheduling.entity";

interface SchedulesTimes {
    start: string;
    end: string;
}

function checkDateForScheduling(date: Date, checkDate: Date) {
    const check = new Date(date);
    const newDate = new Date(checkDate);
    let result = check.getTime() - newDate.getTime();

    if (result < 0) {
        result = result * -1;
    }

    if (check.getDate() === newDate.getDate() && result < 1800000) {
        return true;
    } else {
        return false;
    }
}

function getDateFormatedForScheduling(dateStart: Date, durationService: number) {
    dateStart.setHours(dateStart.getHours() + 3);
    let dateEnd = new Date(dateStart);
    dateEnd.setMinutes(dateEnd.getMinutes() + durationService);
    const [dateString, startTime] = toLocaleDateString(dateStart);
    const [, endTime] = toLocaleDateString(dateEnd);

    return {
        dateString,
        startTime,
        endTime
    }
}

function toLocaleDateString(date: Date) {
    const [dateString, timeString] = date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }).split(' ');
    return [
        dateString,
        timeString
    ]
}

function respectBusinessHours(startTimeBusiness: Date, endTimeBusiness: Date, dateScheduling: Date, duration: number) {
    const startTimeNomalized = normalizeDates(startTimeBusiness);
    const endTimeNomalized = normalizeDates(endTimeBusiness);
    const schedulingNomalized = normalizeDates(dateScheduling);
    const finalyTime = normalizeDates(dateScheduling);

    finalyTime.setMinutes(finalyTime.getMinutes() + duration);

    if (
        schedulingNomalized.getTime() < startTimeNomalized.getTime() ||
        schedulingNomalized.getTime() > endTimeNomalized.getTime() ||
        finalyTime.getTime() > endTimeNomalized.getTime()) {
        return false;
    } else {
        return true;
    }
}

function normalizeDates(date: Date) {
    const dateNormalized = new Date();
    dateNormalized.setHours(date.getHours());
    dateNormalized.setMinutes(date.getMinutes());
    dateNormalized.setSeconds(date.getSeconds());
    dateNormalized.setMilliseconds(date.getMilliseconds());

    return dateNormalized;
}

function existScheduling(array: Scheduling[], timeStart, timeEnd) {
    let exist = false;
    console.log(array);
    array.forEach(item => {
        if ((timeStart >= item.details.start && timeStart < item.details.end) || (timeEnd > item.details.start && timeEnd < item.details.end)) {
            exist = true;
        }
    });
    return exist;
}

function generateSchedules(
    date: Date,
    businessHour: BusinessHour,
    schedulings: Scheduling[],
    duration: number
) {
    const {
        domingo,
        segunda,
        terca,
        quarta,
        quinta,
        sexta,
        sabado
    } = businessHour;

    date.setHours(date.getHours() + 3);
    const day = date.getDay();

    let schedulesTimes: Timeday[] = [];

    console.log(date);

    switch (day) {
        case 0:
            schedulesTimes = genarete(domingo, duration, schedulings);
            break;
        case 1:
            schedulesTimes = genarete(segunda, duration, schedulings);
            break;
        case 2:
            schedulesTimes = genarete(terca, duration, schedulings);
            break;
        case 3:
            schedulesTimes = genarete(quarta, duration, schedulings);
            break;
        case 4:
            schedulesTimes = genarete(quinta, duration, schedulings);
            break;
        case 5:
            schedulesTimes = genarete(sexta, duration, schedulings);
            break;
        case 6:
            schedulesTimes = genarete(sabado, duration, schedulings);
            break;
    }

    return schedulesTimes;
}

function genarete(
    timeDay: Timeday[],
    duration: number,
    schedulings: Scheduling[]
) {
    const schedulesTimes: Timeday[] = [];
    //console.log(schedulings);
    //console.log(timeDay);
    timeDay?.forEach(item => {
        const [hoursStart, minutesStart] = item.start.split(':');
        const [hoursEnd, minutesEnd] = item.end.split(':');
        const startTime = new Date();
        const endTime = new Date();
        startTime.setHours(Number(hoursStart));
        startTime.setMinutes(Number(minutesStart));
        startTime.setSeconds(0);
        endTime.setHours(Number(hoursEnd));
        endTime.setMinutes(Number(minutesEnd));
        endTime.setSeconds(0);

        while (startTime.getTime() <= endTime.getTime()) {
            const nextTime = new Date(startTime);
            nextTime.setMinutes(nextTime.getMinutes() + duration);
            if(nextTime.getTime() <= endTime.getTime()) {
                let exist = existScheduling(schedulings, toLocaleDateString(startTime)[1], toLocaleDateString(nextTime)[1]);
                if(!exist) {
                    schedulesTimes.push({
                        start: toLocaleDateString(startTime)[1],
                        end: toLocaleDateString(nextTime)[1]
                    });
                }
            }
            startTime.setMinutes(startTime.getMinutes() + duration);
        }
    });
    return schedulesTimes;
}

export {
    getDateFormatedForScheduling,
    checkDateForScheduling,
    respectBusinessHours,
    generateSchedules,
    toLocaleDateString
}