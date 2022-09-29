const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;

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

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let player = {
  angle: 0,
  draw: function () {
    ctx.fillStyle = "purple";
    //playerAnim();
  },
};

//hi
// Random walk - procedural dungeon generation

let corridorTileArr = {
  horizontal: [],
  vertical: [],
};

class corridorTile {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

let vector;
let nextVector;
let randomSegmentLength;
function generateCorridors() {
  let previousVectorIndex;
  let x = 500;
  let y = 500;
  for (let i = 1; i <= 21; i++) {
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
    let randomVectorIndex = randomInt(0, 2);
    if (i !== 1 && i !== 21) {
      nextVector = vectorArr.splice(previousVectorIndex[0], 1)[0][randomVectorIndex];
    } else {
      randomSegmentLength = randomInt(10, 50);
      vector = [0, -1];
      nextVector = vectorArr[1][randomVectorIndex];
    }
    let nexSegmentLength = randomInt(10, 50);
    console.log(randomSegmentLength);
    let posOrNegDistanceChange = randomInt(0, 2);
    if (vector[0] === 0) {
      console.log(y + 1 * (vector[1] * randomSegmentLength));
      tileIterations: for (let w = 0; w < corridorTileArr.horizontal.length; w++) {
        if (
          y + 1 * (vector[1] * randomSegmentLength) > corridorTileArr.horizontal[w].y - 2 &&
          y + 1 * (vector[1] * randomSegmentLength) < corridorTileArr.horizontal[w].y + 2
        ) {
          console.log("EEEEEE");
          for (let p = 0; p < nexSegmentLength; p++) {
            if (x + 1 * (nextVector[0] * p) === corridorTile.horizontal[x].x) {
              console.log("EEEEEEEEEEEE");
              if (posOrNegDistanceChange == 1) {
                randomSegmentLength++;
              } else {
                randomSegmentLength--;
              }
              w = 0;
              break tileIterations;
            }
          }
        }
      }
    } else {
      for (let w = 0; w < corridorTileArr.vertical.length; w++) {
        if (
          x + 1 * (vector[1] * randomSegmentLength) > corridorTileArr.vertical[w].x - 2 &&
          x + 1 * (vector[1] * randomSegmentLength) < corridorTileArr.vertical[w].x + 2
        ) {
          for (let p = 0; p < nexSegmentLength; p++) {
            if (y + 1 * (nextVector[0] * p) === corridorTileArr.vertical[w].y) {
              if (posOrNegDistanceChange == 1) {
                randomSegmentLength++;
              } else {
                randomSegmentLength--;
              }
            }
            w = 0;
            break;
          }
        }
      }
    }
    console.log(randomSegmentLength);
    for (let m = 0; m <= randomSegmentLength; m++) {
      x += 1 * vector[0];
      y += 1 * vector[1];
      if (vector[0] === 0) {
        corridorTileArr.vertical.push(new corridorTile(x, y, 1, 1));
      } else {
        corridorTileArr.horizontal.push(new corridorTile(x, y, 1, 1));
      }
    }
    previousVectorIndex = vector;
    vector = nextVector;
    randomSegmentLength = nexSegmentLength;
    requestAnimationFrame(loop);
  }

  function loop() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    for (let i = 0; i < corridorTileArr.vertical.length; i++) {
      corridorTileArr.vertical[i].draw();
    }
    for (let f = 0; f < corridorTileArr.horizontal.length; f++) {
      corridorTileArr.horizontal[f].draw();
    }
    requestAnimationFrame(loop);
  }
}

generateCorridors();
