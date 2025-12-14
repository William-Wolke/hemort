const oneMinute = 1 * 60 * 1000;
const tenMinutes = 10 * 60 * 1000;
const fourMinutes = 4 * 60 * 1000;
// Background image
async function setBackgroundImage() {
	try {
		const res = await fetch('/random-image');
		const data = await res.json();
		document.getElementById('background-img').src = data.url;
	} catch (error) {
		console.error('Error fetching random image:', error);
	}
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


function debounceHide(element, timeout = 30000) {
	if (!element) {
		return
	}
	let timer;
	function show() {
		element.classList.add('fade-show');
		element.classList.remove('fade-hide');
	}
	function hide() {
		element.classList.add('fade-hide');
		element.classList.remove('fade-show');
	}
	function resetTimer() {
		show();
		clearTimeout(timer);
		timer = setTimeout(hide, timeout);
	}
	// Listen for user activity
	['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach(evt =>
		document.addEventListener(evt, resetTimer)
	);
	resetTimer(); // Start timer on load
}

document.addEventListener("DOMContentLoaded", function() {
	updateClock();
	setBackgroundImage();
	fetchWeather();
	debounceHide(document.getElementById('links'), 30000);
	setInterval(updateClock, oneMinute);
	setInterval(fetchWeather, tenMinutes); // Update every 10 minutes
	setInterval(setBackgroundImage, fourMinutes); // Change image every 4 minutes 
});


