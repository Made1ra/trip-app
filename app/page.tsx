'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, Navigation } from 'swiper/modules';
import {
  Trip,
  Countdown,
  TodaysWeather,
  Forecast,
} from '@/app/lib/definitions';
import { initialTrips } from '@/app/lib/data';
import { getForecast, getTodaysWeather } from '@/app/lib/actions';
import Modal from '@/app/components/modal';
import TripCard from '@/app/components/trip-card';
import WeatherCard from '@/app/components/weather-card';
import ForecastCard from '@/app/components/forecast-card';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';

export default function Home() {
  const [trips, setTrips] = useState(initialTrips);
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
    setTrips([...trips, trip]);
  }

  function updateSelectedTrip(id: string) {
    setTrips(
      trips.map((trip) => {
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
      })
    );
  }

  function sortTripsByStartDate() {
    setTrips(
      trips.toSorted((a, b) => {
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      })
    );
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
      getForecast(
        selectedTrip.city,
        selectedTrip.startDate,
        selectedTrip.endDate
      )
        .then((data) => {
          setForecast(
            data.days.map((day: Forecast) => {
              return {
                icon: day.icon,
                datetime: day.datetime,
                tempmax: day.tempmax,
                tempmin: day.tempmin
              };
            })
          );
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
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedTrip]);

  return (
    <div className="m-10">
      <Modal
        isOpen={isModalOpen}
        addTrip={addTrip}
        onClose={closeModal}
      />
      <h1 className="text-xl">
        Weather <b>Forecast</b>
      </h1>
      <div className="flex flex-row items-center">
        <div className="w-80 flex flex-row items-center bg-gray-200 my-8 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 ml-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
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
      <div className="flex flex-row items-start justify-start">
        <div className={`flex ${searchValue ? 'w-[35rem]' : 'w-[37.5rem]'} mr-3`}>
          <Swiper
            modules={[Navigation, Scrollbar]}
            spaceBetween={10}
            slidesPerView={searchValue ? 1 : 3}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
          >
            {trips
              .filter((trip) =>
                trip.city.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((trip) => (
                <SwiperSlide key={trip.id}>
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
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <button
          onClick={openModal}
          className="flex flex-col items-center justify-center bg-gray-200 text-lg w-52 h-52"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add trip
        </button>
      </div>
      {selectedTrip && todaysWeather && countdown && (
        <WeatherCard
          icon={todaysWeather.icon}
          temp={todaysWeather.temp}
          city={selectedTrip.city}
          days={countdown.days > 0 ? countdown.days : 0}
          hours={countdown.hours > 0 ? countdown.hours : 0}
          minutes={countdown.minutes > 0 ? countdown.minutes : 0}
          seconds={countdown.seconds > 0 ? countdown.seconds : 0}
        />
      )}
      {selectedTrip && (
        <div className="mt-8">
          <h2 className="text-lg">
            {forecast.length === 7 ? 'Week' : `${forecast.length} days`}
          </h2>
          <div className="flex flex-row w-[52.5rem]">
            <Swiper
              modules={[Navigation, Scrollbar]}
              spaceBetween={10}
              slidesPerView={searchValue ? 1 : 3}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
            >
              {forecast.map((day) => (
                <SwiperSlide key={day.datetime}>
                  <ForecastCard
                    icon={day.icon}
                    datetime={day.datetime}
                    tempmax={day.tempmax}
                    tempmin={day.tempmin}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}
