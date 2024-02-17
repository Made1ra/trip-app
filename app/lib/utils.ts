export function formatDate(date: string) {
    const parts = date.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

export function getDayOfTheWeekByDate(date: string) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
}
