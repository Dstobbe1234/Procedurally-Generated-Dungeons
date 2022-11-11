const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;

const hallwaysPng = document.getElementById("hallwaysPng");
const itemsImg = document.getElementById("itemsPng");

document.addEventListener("mousedown", mousedownListener);
document.addEventListener("mouseup", mouseupListener);
document.addEventListener("mousemove", mousemoveListener);
document.addEventListener("keydown", keydownListener);

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

function keydownListener(event) {
  if (event.key === "w") {
    playerDisplacement[1] += 100;
  } else if (event.key === "s") {
    playerDisplacement[1] -= 100;
  } else if (event.key === "a") {
    playerDisplacement[0] += 100;
  } else if (event.key === "d") {
    playerDisplacement[0] -= 100;
  }
}

const size = 440;
const lengthRange = [3, 5];
const segmentNum = 21;
const dungeonNum = 10;
let playerDisplacement = [0, 0];
let frameCount = 0;
let corridorTiles = [];
let left = true;
let right = false;

let gradient = {
  x: cnv.width / 2,
  y: cnv.height / 2,
  r1: 0,
  r2: 100,
};
gradient.cr = gradient.r2 + randomInt(-5, 5);

let angle = {
  up: [Math.PI, 0],
  down: [0, Math.PI],
  left: [Math.PI / 2, -Math.PI / 2],
  right: [-Math.PI / 2, Math.PI / 2],
};

let mouse = {
  x: 0,
  y: 0,
  down: false,
};

let player = {
  x: 500,
  y: 500,
  w: 20,
  h: 40,
  vScale: 1,
  draw: function () {
    const weaponImg = document.getElementById("weaponsimg");
    const xDist = mouse.x - this.y;
    const yDist = mouse.y - this.y;
    const atan2 = Math.atan2(yDist, xDist);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(atan2);
    ctx.fillStyle = "blue";
    Math.abs(atan2) > Math.PI / 2 ? (this.vScale = -1) : (this.vScale = 1);
    ctx.scale(1, 1);
    ctx.drawImage(weaponImg, -32 / 2, -11 / 2, this.weaponFlip * 32, 11);
    ctx.restore();
  },
};
//ckhoiuh

class corridorTile {
  constructor(position, v, index, end) {
    this.position = position;
    this.v = v;
    this.index = index;
    this.end = end;
    this.torchFrame = 0;

    if (this.v == 0 || this.v == 1) {
      this.direction = "v";
    } else {
      this.direction = "h";
    }
    this.intersect = false;
  }

  corners() {
    if (this.index != corridorTiles.length - 1) {
      if (this.end) {
        const nextV = corridorTiles[this.index + 1].v;

        const topLeft = (this.v == 0 && nextV == 3) || (this.v == 2 && nextV == 1);
        const topRight = (this.v == 0 && nextV == 2) || (this.v == 3 && nextV == 1);
        const bottomLeft = (this.v == 1 && nextV == 3) || (this.v == 2 && nextV == 0);
        const bottomRight = (this.v == 1 && nextV == 2) || (this.v == 3 && nextV == 0);

        if (topLeft) {
          this.imageCoords = [440, 0, 440, 440];
        } else if (topRight) {
          this.imageCoords = [880, 0, 440, 440];
        } else if (bottomLeft) {
          this.imageCoords = [440, 440, 440, 440];
        } else if (bottomRight) {
          this.imageCoords = [880, 440, 440, 440];
        }
      } else {
        if (this.v == 0 || this.v == 1) {
          this.imageCoords = [0, 440, 440, 400];
        } else {
          this.imageCoords = [0, 0, 440, 440];
        }
      }
    } else {
      this.imageCoords = [0, 0, 0, 0];
    }
  }

