'use server';

export async function getForecast(city: string, date1: string, date2: string) {
    const API_KEY = process.env.API_KEY;
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/
    ${city}/${date1}/${date2}?unitGroup=metric&include=days&key=${API_KEY}&contentType=json`);

    return await response.json();
}

export async function getTodaysWeather(city: string) {
    const API_KEY = process.env.API_KEY;
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/
    ${city}/today?unitGroup=metric&include=days&key=${API_KEY}&contentType=json`);
    
    return await response.json();
}

export async function getImageByCity(city: string) {
    const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
    const headers = new Headers();
    headers.append('Authorization', `Client-ID ${UNSPLASH_API_KEY}`);
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${city}`, {
        headers: headers
    });

    return await response.json();
}
