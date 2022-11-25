const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 900;
cnv.height = 900;

const hallwaysPng = document.getElementById("hallwaysPng");
const itemsImg = document.getElementById("itemsPng");
const ladderImg = document.getElementById("ladderImg");

document.addEventListener("mousedown", mousedownListener);
document.addEventListener("mouseup", mouseupListener);
document.addEventListener("mousemove", mousemoveListener);
document.addEventListener("keydown", keydownListener);
document.addEventListener("keyup", keyupListener);

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

let input = {};
function keydownListener(event) {
  input[event.key] = true;
}

function keyupListener(event) {
  input[event.key] = false;
}

const size = 440;
const lengthRange = [2, 4];
const segmentNum = 21;
const dungeonNum = 10;
const start = [500, 500];
let playerDisplacement = [0, 0];
let frameCount = 0;
let corridorTiles = [];
let enemies = [];
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

const pWidth = 20;
const pHeight = 40;
let atan2 
let x = this.x + 32 * Math.cos(atan2)
let y = this.y + 11 * Math.sin(atan2)
let imgX = 0
let bulletFrame = 0
let player = {
  x: cnv.width / 2 - pWidth / 2,
  y: cnv.height / 2 - pHeight / 2,
  w: pWidth,
  h: pHeight,
  speed: 8,
  vScale: 1,
  draw: function () {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    const weaponImg = document.getElementById("weaponsimg");
    const xDist = mouse.x - this.y;
    const yDist = mouse.y - this.y;
    atan2 = Math.atan2(yDist, xDist);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(atan2);
    Math.abs(atan2) > Math.PI / 2 ? (this.vScale = -1) : (this.vScale = 1);
    ctx.scale(1, this.vScale);
    ctx.drawImage(weaponImg, -32 / 2, -11 / 2, 32, 11);
    ctx.restore();
  },
  move: function () {
    if (input.w) {
      playerDisplacement[1] += this.speed;
    }
    if (input.s) {
      playerDisplacement[1] -= this.speed;
    }
    if (input.a) {
      playerDisplacement[0] += this.speed;
    }
    if (input.d) {
      playerDisplacement[0] -= this.speed;
    }
  },
  shoot: function () {
    // if(mouse.down) {
    //   if(bulletFrame % 10 == 0) {
    //     if(imgX !== 84) {
    //       imgX += 28
    //     } else {
    //       imgX = 0
    //     }
    //   }
    //   const bulletImg = document.getElementById("bullet")
    //   ctx.save();
    //   ctx.translate(this.x, this.y);
    //   ctx.rotate(atan2);
    //   Math.abs(atan2) > Math.PI / 2 ? (this.vScale = -1) : (this.vScale = 1);
    //   ctx.scale(1, this.vScale);
    //   ctx.drawImage(bulletImg, imgX, 0, 28, 14, x, y, 28, 14);
    //   ctx.restore();
    //   x += 0.5 * Math.cos(atan2)
    //   y += 0.5 * Math.sin(atan2)
    //   bulletFrame ++
    //   console.log("pew")
    // } else {
    //   x = this.x + 32 * Math.cos(atan2)
    //   y = this.y + 11 * Math.sin(atan2)
    //   bulletFrame = 0
    // }
  }
};

class enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x + playerDisplacement[0], this.y + playerDisplacement[1], 50, 50);
  }
}

class corridorTile {
  constructor(position, v, index, end) {
    this.position = position;
    this.v = v;
    this.index = index;
    this.end = end;
    this.torchFrame = 0;
    this.color = "green";

    if (this.v == 0 || this.v == 1) {
      this.direction = "v";
    } else {
      this.direction = "h";
    }
    this.intersect = false;
  }