  intersections() {
    let intersects = corridorTiles.filter((tile) => {
      if (
        tile.position[0] == this.position[0] &&
        tile.position[1] == this.position[1] &&
        tile.index != this.index
      )
        return true;
    });

    if (intersects.length > 0) {
      this.intersect = true;
      intersects.forEach((tile) => {
        let corridorTilesStr = corridorTiles.map((x) => JSON.stringify(x));
        corridorTiles.splice(corridorTilesStr.indexOf(JSON.stringify(tile)), 1);
      });
      let tileCoordStr = corridorTiles.map((x) => JSON.stringify(x.position));

      if (
        tileCoordStr.includes(`[${this.position[0] + size},${this.position[1]}]`) &&
        tileCoordStr.includes(`[${this.position[0] - size},${this.position[1]}]`) &&
        tileCoordStr.includes(`[${this.position[0]},${this.position[1] + size}]`) &&
        tileCoordStr.includes(`[${this.position[0]},${this.position[1] - size}]`)
      ) {
        this.imageCoords = [0, 880, 440, 440];
      } else if (
        tileCoordStr.includes(`[${this.position[0] + size},${this.position[1]}]`) &&
        tileCoordStr.includes(`[${this.position[0] - size},${this.position[1]}]`) &&
        tileCoordStr.includes(`[${this.position[0]},${this.position[1] + size}]`)
      ) {
        this.imageCoords = [880, 880, 440, 440];
      } else if (
        tileCoordStr.includes(`[${this.position[0] + size},${this.position[1]}]`) &&
        tileCoordStr.includes(`[${this.position[0] - size},${this.position[1]}]`) &&
        tileCoordStr.includes(`[${this.position[0]},${this.position[1] - size}]`)
      ) {
        this.imageCoords = [440, 1320, 440, 440];
      } else if (
        tileCoordStr.includes(`[${this.position[0] + size},${this.position[1]}]`) &&
        tileCoordStr.includes(`[${this.position[0]},${this.position[1] + size}]`) &&
        tileCoordStr.includes(`[${this.position[0]},${this.position[1] - size}]`)
      ) {
        this.imageCoords = [440, 880, 440, 440];
      } else if (
        tileCoordStr.includes(`[${this.position[0] - size},${this.position[1]}]`) &&
        tileCoordStr.includes(`[${this.position[0]},${this.position[1] + size}]`) &&
        tileCoordStr.includes(`[${this.position[0]},${this.position[1] - size}]`)
      ) {
        this.imageCoords = [880, 1320, 440, 440];
      } else {
        this.intersect = false;
      }
    }
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
    this.loadTorches();
  }
  loadTorches() {
    if (!this.end && !this.intersect) {
      if (this.v == 0 || this.v == 1) {
        ctx.drawImage(
          itemsImg,
          16 * this.torchFrame,
          0,
          16,
          26,
          this.position[0] + playerDisplacement[0] + 60,
          this.position[1] + playerDisplacement[1] + 220,
          16,
          26
        );
      } else {
      }
      if (frameCount % 10 == 0) {
        if (this.torchFrame < 3) {
          this.torchFrame++;
        } else {
          this.torchFrame = 0;
        }
      }
    }
  }
}

function generateCorridors() {
  const vectorArr = [
    [
      [0, -1],
      [0, 1],
    ],
    [
      [-1, 0],
      [1, 0],
    ],
  ];
  let vector = [0, -1];
  let nextVectorIndex = 0;
  let nextVector = vectorArr[1][randomInt(0, 2)];
  let currentSegmentLength = randomInt(lengthRange[0], lengthRange[1]);
  let currentPos = [500 - size / 2, cnv.height];
  let nextSegmentLength;

  for (let i = 0; i < segmentNum; i++) {
    if (i == segmentNum - 1) {
      currentSegmentLength = randomInt(lengthRange[0], lengthRange[1]);
      nextVector = [0, 0];
      vector = [0, -1];
    } else {
      nextVectorIndex = 1 - nextVectorIndex;
      nextVector = vectorArr[nextVectorIndex][randomInt(0, 2)];
    }

    let vectorId = vectorArr
      .flat()
      .map((x) => x.toString())
      .indexOf(vector.toString());

    nextSegmentLength = randomInt(lengthRange[0], lengthRange[1]);

    for (let m = 0; m < currentSegmentLength * 2; m++) {
      currentPos[0] += size * vector[0];
      currentPos[1] += size * vector[1];
      const end = m == currentSegmentLength * 2 - 1 ? true : false;

      const tile = new corridorTile(
        [currentPos[0], currentPos[1]],
        vectorId,
        corridorTiles.length,
        end
      );
      corridorTiles.push(tile);
    }

    vector = nextVector;
    currentSegmentLength = nextSegmentLength;
  }

  corridorTiles.forEach((tile) => {
    tile.corners();
  });
  corridorTiles.forEach((tile) => {
    tile.intersections();
  });
}

function drawGradient(angles) {
  if (frameCount % 5 == 0) gradient.cr = gradient.r2 + randomInt(-5, 5);

  const gradientStyle = ctx.createRadialGradient(
    gradient.x,
    gradient.y,
    gradient.r1,
    gradient.x,
    gradient.y,
    gradient.cr
  );

  gradientStyle.addColorStop(0, "rgba(255, 130, 0, 0.5)");
  gradientStyle.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradientStyle;

  ctx.arc(gradient.x, gradient.y, gradient.r2, angles[0], angles[1]);
  ctx.fill();
}

function loop() {
  ctx.fillStyle = "rgb(18, 0, 10)";
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  for (let i = 0; i < corridorTiles.length; i++) {
    corridorTiles[i].draw();
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  frameCount++;
  drawGradient(angle.up);
  player.draw();

  requestAnimationFrame(loop);
}

generateCorridors();
requestAnimationFrame(loop);
