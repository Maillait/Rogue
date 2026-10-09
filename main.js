const plot = document.getElementById("plot");
const ctx = plot.getContext("2d");

access();

class UI {

}

function access() {
    var menuState = 0;

    drawButton(100, 100, 100, 100, "hello");
}

function game() {
}

function shop() {
}

function upgrade() {
}

function drawButton(x, y, width, height, text) {
    const BORDER_WIDTH = 4;
    ctx.fillStyle = 'rgb(102, 177, 68)';
    ctx.fillRect(x - width/2 - BORDER_WIDTH/2, y - height/2 - BORDER_WIDTH/2, width + BORDER_WIDTH, width + BORDER_WIDTH);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(x - width/2, y - height/2, width, height);
    ctx.fillStyle = 'rgb(204, 204, 204)';
    ctx.fillText(text, x, y);
}

function draw() {
    ctx.fillStyle = 'rgb(100, 219, 45)';
    ctx.fillRect(280, 180, 40, 40);
}
