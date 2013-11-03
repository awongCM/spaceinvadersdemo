var canvas = document.getElementById('gameboard');
var context = canvas.getContext("2d");
context.rect(0, 0, canvas.width, canvas.height);

// add linear gradient
var grd = context.createLinearGradient(0, 0, 0, canvas.height);
// light gray
grd.addColorStop(0, '#000000');

// dark blue
grd.addColorStop(1, '#d3d3d3');   
context.fillStyle = grd;
context.fill();