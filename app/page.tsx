'use client';

import { useState } from 'react';
import { Trip } from '@/app/lib/definitions';
import { initialTrips } from '@/app/lib/data';
import Modal from './components/Modal';

export default function Home() {
  const [trips, setTrips] = useState(initialTrips);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function addTrip(trip: Trip) {
    setTrips([...trips, trip]);
  }

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
          className="ml-2 my-4 p-2 outline-none bg-transparent text-black text-lg placeholder-black"
        />
      </div>
      {trips.map((trip) => (
        <div key={trip.id}>
        </div>
      ))}
      <button
        onClick={openModal}
        className="flex flex-col items-center justify-center bg-gray-200 text-lg w-52 h-52 my-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add trip
      </button>
      <h2 className="text-lg">
        Week
      </h2>
    </div>
  );
}
