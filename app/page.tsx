'use client';

import { useState, useEffect } from 'react';
import { Trip, Countdown } from '@/app/lib/definitions';
import { initialTrips } from '@/app/lib/data';
import { getForecast, getTodaysWeather } from '@/app/lib/actions';
import Modal from '@/app/components/Modal';
import TripCard from '@/app/components/TripCard';
import { getDayOfTheWeekByDate } from './lib/utils';

export default function Home() {
  const [searchValue, setSearchValue] = useState('');
  const [trips, setTrips] = useState(initialTrips);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todaysWeather, setTodaysWeather] = useState<{ temp: number, icon: string } | null>(null);
  const [countdown, setCountdown] = useState<Countdown>(null);

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
    setSelectedTrip(trips.find((trip) => trip.id === id) || null);
    if (selectedTrip) {
      getTodaysWeather(selectedTrip.city)
        .then((data) => {
          console.log(selectedTrip, selectedTrip?.city);
          console.log(data);
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
          console.log(data);
          setTodaysWeather({
            temp: data.days[0].temp,
            icon: data.days[0].icon
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
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
      clearInterval(interval)
    };
  }, [selectedTrip]);

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
      <div className="w-80 flex flex-row items-center bg-gray-200 my-8 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="search"
          placeholder="Search your trip"
          value={searchValue}
          onChange={handleChange}
          className="ml-2 my-4 p-2 outline-none bg-transparent text-black text-lg placeholder-black"
        />
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
      {true && (
        <>
          <div className="flex items-start justify-center w-48 h-96 bg-blue-900">
            <h1 className="text-white text-xl font-bont mt-8">
              {getDayOfTheWeekByDate(new Date().toISOString())}
            </h1>
            <div>
              {countdown?.days} {countdown?.hours} {countdown?.minutes} {countdown?.seconds}
            </div>
          </div>
          <h2 className="mt-4 text-lg">
            Week
          </h2>
        </>
      )}
    </div>
  );
}
