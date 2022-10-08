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
  },
};

let corridorTiles = {
  horizontal: [],
  vertical: [],
};

class corridorTile {
  constructor(position, w, h) {
    this.position = position;
    this.w = w;
    this.h = h;
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(this.position[0], this.position[1], this.w, this.h);
  }
}

let vector, nextVector, randomSegmentLength, nextSegmentLength;

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
    nextSegmentLength = randomInt(10, 50);

    if (vector[0] == 0) {
      //vertical
      fixCorridors([y, x], corridorTiles.horizontal, [1, 0]);
    } else {
      //horizontal
      fixCorridors([x, y], corridorTiles.vertical, [0, 1]);
    }

    for (let m = 0; m <= randomSegmentLength; m++) {
      console.log("test");
      x += 1 * vector[0];
      y += 1 * vector[1];
      if (vector[0] === 0) {
        corridorTiles.vertical.push(new corridorTile([x, y], 1, 1));
      } else {
        corridorTiles.horizontal.push(new corridorTile([x, y], 1, 1));
      }
    }
    previousVectorIndex = vector;
    vector = nextVector;
    randomSegmentLength = nextSegmentLength;
  }
}
function fixCorridors(pos, segmentOrientation, segmentPos) {
  let posOrNegDistanceChange = randomInt(0, 2);
  for (let w = 0; w < segmentOrientation.length; w++) {
    if (
      // If the new hallway segment that is being made is horizontal:
      //checks to see if the x of the last pixel of the current segment is in range (in between +2 and -2) of any other horizontal hallway segment
      //Does opposite for vertical
      pos[0] + 1 * (vector[segmentPos[0]] * randomSegmentLength) > segmentOrientation[w].position[segmentPos[0]] - 2 &&
      pos[0] + 1 * (vector[segmentPos[0]] * randomSegmentLength) < segmentOrientation[w].position[segmentPos[0]] + 2
    ) {
      for (let p = 0; p < nextSegmentLength; p++) {
        if (pos[1] + 1 * (nextVector[segmentPos[1]] * p) === segmentOrientation[w].position[segmentPos[1]]) {
          if (posOrNegDistanceChange == 1) {
            randomSegmentLength++;
          } else {
            randomSegmentLength--;
          }
          w = 0;
          break;
        }
      }
    }
  }
}

function loop() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  for (let i = 0; i < corridorTiles.vertical.length; i++) {
    corridorTiles.vertical[i].draw();
  }
  for (let f = 0; f < corridorTiles.horizontal.length; f++) {
    corridorTiles.horizontal[f].draw();
  }
  requestAnimationFrame(loop);
}

generateCorridors();
requestAnimationFrame(loop);
