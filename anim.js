// let knightSprites = document.getElementById("knightSprites");
// let leftFrameCoords = [];
// let rightFrameCoords = [];

// let left = true;
// let right = false;
// let frameNum = 0;

// function playerAnim() {
//   if (mouse.down) {
//     const yDist = mouse.y - 520;
//     const xDist = mouse.x - 520;
//     const atan2 = (Math.atan2(yDist, xDist) * 180) / Math.PI;
//     const mouseAngle = (atan2 + 450) % 360;
//     if (mouseAngle >= 0 && mouseAngle < 180) {
//       right = true;
//       left = false;
//     } else {
//       left = true;
//       right = false;
//     }
//     if (frameNum < 8) {
//       frameNum++;
//     } else {
//       frameNum = 0;
//     }
//     setTimeout(function () {
//       changeFrame(frameNum);
//     }, 5);
//   } else {
//     frameNum = 0;
//     if (left) {
//       ctx.drawImage(
//         knightSprites,
//         leftFrameCoords[0][0],
//         leftFrameCoords[0][1],
//         leftFrameCoords[0][2],
//         leftFrameCoords[0][3],
//         520,
//         520,
//         50,
//         50
//       );
//     } else {
//       ctx.drawImage(
//         knightSprites,
//         rightFrameCoords[0][0],
//         rightFrameCoords[0][1],
//         rightFrameCoords[0][2],
//         rightFrameCoords[0][3],
//         500,
//         500,
//         20,
//         20
//       );
//     }
//   }
// }

// //width: 16
// //height: 27

// function getFrameCoords() {
//   for (let y = 0; y < 54; y += 27) {
//     for (let x = 0; x < 144; x += 16) {
//       if (y === 0) {
//         leftFrameCoords.push([y, x, 16, 27]);
//       } else {
//         rightFrameCoords.push([y, x, 16, 27]);
//       }
//     }
//   }
//   console.log(leftFrameCoords);
//   console.log(rightFrameCoords);
// }

// function changeFrame(frame) {
//   if ((left = true)) {
//     ctx.drawImage(
//       knightSprites,
//       leftFrameCoords[frame][0],
//       leftFrameCoords[frame][1],
//       leftFrameCoords[frame][2],
//       leftFrameCoords[frame][3],
//       530,
//       530,
//       500,
//       500
//     );
//   } else {
//     ctx.drawImage(
//       knightSprites,
//       rightFrameCoords[frame][0],
//       rightFrameCoords[frame][1],
//       rightFrameCoords[frame][2],
//       rightFrameCoords[frame][3],
//       530,
//       530,
//       500,
//       500
//     );
//   }
// }

// getFrameCoords();
