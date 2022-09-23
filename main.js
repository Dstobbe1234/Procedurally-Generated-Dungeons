const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Random walk - procedural dungeon generation

let dead = false
corridorTileArr = []

class corridorTile {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    fillRect() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}


function proceduralCorridors() {
    let vectorArr = [[[0, -1], [0, 1]], [[-1, 0], [1, 0]]];
    let previousVectorIndex = [0, 0]
    let x = 500;
    let y = 500;
    let r = 0
    for(let i = 0; i < 20; i++) {
        vectorArr.splice(previousVectorIndex[0], 1)
        let randomSegmentLength = randomInt(50, 100);
        let randomVectorIndex = randomInt(0, 2);
        let vector = vectorArr[0][randomVectorIndex];
        for(let m = 0; m < randomSegmentLength; m++) {
            x += (2 * vector[0]);
            y += (2 * vector[1]);
            corridorTileArr.push(new corridorTile(x, y, 2, 2))
        }
        console.log(vectorArr)
        console.log(randomVectorIndex)
        console.log(vector);
        r += 100
        console.log(vector[0], vector[1])
        vectorArr = [[[0, -1], [0, 1]], [[-1, 0], [1, 0]]];
        for(let p = 0; p < vectorArr.length; p++) {
            for(let l = 0; l < vectorArr[p].length; l++) {
                if(vectorArr[p][l][0] === vector[0] && vectorArr[p][l][1] === vector[1]) {
                    previousVectorIndex = [p, l];
                    break;
                }
            }
        }
        console.log(previousVectorIndex)

    }
    for(let i = 0; i < corridorTileArr.length; i++) {
        displayTiles(corridorTileArr[i])
    }
}

function displayTiles(tile) {
    tile.fillRect()
}



proceduralCorridors()