/**
 * Given a zip code, find the five closest polling places
 * If zip code has been searched before, pull from cache in database
 */

import { getDistance, orderByDistance } from "geolib";

// function findDistance(loc1: { latitude: number, longitude: number }, loc2: { latitude: number, longitude: number }) {
//     const distance = 2 * Math.asin(Math.sqrt((Math.sin((loc1.latitude - loc2.latitude) / 2)) ** 2 + Math.cos(loc1.latitude) * Math.cos(loc2.latitude) * (Math.sin((loc1.longitude - loc2.longitude) / 2)) ** 2));

//     console.log(distance);
//     return distance;
// }

const loc1 = {
    latitude: 32.734008146898,
    longitude: -97.0297685478071
};
const loc2 = {
    latitude: 32.9609652546507,
    longitude: -96.733276254386
}

getDistance(loc1, loc2);