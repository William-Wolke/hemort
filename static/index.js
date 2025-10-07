const oneMinute = 1 * 60 * 1000;
const tenMinutes = 10 * 60 * 1000;
// Background image
async function setBingImage() {
	const res = await fetch('https://bing.biturl.top/?resolution=1920&format=image');
	document.getElementById('bing-img').src = res.url;
}

function updateClock() {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

async function fetchWeather(city = "Stockholm") {
	try {
		const response = await fetch(`/weather?city=${encodeURIComponent(city)}`)
		const data = await response.json()
		if (data.main && data.weather.length > 0) {
			document.getElementById('weather-temp').textContent = Math.round(data.main.temp);
			const iconId = data.weather[0].icon;
			const iconUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
			document.getElementById('weather-icon').src = iconUrl;
		} else {
			document.getElementById('weather-widget').textContent = 'Weather unavailable';
		}
	}
	catch (error) {
		console.error('Error fetching weather:', error);
		document.getElementById('weather-widget').textContent = 'Weather unavailable';
	}
}

// Clock
document.addEventListener("DOMContentLoaded", function() {
	updateClock();
	setBingImage();
	fetchWeather();
	setInterval(updateClock, oneMinute);
	setInterval(fetchWeather, tenMinutes); // Update every 10 minutes
	setInterval(setBingImage, tenMinutes); // Change image every minute

});


