function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let player = {
  angle: 0,
  draw: function () {
    ctx.fillStyle = "purple";
    playerAnim();
  },
};

let playerDisplacement = [0, 0];

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
  for (let i = 0; i <= 20; i++) {
    let randomSegmentLength = randomInt(10, 50);
    let vector;
    if (i !== 0 && i !== 20) {
      vectorArr.splice(previousVectorIndex[0], 1);
      let randomVectorIndex = randomInt(0, 2);
      vector = vectorArr[0][randomVectorIndex];
    } else {
      vector = [0, -1];
    }
    for (let m = 0; m < randomSegmentLength; m++) {
      x += 2 * vector[0];
      y += 2 * vector[1];
      corridorTileArr.push(new corridorTile(x, y, 2, 2));
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
    requestAnimationFrame(loop);
  }
}

generateCorridors();
