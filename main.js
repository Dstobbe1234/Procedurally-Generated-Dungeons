const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;
// hi
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let player = {
  angle: 0,
  draw: function () {
    if (mouse.down) {
      let yDist = mouse.y - 520;
      let xDist = mouse.x - 520;
      let mouseAngle = (Math.atan(xDist / yDist) * 180) / Math.PI;
      console.log(mouseAngle);

      ctx.beginPath();
      ctx.moveTo(520, 520);
      ctx.lineTo(520, yDist + 520);
      ctx.lineTo(xDist + 520, yDist + 520);
      ctx.lineTo(520, 520);
      ctx.stroke();
    }
  },
};

let playerDisplacement = [0, 0];

document.addEventListener("keydown", keydownListener);
document.addEventListener("mousedown", mousedownListener);
document.addEventListener("mouseup", mouseupListener);
document.addEventListener("mousemove", mousemoveListener);

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

// Random walk - procedural dungeon generation

corridorTileArr = [];

class corridorTile {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x + playerDisplacement[0], this.y + playerDisplacement[1], this.w, this.h);
  }
}

function generateCorridors() {
  let vectorArr = [
    [
      [0, -1],
      [0, 1],
    ],
    [
      [-1, 0],
      [1, 0],
    ],
  ];
  let previousVectorIndex = [0, 0];
  let x = 500;
  let y = 500;
  let r = 0;
  for (let i = 0; i < 20; i++) {
    vectorArr.splice(previousVectorIndex[0], 1);
    let randomSegmentLength = randomInt(10, 50);
    let randomVectorIndex = randomInt(0, 2);
    let vector = vectorArr[0][randomVectorIndex];
    for (let m = 0; m < randomSegmentLength; m++) {
      x += 100 * vector[0];
      y += 100 * vector[1];
      corridorTileArr.push(new corridorTile(x, y, 100, 100));
    }
    r += 100;
    vectorArr = [
      [
        [0, -1],
        [0, 1],
      ],
      [
        [-1, 0],
        [1, 0],
      ],
    ];
    for (let p = 0; p < vectorArr.length; p++) {
      for (let l = 0; l < vectorArr[p].length; l++) {
        if (vectorArr[p][l][0] === vector[0] && vectorArr[p][l][1] === vector[1]) {
          previousVectorIndex = [p, l];
          break;
        }
      }
    }
    requestAnimationFrame(loop);
  }
}
function loop() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  for (let i = 0; i < corridorTileArr.length; i++) {
    corridorTileArr[i].draw();
  }
  player.draw();
  ctx.fillRect(500, 500, 40, 40);
  requestAnimationFrame(loop);
}

generateCorridors();
