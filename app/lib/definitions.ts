export type Trip = {
    id: string;
    city: string;
    startDate: string;
    endDate: string;
    imgSrc: string;
    selected: boolean;
};

export type Countdown = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
} | null;
