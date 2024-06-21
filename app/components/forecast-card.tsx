import Image from "next/image";
import { Forecast } from "@/app/lib/definitions";
import { getDayOfTheWeekByDate } from "@/app/lib/utils";

export default function ForecastCard({
  datetime,
  icon,
  tempmax,
  tempmin,
}: Forecast) {
  return (
    <div className="flex flex-col items-center pr-4 py-4">
      <p className="text-gray-500">{getDayOfTheWeekByDate(datetime)}</p>
      <div className="relative w-12 h-12">
        <Image
          src={`/icons/${icon}.svg`}
          alt={icon}
          fill
          sizes="100%"
          className="my-2"
        />
      </div>
      <p className="mt-4">
        {Math.round(tempmax)}°/{Math.round(tempmin)}°
      </p>
    </div>
  );
}
