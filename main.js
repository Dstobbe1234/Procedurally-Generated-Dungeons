const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 1000;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Random walk - procedural dungeon generation
let dead = false
async function proceduralCorridors() {
    const vectorIdentifiers = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    let previousVector = 0
    while(!dead) {
        let randomSegmentLength = randomInt(50, 100);
        let randomVectorIndex = randomInt(0, vectorIdentifiers.splice(previousVector, 1).length);
        let Vector = vectorIdentifiers.splice(previousVector, 1)[randomVectorIndex];
        for(let m = 0; m < randomSegmentLength; m+= 10) {
            //ctx.fillRect(m * Vector[0], m * Vector[1], 10, 10)
            //Corridor Tile class
        }
    }



}

function testDead() {
    dead = true
}