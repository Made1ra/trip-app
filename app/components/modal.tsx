"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Trip } from "@/app/lib/definitions";
import { cities } from "@/app/lib/data";
import { getImageByCity } from "@/app/lib/actions";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  addTrip: (trip: Trip) => void;
};

export default function Modal({ isOpen, onClose, addTrip }: ModalProps) {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  function handleChangeCity(event: React.ChangeEvent<HTMLSelectElement>) {
    setCity(event.target.value);
  }

  function handleChangeStartDate(event: React.ChangeEvent<HTMLInputElement>) {
    setStartDate(event.target.value);
  }

  function handleChangeEndDate(event: React.ChangeEvent<HTMLInputElement>) {
    setEndDate(event.target.value);
  }

  function handleClose() {
    setCity("");
    setStartDate("");
    setEndDate("");
    onClose();
  }

  function handleSave() {
    getImageByCity(city)
      .then((data) => {
        addTrip({
          id: nanoid(),
          city: city,
          startDate: startDate,
          endDate: endDate,
          imgSrc: data.results[0].urls.regular,
          selected: false,
        });
        handleClose();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <form
      action={handleSave}
      className="flex flex-col w-max h-max bg-white border shadow fixed z-10"
    >
      <div className="flex flex-row">
        <h1 className="text-lg font-bold m-8">Create trip</h1>
        <button
          onClick={handleClose}
          className="ml-auto m-8 hover:outline-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="text-gray-500 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col p-8">
        <label>
          <span className="text-red-400">*</span> City
          <br />
          <select
            value={city}
            onChange={handleChangeCity}
            required
            className="border shadow my-2 p-2 w-96 disabled:text-gray-300"
          >
            <option value="" disabled>
              Please select a city
            </option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-red-400">*</span> Start date
          <br />
          <input
            type="date"
            placeholder="Select date"
            value={startDate}
            onChange={handleChangeStartDate}
            required
            min={minDate}
            max={maxDate}
            className="my-2 border shadow p-2 w-96"
          />
        </label>
        <label>
          <span className="text-red-400">*</span> End date
          <br />
          <input
            type="date"
            placeholder="Select date"
            value={endDate}
            onChange={handleChangeEndDate}
            required
            min={minDate}
            max={maxDate}
            className="my-2 border shadow p-2 w-96"
          />
        </label>
      </div>
      <div className="flex items-end justify-end ml-auto mr-4">
        <button
          onClick={handleClose}
          className="rounded text-lg my-4 px-4 py-2 border shadow
                    hover:border-blue-600
                    active:border-blue-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-blue-500 text-lg text-white mx-2 my-4 px-4 py-2 border shadow
                    hover:bg-blue-600
                    active:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
