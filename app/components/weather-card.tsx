import Image from 'next/image';
import { getDayOfTheWeekByDate } from '@/app/lib/utils';

type WeatherCardProps = {
    icon: string;
    temp: number;
    city: string;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

export default function WeatherCard({ icon, temp, city, days, hours, minutes, seconds }: WeatherCardProps) {
    return (
        <div className="flex float-right mt-[-30rem] mr-12">
            <div className="flex flex-col items-start justify-center w-[30rem] h-[50rem] bg-indigo-950">
                <div className="relative -top-40 -right-96 ml-2 flex items-center justify-center w-16 h-16 bg-teal-400 rounded-full">
                    <div className="text-5xl">
                        🐧
                    </div>
                </div>
                <div className="self-center">
                    <p className="text-white text-3xl font-bold mt-4">
                        {getDayOfTheWeekByDate(new Date().toISOString())}
                    </p>
                </div>
                <div className="flex flex-row p-4 items-center self-center mr-16">
                    <div className="relative w-20 h-20">
                        <Image
                            src={`/icons/${icon}.svg`}
                            alt={icon}
                            fill
                            sizes="100%"
                            className="-ml-4 w-full h-full"
                        />
                    </div>
                    <div className="flex flex-row text-6xl font-bold text-white text-center">
                        <p>
                            {Math.round(temp)}
                        </p>
                        <sup className="font-thin text-xl">
                            °C
                        </sup>
                    </div>
                </div>
                <p className="mb-4 self-center text-xl text-white">
                    {city}
                </p>
                <div className="mt-20 flex flex-row self-center">
                    <div className="flex-col text-white uppercase m-4">
                        <p className="text-xl font-bold text-center">
                            {days}
                        </p>
                        <p className="mt-2 text-base font-light uppercase">
                            DAYS
                        </p>
                    </div>
                    <div className="flex-col text-white uppercase m-4">
                        <p className="text-xl font-bold text-center">
                            {hours}
                        </p>
                        <p className="mt-2 text-base font-light uppercase">
                            HOURS
                        </p>
                    </div>
                    <div className="flex-col text-white uppercase m-4">
                        <p className="text-xl font-bold text-center">
                            {minutes}
                        </p>
                        <p className="mt-2 text-base font-light uppercase">
                            MINUTES
                        </p>
                    </div>
                    <div className="flex-col text-white uppercase m-4">
                        <p className="text-xl font-bold text-center">
                            {seconds}
                        </p>
                        <p className="mt-2 text-base font-light uppercase">
                            SECONDS
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
