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

let playerDisplacement = [0, 0];

// Random walk - procedural dungeon generation

corridorTileArr = [];

class corridorTile {
  constructor(x, y, w, h, v) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.v = v;
  }
  draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(
      this.x + playerDisplacement[0],
      this.y + playerDisplacement[1],
      this.w,
      this.h
    );
  }
}

function generateCorridors() {
  let previousVectorIndex;
  let x = 500;
  let y = 500;
  for (let i = 1; i <= 21; i++) {
    // await new Promise((resolve) => {
    //   setTimeout(() => {
    //     console.log(i);
    //     resolve();
    //   }, 500);
    // });
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
    let randomSegmentLength = randomInt(10, 50);
    let vector;
    if (i !== 1 && i !== 21) {
      vectorArr.splice(previousVectorIndex[0], 1);
      let randomVectorIndex = randomInt(0, 2);
      console.log(randomVectorIndex);
      console.log(vectorArr);
      vector = vectorArr[0][randomVectorIndex];
    } else {
      console.log("E");
      vector = [0, -1];
    }

    let distanceChanged = 0;
    let posOrNegDistanceChange = randomInt(0, 2);
    console.log(randomSegmentLength);
    if (
      JSON.stringify(vector) === JSON.stringify([0, 1]) ||
      JSON.stringify(vector) === JSON.stringify([0, -1])
    ) {
      for (let w = 0; w < corridorTileArr.length; w++) {
        if (
          JSON.stringify(corridorTileArr[w].v) === JSON.stringify([1, 0]) ||
          JSON.stringify(corridorTileArr[w].v) === JSON.stringify([-1, 0])
        ) {
          if (
            (y + 1 * vector[1]) * randomSegmentLength >
              corridorTileArr[w].y - 2 &&
            (y + 1 * vector[1]) * randomSegmentLength <
              corridorTileArr[w].y + 2 &&
            x === corridorTileArr[w].x
          ) {
            console.log("working");
            if (posOrNegDistanceChange == 1) {
              distanceChanged++;
              randomSegmentLength++;
            } else {
              distanceChanged--;
              randomSegmentLength--;
            }
            w = 0;
          }
        }
      }
    } else {
      for (let w = 0; w < corridorTileArr.length; w++) {
        if (
          JSON.stringify(corridorTileArr[w].v) === JSON.stringify([0, 1]) ||
          JSON.stringify(corridorTileArr[w].v) === JSON.stringify([0, -1])
        ) {
          if (
            (x + 1 * vector[1]) * randomSegmentLength >
              corridorTileArr[w].x - 2 &&
            (x + 1 * vector[1]) * randomSegmentLength <
              corridorTileArr[w].x + 2 &&
            y === corridorTileArr[w].y
          ) {
            console.log("working");
            if (posOrNegDistanceChange == 1) {
              distanceChanged++;
              randomSegmentLength++;
            } else {
              distanceChanged--;
              randomSegmentLength--;
            }
            w = 0;
          }
        }
      }
    }
    console.log(randomSegmentLength);
    for (let m = 0; m <= randomSegmentLength; m++) {
      x += 1 * vector[0];
      y += 1 * vector[1];
      corridorTileArr.push(new corridorTile(x, y, 1, 1, vector));
      previousVectorIndex = vector;
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
    requestAnimationFrame(loop);
  }
}

generateCorridors();
