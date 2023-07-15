const express = require("express");
const https = require("https"); //No need to install
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

app.post("/", (req, res) => {
	const city = req.body.cityName;
	const apiKey = "e5d0d27a70c2674dbb3440ab2055e329";
	const unit = "metric";
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

	https.get(url, (response) => {
		console.log(response.statusCode); //response.statusCode
		response.on("data", (data) => {
			const weatherData = JSON.parse(data); //There's also JSON.stringify
			console.log(weatherData);

			const temperature = weatherData.main.temp;
			console.log(temperature);

			const weatherDescription = weatherData.weather[0].description;
			console.log(weatherDescription);

			const weatherImage = weatherData.weather[0].icon;
			console.log(weatherImage);

			res.write(
				`<h1>The temperature in ${city} is ${temperature} degrees celsius.</h1>`
			);

			res.write(`<p>The weather is currently ${weatherDescription}.</p>`);

			res.write(
				`<img src="http://openweathermap.org/img/wn/${weatherImage}@2x.png" height=150>`
			);

			res.write(`<a href="/">Go back</a>`);

			res.send();
		});
	});
});

app.listen(3000, () => {
	console.log("Server is running on port 3000...");
});
