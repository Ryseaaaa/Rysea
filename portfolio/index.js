var images = new Array();
images[0] = "assets/dummy2.jpg";
images[1] = "assets/dummy3.webp";
images[2] = "assets/dummy4.avif";
var x = 0;

function changeImage() {
  document.getElementById("photo").src = images[x];
  x += 1;
  x = x % images.length;
}

window.onload = function () {
  setInterval(function () {
    changeImage();
  }, 5000);
};
