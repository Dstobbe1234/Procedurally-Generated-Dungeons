const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;

let hallwaysPng = document.getElementById("hallwaysPng");

document.addEventListener("mousedown", mousedownListener);
document.addEventListener("mouseup", mouseupListener);
document.addEventListener("mousemove", mousemoveListener);
document.addEventListener("keydown", keydownListener);

let playerDisplacement = [0, 0];

function keydownListener(event) {
  if (event.key === "w") {
    playerDisplacement[1] += 20;
  } else if (event.key === "s") {
    playerDisplacement[1] -= 20;
  } else if (event.key === "a") {
    playerDisplacement[0] += 20;
  } else if (event.key === "d") {
    playerDisplacement[0] -= 20;
  }
}

const size = 435;
const lengthRange = [3, 10];
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
//test
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
  constructor(position, imageCoords) {
    this.position = position;
    this.imageCoords = imageCoords;
  }

  draw() {
    ctx.fillStyle = "black";
    ctx.drawImage(
      hallwaysPng,
      this.imageCoords[0],
      this.imageCoords[1],
      this.imageCoords[2],
      this.imageCoords[3],
      this.position[0] + playerDisplacement[0],
      this.position[1] + playerDisplacement[1],
      size,
      size
    );
  }
}

let vector, nextVector, currentSegmentLength, nextSegmentLength;
let currentPos = [500, 500];
let equal = false;
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

    let randomVectorIndex = randomInt(0, 2);
    if (i == 0) {
      currentSegmentLength = randomInt(lengthRange[0], lengthRange[1]);
      vector = [0, -1];
      nextVector = vectorArr[1][randomVectorIndex];
    } else if (i == segmentNum - 1) {
      nextVector = [0, 0];
      vector = [0, -1];
    } else {
      nextVector = vectorArr.splice(previousVectorIndex[0], 1)[0][
        randomVectorIndex
      ];
    }
    nextSegmentLength = randomInt(lengthRange[0], lengthRange[1]);

    if (vector[0] == 0) {
      //vertical
      fixCorridors(corridorTiles.horizontal, [1, 0], i);
      corridorTiles.vertical.push([]);
    } else {
      //horizontal
      fixCorridors(corridorTiles.vertical, [0, 1], i);
      corridorTiles.horizontal.push([]);
    }

    for (let m = 0; m < currentSegmentLength; m++) {
      currentPos[0] += size * vector[0];
      currentPos[1] += size * vector[1];
      let img = assignImages(m, currentSegmentLength);
      if (vector[0] === 0) {
        corridorTiles.vertical[corridorTiles.vertical.length - 1].push(
          new corridorTile([currentPos[0], currentPos[1]], img)
        );
      } else {
        corridorTiles.horizontal[corridorTiles.horizontal.length - 1].push(
          new corridorTile([currentPos[0], currentPos[1]], img)
        );
      }
    }
    previousVectorIndex = vector;
    vector = nextVector;
    currentSegmentLength = nextSegmentLength;
  }
  allTiles = corridorTiles.vertical
    .flat(1)
    .concat(corridorTiles.horizontal.flat(1));
  fixDuplicates();
}

function fixCorridors(segmentOrientation, pos, segmentIndex) {
  let posOrNeg = [-435, 435][randomInt(0, 2)];

  firstLoop: for (let w = 0; w < segmentOrientation.length; w++) {
    const segmentTile1 = segmentOrientation[w][0].position[pos[0]];
    //vector[pos[0]] is either 1 or -1
    const segmentLength = size * (vector[pos[0]] * currentSegmentLength);
    let finalPixel = [currentPos[pos[0]] + segmentLength, currentPos[pos[1]]];

    if (
      finalPixel[0] >= segmentTile1 - 435 &&
      finalPixel[0] <= segmentTile1 + 435
    ) {
      let segmentPos = [];

      if (segmentIndex !== segmentNum - 1) {
        for (let index = 0; index < segmentOrientation[w].length; index++) {
          segmentPos.push(segmentOrientation[w][index].position[pos[1]]);
        }
        let nextSegmentPos = [];
        for (let e = 0; e < nextSegmentLength; e++) {
          nextSegmentPos.push(finalPixel[1] + size * (nextVector[pos[1]] * e));
        }

        for (let x = 0; x < nextSegmentPos.length; x++) {
          if (segmentPos.includes(nextSegmentPos[x])) {
            equal = true;
            let diff = segmentTile1 - finalPixel[0];
            if (vector[pos[0]] > 0) {
              currentSegmentLength += diff;
            } else {
              currentSegmentLength -= diff;
            }
            finalPixel = [
              currentPos[pos[0]] + vector[pos[0]] * currentSegmentLength,
              currentPos[pos[1]],
            ];

            break firstLoop;
          }
        }
      } else {
        currentSegmentLength += posOrNeg;
        w = 0;
      }
    }
  }
}

