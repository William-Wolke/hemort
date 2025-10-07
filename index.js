async function setBingImage() {
	const res = await fetch('https://bing.biturl.top/?resolution=1920&format=image');
	document.getElementById('bing-img').src = res.url;
}
setBingImage();
setInterval(setBingImage, 60000); // Change image every minute
