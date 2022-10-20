const express = require('express');
const { createServer: createViteServer } = require('vite');

const { AIRLINES, AIRPORTS, FLIGHTS } = require('./api/fakeData');

const respondWithFakeData = (data) => (req, res) => {
	res.header('Content-Type', 'application/json');
	res.send(data);
};

const findAirline = () => (req, res) => {
	const data = AIRLINES.find((airline) => req.params.airlineId === airline.id);
	res.header('Content-Type', 'application/json');
	res.send(data);
}

const findAirport = () => (req, res) => {
	console.log(req.params)
	const data = AIRPORTS.find((airport) => req.params.airportId === airport.id);
	res.header('Content-Type', 'application/json');
	res.send(data);
}

async function createServers() {
	const api = express();

	api.use(express.static('public'));

	//
	// apis
	//
	api.get('/api/airlines', respondWithFakeData(AIRLINES));
	api.get('/api/airports', respondWithFakeData(AIRPORTS));
	api.get('/api/flights', respondWithFakeData(FLIGHTS));
	api.get('/api/airline/:airlineId', findAirline);
	api.get('/api/airport/:airportId', findAirport);

	//
	// start server
	//
	api.listen(3001);

	const vite = await createViteServer({
		server: {
			port: 3000,
			proxy: {
				'/api': {
					target: 'http://localhost:3001',
					changeOrigin: true,
				}
			}
		}
	});

	await vite.listen();
}

createServers();
