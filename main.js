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
        if(this.x === 500 && this.y === 500) {
            ctx.fillStyle = "red"
        } else {
            ctx.fillStyle = "black"
        }
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}


function proceduralCorridors() {
    let vectorArr = [[[0, -1], [0, 1]], [[-1, 0], [1, 0]]];
    let previousVectorIndex = [0, 0]
    let x = 500;
    let y = 500;
    for(let i = 0; i < 20; i++) {
        vectorArr.splice(previousVectorIndex[0], 1)
        let randomSegmentLength = randomInt(10, 50);
        let randomVectorIndex = randomInt(0, 2);
        let vector = vectorArr[0].concat(vectorArr)[randomVectorIndex];

        for(let m = 0; m < randomSegmentLength; m++) {
            x += (2 * vector[0]);
            y += (2 * vector[1]);
            corridorTileArr.push(new corridorTile(x, y, 2, 2))
        }
        console.log(vectorArr)
        console.log(randomVectorIndex)
        console.log(vector);

        vectorArr = [[[0, -1], [0, 1]], [[-1, 0], [1, 0]]];
        for(let p = 0; p < vectorArr; p++) {
            for(let l = 0; l < vectorArr[p]; l++) {
                if(vectorArr[p][l][0] === vector[0] && vectorArr[p][l][1] === vector[1]) {
                    previousVectorIndex = [p, l]
                    break;
                }
            }
        }

    }
    for(let test = 0; test < corridorTileArr.length; test++) {
        setTimeout(function() {
            displayTiles(corridorTileArr[test])
        }, 1000)
    }
    //displayTiles()
}

function displayTiles(tile) {
    tile.fillRect()
}



//proceduralCorridors()