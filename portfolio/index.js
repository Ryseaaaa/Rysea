var images = new Array();
images[0] = "assets/mika.png";
var x = 0;

var i = 0;
var txt =
  "> Ik ben een gedreven software developer die een beetje van alles kent. Altijd nieuwsgierig om meer te leren. Grote interesse in game development";
var speed = 15;

function changeImage() {
  document.getElementById("photo").src = images[x];
  x += 1;
  x = x % images.length;
}

window.onload = function () {
  typeWriter();
  setInterval(function () {
    changeImage();
  }, 5000);
};

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("aboutMeShort").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else {
    setInterval(function () {
      blink();
    }, 400);
  }
}

function blink() {
  doc = document.getElementById("aboutMeShort");

  if (doc.innerHTML[doc.innerHTML.length - 1] == "_") {
    doc.innerHTML = doc.innerHTML.slice(0, doc.innerHTML.length - 1);
  } else {
    doc.innerHTML += "_";
  }
}
