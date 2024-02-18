import Image from 'next/image';
import { formatDate } from '@/app/lib/utils';

type TripCardProps = {
    id: string;
    city: string;
    startDate: string;
    endDate: string;
    imgSrc: string;
    selected: boolean;
    onClick: (id: string) => void;
};

export default function TripCard({
    id,
    city,
    startDate,
    endDate,
    imgSrc,
    selected,
    onClick
}: TripCardProps) {
    return (
        <div
            onClick={() => onClick(id)}
            className={`w-52 h-80 mr-8 ${selected && 'border border-blue-400'}`}
        >
            <div className="relative w-52 h-52">
                <Image
                    src={imgSrc}
                    alt={city}
                    priority
                    fill
                    sizes="100%"
                    className="w-full h-full"
                />
            </div>
            <p className="m-4 text-base">
                {city}
            </p>
            <p className="m-4 text-sm text-gray-500">
                {formatDate(startDate)} - {formatDate(endDate)}
            </p>
        </div>
    );
}
