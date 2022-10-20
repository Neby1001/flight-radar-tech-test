<template>
  <article class="p-4">
    <h1 class="font-bold text-2xl mb-4 text-center">Flightradar24 Code Test</h1>
{{openModal}}
    <table
      v-if="flights.length > 0"
      class="border-collapse border border-slate-600 text-sm"
    >
      <thead class="cursor-pointer">
        <tr class="bg-blue-200">
          <th
            v-for="c in COLUMNS"
            :key="c"
            class="border border-slate-600 font-semibold p-1 text-center"
			@click="sortRow(c)"
          >{{ c }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="flight in flights"
          :key="flight.id"
		  class="py-10 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
		  @click="displayModal(flight)"
        >
          <td
            v-for="c in COLUMNS"
            :key="c"
            class="border border-slate-600 p-1 text-center"
          >
		  <span v-if="c !== 'direction'">
            {{ flight[c] }}
		  </span>
		  <span v-else>
			<img class="h-10 w-10" src="/images/aircraft.png" :class="[classMapping[flight.direction]]" />
			{{flight.direction}}
		  </span>
          </td>
        </tr>
      </tbody>
    </table>
	<Modal ref="myModal" :flightDetails="selectedFlightDetails"/>
  </article>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getJSON } from './helpers/apis';
import { DateTime } from "luxon";
import Modal from './components/Modal.vue';

type Direction = 'N' | 'S' | 'E' | 'W' | 'NW' | 'NE' | 'SE' | 'SW';

type Status = 'live' | 'scheduled';

interface Flight {
  id: string,
  airline: string,
  number: string,
  status: Status,
  from: string,
  to: string,
  std: string,
  sta: string,
  latitude: number,
  longitude: number,
  direction: Direction,
  image: string,
  imgClass?: string
}

enum classMapping {
	'N' = '-rotate-90',
	'E' = '',
	'S' = 'rotate-90',
	'W' = 'rotate-180',
	'NW' = 'rotate-nw',
	'NE' = '-rotate-45',
	'SE' = 'rotate-45',
	'SW' = 'rotate-sw'
}

const COLUMNS : Array<keyof Flight> = ['id', 'airline', 'number', 'status', 'from', 'to', 'std', 'sta', 'latitude', 'longitude', 'direction'];

const flights = ref<Array<Flight>>([]);
const myModal = ref(null);
const selectedFlightDetails = ref();

//redo this as enum or class
const roateImage = (flightArr: Array<Flight>) => {
  // our image is at a 45deg rotation by default
  flights.value = flightArr.map((flight: Flight) => {
    switch (flight.direction){
      case 'N': 
        flight.imgClass = '-rotate-90';
        break;
      case 'S':
        flight.imgClass = 'rotate-90';
        break;
      case 'W':
        flight.imgClass = 'rotate-180';
        break;
      case 'NW':
        flight.imgClass = 'rotate-nw'
        break;
      case 'NE': 
        flight.imgClass = '-rotate-45';
        break;
      case 'SE': 
        flight.imgClass = 'rotate-45';
        break;
      case 'SW':
        flight.imgClass = 'transform rotate-sw';
        break;
      default:
        flight.imgClass = ''; // handles east as img already faces there
        break;
    }
    return flight;
  })
}


const sortRow = (col: keyof Flight) => {
  return flights.value.sort((a, b) => {
    const aVal = a[col];
    const bVal = b[col];
    if (typeof aVal === "number" && typeof bVal === "number") return aVal - bVal;
    else if (typeof aVal === "string" && typeof bVal === "string") return aVal.localeCompare(bVal);
    return 1;
  });
}



  const displayModal = (flight: Flight) => {
	selectedFlightDetails.value = flight;
	myModal.value.openModal();
  }

onMounted(async () => {
  const data = (await getJSON('/api/flights'));
  //console.log(data);
  // flights.value = data;
  flights.value = data.map((flight) => {
	flight.staISO = flight.sta;
	flight.sta = DateTime.fromISO(flight.staISO, { zone: "UTC" }).toLocaleString(DateTime.DATETIME_MED);
	flight.stdISO = flight.std;
	flight.std = DateTime.fromISO(flight.stdISO, { zone: "UTC" }).toLocaleString(DateTime.DATETIME_MED);
	return flight;
  });
  //console.log(flights.value)
  //roateImage(flights.value)
});
</script>
