<template>
<div>
    <div v-if="showModal" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="relative w-384 my-6 mx-auto max-w-3xl">
        <!--content-->
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <!--header-->
          <div class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t bg-black text-white">
            <h3 class="text-3xl font-semibold uppercase text-amber-400">
              {{flightDetails.id}}
				<span class="text-xs font-bold inline-block py-1 px-2 uppercase rounded text-white bg-gray-600 uppercase last:mr-0 mr-1">
				{{flightDetails.status}}
				</span>
            </h3>
            <img class="float-right cursor-pointer object-contain h-5 w-5" src="/images/close.png" v-on:click="toggleModal()"/>
          </div>
          <!--body-->
          <div class="relative p-6 flex-auto">
			<img class="object-fill h-48 w-96" :src="flightDetails.image"/>
			<div class="absolute inset-x-0 bottom-0 h-8 bg-black opacity-25">
				<span class="font-bold text-white">@{{flightDetails.photographer}}</span>
				<img class="absolute bottom-1 right-0 cursor-pointer h-5 w-5" src="/images/link.png" v-on:click="openImage(flightDetails.image)"/>
			</div>
            <!-- <p class="my-4 text-slate-500 text-lg leading-relaxed">
              I always felt like I could do anything. That’s the main
              thing people are controlled by! Thoughts- their perception
              of themselves! They're slowed down by their perception of
              themselves. If you're taught you can’t do anything, you
              won’t do anything. I was taught I could do everything.
            </p> -->
          </div>
          <!--footer-->
			<div class="grid gap-4 grid-cols-2 flex justify-center text-center py-2">
			<div class="h-20 bg-slate-100">
				<div class="grid grid-cols-1">
					<div class="text-2xl font-bold">{{flightDetails.from}}</div>
					<div class="uppercase text-xl">{{getCity(flightDetails.from)}}</div>
				</div>
			</div>
			<div class="h-20 bg-slate-100 rounded">
				<div class="grid grid-cols-1">
					<div class="text-2xl font-bold">{{flightDetails.to}}</div>
					<div class="uppercase text-xl">{{getCity(flightDetails.to)}}</div>
				</div>
			</div>
			<div class="bg-slate-400 rounded">
				<div class="float-left">Departure</div>
				<div class="float-right">{{getTime(flightDetails.stdISO)}}</div>
			</div>
			<div class="bg-slate-400 rounded">
				<div class="float-left">Arrival</div>
				<div class="float-right">{{getTime(flightDetails.staISO)}}</div>
			</div>
			</div>
		  <progress-bar :sta="flightDetails.staISO" :std="flightDetails.stdISO" :long="flightDetails.longitude" :lat="flightDetails.latitude" :direction="flightDetails.direction"/>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
</div>
</template>
<script>
import ProgressBar from './ProgressBar.vue';
import { getJSON } from '../helpers/apis';
import { DateTime } from 'luxon'
export default {
	name: "Modal-Details",
	components: {ProgressBar},
	props: {
		flightDetails: Object
	},
	data() {
		return {
			showModal: false,
			airports: [],
			fromCity: null,
			toCity: null
		}
	},
	async mounted(){
		const data = (await getJSON('/api/airports'));
		this.airports = data;
		console.log(this.airports)
		//this.getFromCity()
	},
	methods: {
		toggleModal: function(){
			this.showModal = !this.showModal;
			console.log(JSON.parse(JSON.stringify(this.flightDetails)))
		},
		openModal: function(){
			this.showModal = true;
		},
		openImage: function(img){
			window.open(`http://localhost:3000${img}`, '_blank');
		},
		getCity: function(airportCode) {
			const city = this.airports.find((airport) => airport.id === airportCode)?.city
			console.log(city)
			return city;
		},
		getTime: function(isoDate) {
			const time = DateTime.fromISO(isoDate, { zone: "UTC" }).toLocaleString(DateTime.TIME_24_SIMPLE);
			return time;
		}
	}
}
</script>