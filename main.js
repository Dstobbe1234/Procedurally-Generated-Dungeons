const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;

document.addEventListener("mousedown", mousedownListener);
document.addEventListener("mouseup", mouseupListener);
document.addEventListener("mousemove", mousemoveListener);

const size = 1;
const segmentNum = 21;
let allTiles;

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
  constructor(position, color) {
    this.position = position;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position[0], this.position[1], size, size);
  }
}

let testingArray = [];

let vector, nextVector, currentSegmentLength, nextSegmentLength;
let currentPos = [500, 500];
let equal = false;
let color = "black";
function generateCorridors() {
  let previousVectorIndex;
  for (let i = 0; i < segmentNum; i++) {
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
    if (equal) {
      color = "red";
      equal = false;
    } else {
      color = "black";
    }

    let randomVectorIndex = randomInt(0, 2);
    if (i !== 0 && i !== segmentNum - 1) {
      nextVector = vectorArr.splice(previousVectorIndex[0], 1)[0][randomVectorIndex];
    } else {
      currentSegmentLength = randomInt(10, 50);
      vector = [0, -1];
      nextVector = vectorArr[1][randomVectorIndex];
    }
    nextSegmentLength = randomInt(10, 50);
    //hi
    if (vector[0] == 0) {
      //vertical
      fixCorridors(corridorTiles.horizontal, [1, 0]);
      corridorTiles.vertical.push([]);
    } else {
      //horizontal
      fixCorridors(corridorTiles.vertical, [0, 1]);
      corridorTiles.horizontal.push([]);
    }

    for (let m = 0; m <= currentSegmentLength; m++) {
      currentPos[0] += vector[0];
      currentPos[1] += vector[1];
      if (vector[0] === 0) {
        corridorTiles.vertical[corridorTiles.vertical.length - 1].push(
          new corridorTile([currentPos[0], currentPos[1]], color)
        );
      } else {
        corridorTiles.horizontal[corridorTiles.horizontal.length - 1].push(
          new corridorTile([currentPos[0], currentPos[1]], color)
        );
      }
    }
    previousVectorIndex = vector;
    vector = nextVector;
    currentSegmentLength = nextSegmentLength;

    testingArray.push({ vector: vector, length: currentSegmentLength });
  }
  allTiles = corridorTiles.vertical.flat(1).concat(corridorTiles.horizontal.flat(1));
}

console.log(testingArray);

function fixCorridors(segmentOrientation, pos) {
  let posOrNegDistanceChange = randomInt(0, 2);
  firstLoop: for (let w = 0; w < segmentOrientation.length; w++) {
    const segmentTile1 = segmentOrientation[w][0].position[pos[0]];
    const segmentLength = vector[pos[0]] * currentSegmentLength;
    const finalPixel = [currentPos[pos[0]] + segmentLength, currentPos[pos[1]]];

    if (finalPixel[0] > segmentTile1 - 5 && finalPixel[0] < segmentTile1 + 5) {
      let segmentPos = [];
      for (let index = 0; index < segmentOrientation[w].length; index++) {
        segmentPos.push(segmentOrientation[w][index].position[pos[1]]);
      }
      let nextSegmentPos = [];
      for (let e = 0; e < nextSegmentLength; e++) {
        nextSegmentPos.push(finalPixel[1] + 1 * (nextVector[pos[1]] * e));
      }
      for (let x = 0; x < nextSegmentPos.length; x++) {
        if (segmentPos.includes(nextSegmentPos[x])) {
          equal = true;
          // if (posOrNegDistanceChange == 1) {
          //   currentSegmentLength++;
          // } else {
          //   currentSegmentLength--;
          // }
          // w = 0;
          break firstLoop;
        }
      }
    }
  }
}

function loop() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  for (let i = 0; i < allTiles.length; i++) {
    allTiles[i].draw();
  }
  requestAnimationFrame(loop);
}

generateCorridors();
requestAnimationFrame(loop);
