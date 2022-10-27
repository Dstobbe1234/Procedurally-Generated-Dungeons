const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;

let hallwaysPng = document.getElementById("hallwaysPng");

// 440 x 440
//test

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

const size = 440;
const lengthRange = [3, 5];
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
  constructor(position, imageCoords, v) {
    this.position = position;
    this.imageCoords = imageCoords;
    this.corner = false;
    this.v = v
  }

  draw() {
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
      currentSegmentLength = randomInt(lengthRange[0], lengthRange[1]);
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
    for (let m = 0; m < currentSegmentLength * 2; m++) {
        currentPos[0] = currentPos[0] + size * vector[0];
        currentPos[1] = currentPos[1] + size * vector[1];
      let img = assignImages(m, currentSegmentLength);
      if (vector[0] === 0) {
        corridorTiles.vertical[corridorTiles.vertical.length - 1].push(
          new corridorTile([currentPos[0], currentPos[1]], img, vector)
        );
        if(m == currentSegmentLength * 2 - 1) {
            corridorTiles.vertical[corridorTiles.vertical].corner = true
        }
      } else {
        corridorTiles.horizontal[corridorTiles.horizontal.length - 1].push(
          new corridorTile([currentPos[0], currentPos[1]], img, vector)
        );
      }
      if(m == currentSegmentLength * 2 - 1) {
        corridorTiles.horizontal[corridorTiles.horizontal].corner = true
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
  corners()
}

function fixCorridors(segmentOrientation, pos, segmentIndex) {
  // let posOrNeg = [-1, 1][randomInt(0, 2)];
  // firstLoop: for (let w = 0; w < segmentOrientation.length; w++) {
  //   const segmentTile1 = segmentOrientation[w][0].position[pos[0]];
  //   //vector[pos[0]] is either 1 or -1
  //   const segmentLength =
  //     size * (vector[pos[0]] * currentSegmentLength);
  //   let finalPixel = [currentPos[pos[0]] + segmentLength, currentPos[pos[1]]];

  //   if (
  //     finalPixel[0] >= segmentTile1 - 440 &&
  //     finalPixel[0] <= segmentTile1 + 440
  //   ) {
  //     let segmentPos = [];

  //     if (segmentIndex !== segmentNum - 1) {
  //       for (let index = 0; index < segmentOrientation[w].length; index++) {
  //         segmentPos.push(segmentOrientation[w][index].position[pos[1]]);
  //       }
  //       let nextSegmentPos = [];
  //       for (let e = 0; e < nextSegmentLength; e++) {
  //         nextSegmentPos.push(
  //           finalPixel[1] + size * (nextVector[pos[1]] * e)
  //         );
  //       }

  //       for (let x = 0; x < nextSegmentPos.length; x++) {
  //         if (segmentPos.includes(nextSegmentPos[x])) {
  //           equal = true;
  //           let diff = segmentTile1 - finalPixel[0];
  //           console.log(diff)
  //           console.log(diff / size)
  //           if (vector[pos[0]] > 0) {
  //             currentSegmentLength += (diff / size);
  //           } else {
  //             currentSegmentLength -= (diff / size);
  //           }

  //           break firstLoop;
  //         }
  //       }
  //     } else {
  //       currentSegmentLength += posOrNeg;
  //       w = 0;
  //     }
  //   }
  // }
}

function corners() {
  console.log("hui")
  for(let i = 0; i < allTiles.length; i++) {
    console.log("sfg")
    if(allTiles[i].corner) {
      console.log("corner")
      if(JSON.stringify(allTiles[i].v) === '[0,-1]' && JSON.stringify(allTiles[i + 1].v) === '[1,0]') {
        console.log("EEEEE")
        allTiles[i].imageCoords = [440, 0, 440, 440]
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
  let tileImg;
  // if (index !== length - 1) {
  if (vector[0] === 0) {
    tileImg = [0, 440, 440, 440];
  } else {
    tileImg = [0, 0, 440, 440];
  }
 // }
  // } else {
  //   if (
  //     (JSON.stringify(vector) === "[0,-1]" &&
  //       JSON.stringify(nextVector) === "[1,0]") ||
  //     (JSON.stringify(vector) === "[-1,0]" &&
  //       JSON.stringify(nextVector) === "[0,1]")
  //   ) {
  //     tileImg = [440, 0, 440, 440];
  //   } else if (
  //     (JSON.stringify(vector) === "[1,0]" &&
  //       JSON.stringify(nextVector) === "[0,1]") ||
  //     (JSON.stringify(vector) === "[0,-1]" &&
  //       JSON.stringify(nextVector) === "[-1,0]")
  //   ) {
  //     tileImg = [880, 0, 440, 440];
  //   } else if (
  //     (JSON.stringify(vector) === "[0,1]" &&
  //       JSON.stringify(nextVector) === "[1,0]") ||
  //     (JSON.stringify(vector) === "[-1,0]" &&
  //       JSON.stringify(nextVector) === "[0,-1]")
  //   ) {
  //     tileImg = [440, 440, 440, 440];
  //   } else if (
  //     (JSON.stringify(vector) === "[1,0]" &&
  //       JSON.stringify(nextVector) === "[0,-1]") ||
  //     (JSON.stringify(vector) === "[0,1]" &&
  //       JSON.stringify(nextVector) === "[-1,0]")
  //   ) {
  //     tileImg = [880, 440, 440, 440];
  //   } else if (JSON.stringify(nextVector) === "[0,0]") {
  //     tileImg = [0, 440, 440, 440];
  //   }
  // }
  // return tileImg;
  return tileImg
}

function loadTorches() {
  let itemsImg = document.getElementById("itemsPng");
  allTiles.forEach((tile) => {
    if (JSON.stringify(tile.imageCoords) === "[0,434,434,434]") {
      ctx.drawImage(
        itemsImg,
        0,
        0,
        16,
        26,
        tile.position[0] + 30 + playerDisplacement[0],
        tile.position[1] + size / 2 + playerDisplacement[1],
        16,
        26
      );

      ctx.drawImage(
        itemsImg,
        0,
        26,
        16,
        26,
        tile.position[0] + 348 + playerDisplacement[0],
        tile.position[1] + size / 2 + playerDisplacement[1],
        16,
        26
      );
    }
  });
}

const dungeonNum = 10;

function placeLadders() {
  //arbitrary numbers for now
  const ladderImg = document.getElementById("ladderImg");
  let availableTiles = allTiles;
  let ladderCoords = [];
  for (let i = 0; i < dungeonNum; i++) {
    let randLadderIndex = randomInt(0, allTiles.length);
    let randomLadderTile = availableTiles[randLadderIndex];
    ladderTiles.push([randomLadderTile.x - 200, randomLadderTile.y - 200]);
    availableTiles.splice(randLadderIndex);
  }
}

function flicker() {
  // const bezier = { x: 100, y: 100, r: 50 };
  // const points = getPoints();
  // let drawPoints = getPoints();
  // function getPoints() {
  //   return [
  //     { x: bezier.x, y: bezier.y - bezier.r },
  //     {
  //       x: bezier.x + bezier.r * 0.55339631805,
  //       y: bezier.y - bezier.r * 0.99868073281,
  //     },
  //     {
  //       x: bezier.x + bezier.r * 0.99868073281,
  //       y: bezier.y - bezier.r * 0.55339631805,
  //     },
  //     { x: bezier.x + bezier.r, y: bezier.y },
  //     {
  //       x: bezier.x + bezier.r * 0.99868073281,
  //       y: bezier.y + bezier.r * 0.55339631805,
  //     },
  //     {
  //       x: bezier.x + bezier.r * 0.55339631805,
  //       y: bezier.y + bezier.r * 0.99868073281,
  //     },
  //     { x: bezier.x, y: bezier.y + bezier.r },
  //     {
  //       x: bezier.x - bezier.r * 0.55339631805,
  //       y: bezier.y + bezier.r * 0.99868073281,
  //     },
  //     {
  //       x: bezier.x - bezier.r * 0.99868073281,
  //       y: bezier.y + bezier.r * 0.55339631805,
  //     },
  //     { x: bezier.x - bezier.r, y: bezier.y },
  //     {
  //       x: bezier.x - bezier.r * 0.99868073281,
  //       y: bezier.y - bezier.r * 0.55339631805,
  //     },
  //     {
  //       x: bezier.x - bezier.r * 0.55339631805,
  //       y: bezier.y - bezier.r * 0.99868073281,
  //     },
  //   ];
  // }
  // function moveBezierPoints() {
  //   drawPoints.forEach((point, index) => {
  //     point.x = points[index].x + getRandVector();
  //     point.y = points[index].y + getRandVector();
  //   });
  // }
  // function drawBezierCircle() {
  //   ctx.beginPath();
  //   ctx.moveTo(drawPoints[0].x, drawPoints[0].y);
  //   ctx.bezierCurveTo(
  //     drawPoints[1].x,
  //     drawPoints[1].y,
  //     drawPoints[2].x,
  //     drawPoints[2].y,
  //     drawPoints[3].x,
  //     drawPoints[3].y
  //   );
  //   ctx.bezierCurveTo(
  //     drawPoints[4].x,
  //     drawPoints[4].y,
  //     drawPoints[5].x,
  //     drawPoints[5].y,
  //     drawPoints[6].x,
  //     drawPoints[6].y
  //   );
  //   ctx.bezierCurveTo(
  //     drawPoints[7].x,
  //     drawPoints[7].y,
  //     drawPoints[8].x,
  //     drawPoints[8].y,
  //     drawPoints[9].x,
  //     drawPoints[9].y
  //   );
  //   ctx.bezierCurveTo(
  //     drawPoints[10].x,
  //     drawPoints[10].y,
  //     drawPoints[11].x,
  //     drawPoints[11].y,
  //     drawPoints[0].x,
  //     drawPoints[0].y
  //   );
  //   ctx.fill();
  // }
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
  ctx.fillStyle = "rgb(18, 0, 10)";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  for (let i = 0; i < allTiles.length; i++) {
    allTiles[i].draw();
  }

  playerAnim();
  flicker();
  requestAnimationFrame(loop);
}

generateCorridors();
requestAnimationFrame(loop);
