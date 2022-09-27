const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;

document.addEventListener("keydown", keydownListener);
document.addEventListener("mousedown", mousedownListener);
document.addEventListener("mouseup", mouseupListener);
document.addEventListener("mousemove", mousemoveListener);

let mouse = {
  x: 0,
  y: 0,
  down: false,
};

function mousedownListener() {
  mouse.down = true;
}

function mouseupListener() {
  mouse.down = false;
}

function mousemoveListener(event) {
  mouse.x = event.x - cnv.getBoundingClientRect().x;
  mouse.y = event.y - cnv.getBoundingClientRect().y;
}

function keydownListener(event) {
  if (event.key === "w") {
    playerDisplacement[1] += 50;
  } else if (event.key === "s") {
    playerDisplacement[1] -= 50;
  } else if (event.key === "d") {
    playerDisplacement[0] -= 50;
  } else if (event.key === "a") {
    playerDisplacement[0] += 50;
  }
}
