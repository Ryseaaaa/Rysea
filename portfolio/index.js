var images = new Array();
images[0] = "assets/mika.png";
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