function fixDuplicates() {
  let testArr = [];
  for (let i = 0; i < allTiles.length; i++) {
    testArr.push([allTiles[i].position[0], allTiles[i].position[1]]);
  }

  for (let i = 0; i < testArr.length; i++) {
    let duplicatesOfi = testArr.filter(
      (coord) =>
        coord[0] === testArr[i][0] &&
        coord[1] === testArr[i][1] &&
        testArr.indexOf(coord) !== i
    );
    if (duplicatesOfi.length !== 0) {
      testArr.splice(i, 1);
      allTiles.splice(i, 1);
    }
  }
}

function assignImages(index, length) {
  //horizontal hallway Img = 0, 0, 435, 435
  //vertical hallway Img = 0, 435, 435, 435
  //top left corner Img = 435, 0, 435, 435
  //top right corner Img = 870, 0, 435, 435
  //bottom left corner Img =  435, 435, 435, 435
  //bottom right corner Img = 435, 870, 435, 435
  if (index !== length - 1) {
    if (vector[0] === 0) {
      return [0, 434, 434, 434];
    } else {
      return [0, 0, 434, 434];
    }
  } else {
    if (
      (JSON.stringify(vector) === "[0,-1]" &&
        JSON.stringify(nextVector) === "[1,0]") ||
      (JSON.stringify(vector) === "[-1,0]" &&
        JSON.stringify(nextVector) === "[0,1]")
    ) {
      return [434, 0, 434, 434];
    } else if (
      (JSON.stringify(vector) === "[1,0]" &&
        JSON.stringify(nextVector) === "[0,1]") ||
      (JSON.stringify(vector) === "[0,-1]" &&
        JSON.stringify(nextVector) === "[-1,0]")
    ) {
      return [869, 0, 434, 434];
    } else if (
      (JSON.stringify(vector) === "[0,1]" &&
        JSON.stringify(nextVector) === "[1,0]") ||
      (JSON.stringify(vector) === "[-1,0]" &&
        JSON.stringify(nextVector) === "[0,-1]")
    ) {
      return [434, 434, 434, 434];
    } else if (
      (JSON.stringify(vector) === "[1,0]" &&
        JSON.stringify(nextVector) === "[0,-1]") ||
      (JSON.stringify(vector) === "[0,1]" &&
        JSON.stringify(nextVector) === "[-1,0]")
    ) {
      return [869, 434, 434, 434];
    } else if (JSON.stringify(nextVector) === "[0,0]") {
      return [0, 435, 435, 435];
    } else {
      console.log(JSON.stringify(vector), JSON.stringify(nextVector));
    }
  }
}

let left = true;
let right = false;

function playerAnim() {
  if (mouse.down) {
    const yDist = mouse.y - 520;
    const xDist = mouse.x - 520;
    const atan2 = (Math.atan2(yDist, xDist) * 180) / Math.PI;
    const mouseAngle = (atan2 + 450) % 360;
  }
}

function loop() {
  ctx.fillStyle = "white";
  ctx.fillStyle = "rgb(46, 23, 39)";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  for (let i = 0; i < allTiles.length; i++) {
    allTiles[i].draw();
  }
  playerAnim();
  requestAnimationFrame(loop);
}

generateCorridors();
requestAnimationFrame(loop);
