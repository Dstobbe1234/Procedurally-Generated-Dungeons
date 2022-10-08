const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;

document.addEventListener("mousedown", mousedownListener);
document.addEventListener("mouseup", mouseupListener);
document.addEventListener("mousemove", mousemoveListener);

let size = 1;

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
  constructor(position) {
    this.position = position;
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(this.position[0], this.position[1], size, size);
    // console.log(this.position[1]);
  }
}

let vector, nextVector, randomSegmentLength, nextSegmentLength;
let currentPos = [500, 500];

function generateCorridors() {
  let previousVectorIndex;
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
      fixCorridors(corridorTiles.horizontal, [1, 0]);
      corridorTiles.vertical.push([]);
    } else {
      //horizontal
      fixCorridors(corridorTiles.vertical, [0, 1]);
      corridorTiles.horizontal.push([]);
    }

    for (let m = 0; m <= randomSegmentLength; m++) {
      currentPos[0] += 1 * vector[0];
      currentPos[1] += 1 * vector[1];
      if (vector[0] === 0) {
        corridorTiles.vertical[corridorTiles.vertical.length - 1].push(
          new corridorTile(currentPos)
        );
      } else {
        corridorTiles.horizontal[corridorTiles.horizontal.length - 1].push(
          new corridorTile(currentPos)
        );
      }
    }
    previousVectorIndex = vector;
    vector = nextVector;
    randomSegmentLength = nextSegmentLength;
  }
}

function fixCorridors(segmentOrientation, pos) {
  let posOrNegDistanceChange = randomInt(0, 2);
  let finalPixel = [currentPos[pos[0]] + 1 * (vector[pos[0]] * randomSegmentLength), currentPos[1]];
  for (let w = 0; w < segmentOrientation.length; w++) {
    if (
      // If the new hallway segment that is being made is horizontal:
      // checks to see if the x position of the last pixel of the current segment is in range (in between +2 and -2) of any vertical hallway segment x position
      // Does opposite for vertical
      finalPixel[0] > segmentOrientation[w][0].position[pos[0]] - 2 &&
      finalPixel[0] < segmentOrientation[w][0].position[pos[0]] + 2
    ) {
      let segmentPos = [];
      for (let index = 0; index < segmentOrientation[w].length; index++) {
        segmentPos.push(segmentOrientation[w][index].position[pos[1]]);
      }

      let nextSegmentPos = [];
      for (let e = 0; e < nextSegmentLength; e++) {
        nextSegmentPos.push(finalPixel[1] + 1 * (nextVector[pos[1]] * e));
      }

      for (let x = 0; x < segmentPos; x++) {
        if (nextSegmentPos.includes(segmentPos[x])) {
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
  //       for (let p = 0; p < nextSegmentLength; p++) {
  //         if (
  //           finalPixel[1] + 1 * (nextVector[pos[1]] * p) ===
  //           segmentOrientation[w].position[pos[1]]
  //         ) {
  //           if (posOrNegDistanceChange == 1) {
  //             randomSegmentLength++;
  //           } else {
  //             randomSegmentLength--;
  //           }
  //           w = 0;
  //           break;
  //         }
  //       }
  //     }
  //   }
}

function loop() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  for (let i = 0; i < corridorTiles.vertical.length; i++) {
    for (let m = 0; m < corridorTiles.vertical[i].length; m++) {
      corridorTiles.vertical[i][m].draw();
    }
  }
  for (let f = 0; f < corridorTiles.horizontal.length; f++) {
    for (let b = 0; b < corridorTiles.horizontal[f].length; b++) {
      corridorTiles.horizontal[f][b].draw();
    }
  }
  requestAnimationFrame(loop);
}

generateCorridors();
requestAnimationFrame(loop);