  corners() {
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
        this.imageCoords = [0, 440, 440, 440];
      } else {
        this.imageCoords = [0, 0, 440, 440];
      }
    }
  }

  intersections() {
    let intersects = corridorTiles.filter((tile) => {
      if (tile.position[0] == this.position[0] && tile.position[1] == this.position[1] && tile.index != this.index) return true;
    });

    if (intersects.length > 0) {
      this.intersect = true;
      intersects.forEach((tile) => {
        let corridorTilesStr = corridorTiles.map((x) => JSON.stringify(x));
        corridorTiles.splice(corridorTilesStr.indexOf(JSON.stringify(tile)), 1);
      });
      let tileCoordStr = corridorTiles.map((x) => JSON.stringify(x.position));

      const top = tileCoordStr.includes(`[${this.position[0]},${this.position[1] - size}]`);
      const bottom = tileCoordStr.includes(`[${this.position[0]},${this.position[1] + size}]`);
      const left = tileCoordStr.includes(`[${this.position[0] - size},${this.position[1]}]`);
      const right = tileCoordStr.includes(`[${this.position[0] + size},${this.position[1]}]`);

      if (top && bottom && left && right) {
        this.imageCoords = [0, 880, 440, 440];
      } else if (right && left && bottom) {
        this.imageCoords = [880, 880, 440, 440];
      } else if (right && left && top) {
        this.imageCoords = [440, 1320, 440, 440];
      } else if (right && bottom && top) {
        this.imageCoords = [440, 880, 440, 440];
      } else if (left && bottom && top) {
        this.imageCoords = [880, 1320, 440, 440];
      } else {
        this.intersect = false;
      }
    }
  }

  draw() {
    if (this.imageCoords !== undefined) {
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
    } else {
      this.color = "yellow";
    }
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.position[0] + playerDisplacement[0], this.position[1] + playerDisplacement[1], size, size);
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
  let currentSegmentLength;
  let currentPos = [start[0], start[1]];
  let nextSegmentLength;

  for (let i = 0; i < segmentNum; i++) {
    if (i == 0) {
      currentSegmentLength = 5;
    }
    if (i == segmentNum - 1) {
      vector = [0, -1];
    } else {
      nextVectorIndex = 1 - nextVectorIndex;
      nextVector = vectorArr[nextVectorIndex][randomInt(0, 2)];
    }

    let vectorId = vectorArr
      .flat()
      .map((x) => x.toString())
      .indexOf(vector.toString());

    nextSegmentLength = randomInt(lengthRange[0], lengthRange[1]) * 2;
    //segment length can either be 4 or 6

    for (let m = 0; m < currentSegmentLength; m++) {
      if (m > 0 || i > 0) {
        currentPos[0] += size * vector[0];
        currentPos[1] += size * vector[1];
      }

      const end = m == currentSegmentLength - 1 && i != segmentNum - 1 ? true : false;

      let fixStart = fixHallways(currentPos[0], currentPos[1], i, m);
      if (fixStart == 1) {
        corridorTiles[corridorTiles.length - 1].end = true;
        currentPos[0] -= size * vector[0];
        currentPos[1] -= size * vector[1];
        break;
      } else if (fixStart == 2) {
        i--;
        if (vector[0] == 0) {
          nextVector = [vector[0], -vector[1]];
        } else {
          nextVector = [-vector[0], vector[1]];
        }
        currentPos[0] -= size * vector[0];
        currentPos[1] -= size * vector[1];
        nextVectorIndex = 1 - nextVectorIndex;
        break;
      }

      const tile = new corridorTile([currentPos[0], currentPos[1]], vectorId, corridorTiles.length, end);
      corridorTiles.push(tile);

      if (i == segmentNum - 1 && m == currentSegmentLength - 1) {
        currentSegmentLength += fixEnd(currentPos[0], currentPos[1], currentSegmentLength);
      }
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

function fixHallways(x, y, i, m) {
  if (i == 0) {
    return 0;
  }
  const inRangeX = (x == start[0] + 3 * size || x == start[0] - 3 * size) && y <= start[1] + 3 * size && y >= start[1] - 3 * size ? true : false;
  const inRangeY = (y == start[1] + 3 * size || y == start[1] - 3 * size) && x <= start[0] + 3 * size && x >= start[0] - 3 * size ? true : false;
  if (inRangeX || inRangeY) {
    if (m > 0) {
      return 1;
    } else {
      return 2;
    }
  } else {
    return 0;
  }
}

function fixEnd(x, y, lastLength) {
  let yDif = 0;
  for (let i = 0; i < corridorTiles.length - lastLength; i++) {
    const tileX = corridorTiles[i].position[0];
    const tileY = corridorTiles[i].position[1];
    const inRangeX = tileX >= x - 3 * size && tileX <= x + 3 * size ? true : false;
    const inRangeY = tileY >= y - 3 * size && tileY <= y + 3 * size ? true : false;
    if (inRangeX && inRangeY) {
      const currentYDif = (y + 4 * size - tileY) / size;
      if (currentYDif > yDif) {
        yDif = currentYDif;
        console.log(yDif);
      }
    }
  }
  return yDif;
}

function loadEnemies() {
  let enemyNum = 5;
  let enemyCoords = corridorTiles.map((tile) => [tile.position[0], tile.position[1]]);
  for (let i = 0; i < enemyNum; i++) {
    let randomIndex = randomInt(0, enemyCoords.length);
    let randomCoord = enemyCoords[randomIndex];
    enemies.push(new enemy(randomCoord[0] + size / 2, randomCoord[1] + size / 2));
    enemyCoords.splice(randomIndex, 1);
  }
}

function drawGradient(angles) {
  if (frameCount % 5 == 0) gradient.cr = gradient.r2 + randomInt(-5, 5);

  const gradientStyle = ctx.createRadialGradient(gradient.x, gradient.y, gradient.r1, gradient.x, gradient.y, gradient.cr);

  gradientStyle.addColorStop(0, "rgba(255, 130, 0, 0.3)");
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

  // ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  // ctx.fillRect(0, 0, cnv.width, cnv.height);

  // drawGradient(angle.up);
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].draw();
  }

  // for (let y = -size; y < cnv.height + size; y += size) {
  //   for (let x = -size; x < cnv.width + size; x += size) {
  //     ctx.strokeStyle = "rgb(90, 90, 90)";
  //     ctx.strokeRect(x + (playerDisplacement[0] % size), y + (playerDisplacement[1] % size), size, size);
  //   }
  // }
  // ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
  // ctx.fillRect(start[0] - 3 * size + playerDisplacement[0], start[1] - 3 * size + playerDisplacement[1], 7 * size, 7 * size);
  // ctx.fillRect(
  //   corridorTiles[corridorTiles.length - 1].position[0] - 3 * size + playerDisplacement[0],
  //   corridorTiles[corridorTiles.length - 1].position[1] - 3 * size + playerDisplacement[1],
  //   7 * size,
  //   7 * size
  // );

  ctx.strokeStyle = "orange";
  ctx.strokeRect(500 + playerDisplacement[0], 500 + playerDisplacement[1], size, size);

  ctx.strokeStyle = "red";
  ctx.strokeRect(
    corridorTiles[corridorTiles.length - 1].position[0] + playerDisplacement[0],
    corridorTiles[corridorTiles.length - 1].position[1] + playerDisplacement[1],
    size,
    size
  );

  player.draw();

  player.move();
  frameCount++;

  player.shoot()
  requestAnimationFrame(loop);
}

generateCorridors();
// loadEnemies();
requestAnimationFrame(loop);
