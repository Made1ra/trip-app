'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Trip, Countdown, TodaysWeather, Forecast } from '@/app/lib/definitions';
import { initialTrips } from '@/app/lib/data';
import { getForecast, getTodaysWeather } from '@/app/lib/actions';
import { getDayOfTheWeekByDate } from '@/app/lib/utils';
import Modal from '@/app/components/modal';
import TripCard from '@/app/components/trip-card';
import ForecastCard from '@/app/components/forecast-card';

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>(localStorage.getItem('trips') ?
    JSON.parse(localStorage.getItem('trips') || '[]') :
    initialTrips
  );
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todaysWeather, setTodaysWeather] = useState<TodaysWeather>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [countdown, setCountdown] = useState<Countdown>(null);

  const selectedTrip = trips.find((trip) => trip.selected);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function addTrip(trip: Trip) {
    setTrips([
      ...trips,
      trip
    ]);
  }

  function updateSelectedTrip(id: string) {
    setTrips(trips.map((trip) => {
      if (trip.id === id) {
        return {
          ...trip,
          selected: !trip.selected
        };
      } else if (trip.selected) {
        return {
          ...trip,
          selected: false
        };
      }

      return trip;
    }));
  }

  function sortTripsByStartDate() {
    setTrips(trips.toSorted((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }));
  }

  useEffect(() => {
    if (selectedTrip) {
      getTodaysWeather(selectedTrip.city)
        .then((data) => {
          setTodaysWeather({
            temp: data.days[0].temp,
            icon: data.days[0].icon
          });
        })
        .catch((error) => {
          console.error(error);
        });
      getForecast(selectedTrip.city, selectedTrip.startDate, selectedTrip.endDate)
        .then((data) => {
          setForecast(data.days.map((day: Forecast) => {
            return {
              icon: day.icon,
              datetime: day.datetime,
              tempmax: day.tempmax,
              tempmin: day.tempmin
            };
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedTrip]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedTrip) {
        const currentDate = new Date().getTime();
        const startDate = new Date(selectedTrip.startDate).getTime();
        const difference = startDate - currentDate;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      clearInterval(intervalId)
    };
  }, [selectedTrip]);

  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips));
  }, [trips]);

  return (
    <div className="m-10">
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        addTrip={addTrip}
      />
      <h1 className="text-xl">
        Weather <b>Forecast</b>
      </h1>
      <div className="flex flex-row items-center">
        <div className="w-80 flex flex-row items-center bg-gray-200 my-8 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="search"
            placeholder="Search your trip"
            value={searchValue}
            onChange={handleChange}
            className="ml-2 my-4 px-2 outline-none bg-transparent text-black text-lg placeholder-black"
          />
        </div>
        <button
          onClick={sortTripsByStartDate}
          className="h-max ml-4 bg-gray-200 px-4 py-2 rounded shadow text-black text-lg"
        >
          Sort trips by start date
        </button>
      </div>
      <div className="flex flex-row">
        {trips.filter((trip) => trip.city.toLowerCase().includes(searchValue.toLowerCase())).map((trip) => (
          <TripCard
            key={trip.id}
            id={trip.id}
            city={trip.city}
            startDate={trip.startDate}
            endDate={trip.endDate}
            imgSrc={trip.imgSrc}
            selected={trip.selected}
            onClick={updateSelectedTrip}
          />
        ))}
        <button
          onClick={openModal}
          className="flex flex-col items-center justify-center bg-gray-200 text-lg w-52 h-52"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add trip
        </button>
      </div>
      {(selectedTrip && todaysWeather) && (
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
                  src={`/icons/${todaysWeather.icon}.svg`}
                  alt={todaysWeather.icon}
                  fill
                  sizes="100%"
                  className="-ml-4 w-full h-full"
                />
              </div>
              <div className="flex flex-row text-6xl font-bold text-white text-center">
                <p>
                  {Math.round(todaysWeather.temp)}
                </p>
                <sup className="font-thin text-xl">
                  °C
                </sup>
              </div>
            </div>
            <p className="mb-4 self-center text-xl text-white">
              {selectedTrip.city}
            </p>
            <div className="mt-20 flex flex-row self-center">
              <div className="flex-col text-white uppercase m-4">
                <p className="text-xl font-bold text-center">
                  {countdown?.days}
                </p>
                <p className="mt-2 text-base font-light uppercase">
                  DAYS
                </p>
              </div>
              <div className="flex-col text-white uppercase m-4">
                <p className="text-xl font-bold text-center">
                  {countdown?.hours}
                </p>
                <p className="mt-2 text-base font-light uppercase">
                  HOURS
                </p>
              </div>
              <div className="flex-col text-white uppercase m-4">
                <p className="text-xl font-bold text-center">
                  {countdown?.minutes}
                </p>
                <p className="mt-2 text-base font-light uppercase">
                  MINUTES
                </p>
              </div>
              <div className="flex-col text-white uppercase m-4">
                <p className="text-xl font-bold text-center">
                  {countdown?.seconds}
                </p>
                <p className="mt-2 text-base font-light uppercase">
                  SECONDS
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedTrip && (
        <div className="mt-8">
          <h2 className="text-lg">
            {forecast.length > 6 ? 'Week' : `${forecast.length} days`}
          </h2>
          <div className="flex flex-row">
            {forecast.slice(0, 7).map((day) => (
              <ForecastCard
                key={day.datetime}
                icon={day.icon}
                datetime={day.datetime}
                tempmax={day.tempmax}
                tempmin={day.tempmin}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
