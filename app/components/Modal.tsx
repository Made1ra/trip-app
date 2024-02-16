import { nanoid } from 'nanoid';
import { Trip } from '@/app/lib/definitions';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    addTrip: (trip: Trip) => void;
};

export default function Modal({ isOpen, onClose, addTrip }: ModalProps) {
    function handleSave() {
        addTrip({
            id: nanoid(),
            city: '',
            startDate: '',
            endDate: ''
        });
        onClose();
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div className="flex flex-col self-center w-max h-max bg-white border shadow fixed z-10">
            <div className="flex flex-row">
                <h1 className="text-lg font-bold m-8">
                    Create trip
                </h1>
                <button
                    onClick={onClose}
                    className="ml-auto m-8"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="text-gray-500 w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex flex-col p-8">
                <label>
                    <span className="text-red-400">*</span> City
                    <br />
                    <select
                        defaultValue=""
                        className="border shadow my-2 p-2 w-96 disabled:text-gray-300"
                    >
                        <option value="" disabled>
                            Please select a city
                        </option>
                        <option value="berlin">
                            Berlin
                        </option>
                        <option value="tokyo">
                            Tokyo
                        </option>
                        <option value="barcelona">
                            Barcelona
                        </option>
                        <option value="kyiv">
                            Kyiv
                        </option>
                    </select>
                </label>
                <label>
                    <span className="text-red-400">*</span> Start date
                    <br />
                    <input
                        type="date"
                        placeholder="Select date"
                        className="my-2 border shadow p-2 w-96"
                    />
                </label>
                <label>
                    <span className="text-red-400">*</span> End date
                    <br />
                    <input
                        type="date"
                        placeholder="Select date"
                        className="my-2 border shadow p-2 w-96"
                    />
                </label>
            </div>
            <div className="flex items-end justify-end ml-auto mr-4">
                <button
                    onClick={onClose}
                    className="rounded text-lg my-4 px-4 py-2 border shadow"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="rounded bg-blue-500 text-lg text-white mx-2 my-4 px-4 py-2 border shadow"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
