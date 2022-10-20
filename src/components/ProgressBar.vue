<template>
<div class="container mx-auto px-4 py-5 bg-slate-200 rounded">
	<div class="relative pt-1">
	<div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-amber-200">
		<div :style="{width: percentage}" class="shadow-none relative flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500">
			<img class="absolute inset-y--12 overflow-visible right-0 w-8 h-8" src="/images/aircraft.png" />
		</div>
	</div>
	</div>
	<div class="float-left">
		{{ distanceFromUser }} km away
	</div>
	<div class="float-right">
		heading {{ direction }}
	</div>
</div>
</template>
<script>
import {DateTime} from 'luxon'
export default {
	name: "ProgressBar",
	props: {
		sta: String,
		std: String,
		long: String,
		lat: String,
		direction: String
	},
	data() {
		return {
			arrival: DateTime.fromISO(this.sta, { zone: "UTC" }),
			departure: DateTime.fromISO(this.std, { zone: "UTC" }),
			currentTime: DateTime.utc(),
			percentage: null,
			distanceFromUser: null
		}
	},
	mounted() {
   	const diffInMinutes = this.arrival.diff(this.departure, 'minutes');
		//console.log(diffInMinutes.toObject())
		const totalJourneyTime = Math.floor(diffInMinutes.toObject().minutes)
		console.log(totalJourneyTime)
		const diffSinceLeft = this.currentTime.diff(this.departure, 'minutes');
		const timeSinceDeperature = Math.floor(diffSinceLeft.toObject().minutes)
		console.log(timeSinceDeperature)
		const percentageOfJourneyDone = timeSinceDeperature / totalJourneyTime;
		const percent = parseFloat(percentageOfJourneyDone).toFixed(2) * 100;
		this.percentage = `${percent}%`
		this.getLocation()
	},
	methods: {
		getLocation: function() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(this.usersLocation);
			} else { 
				x.innerHTML = "Geolocation is not supported by this browser.";
			}
		},
		usersLocation: function(position) {
			console.log(position.coords.latitude, position.coords.longitude)
			console.log(this.lat, 'plane lat')
			console.log(this.long, 'plane long')
			this.distanceFromUser = Math.round(this.calcDistance(this.lat, this.long, position.coords.latitude, position.coords.longitude))
			console.log('DISTANCE', distance)
		},
		calcDistance: function(planeLat, planeLong, userLat, userLong) {
			const R = 6371; // km
			const dLat = this.toRad(userLat-planeLat);
			const dLon = this.toRad(userLong-planeLong);
			const lat1 = this.toRad(planeLat);
			const lat2 = this.toRad(userLat);

			var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;
			console.log(d, 'Distance>?')
			return d;
		},
		toRad: function(value) {
			return value * Math.PI / 180;
		}
	}
}
</script>