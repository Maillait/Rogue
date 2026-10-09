const plot = document.getElementById("plot");
const ctx = plot.getContext("2d");

access();

class UI {

}

function access() {
    var menuState = 0;

    drawButton(300, 200, 200, 100, "hello", '40px arial');
}

function game() {
}

function shop() {
}

function upgrade() {
}

function drawButton(x, y, width, height, text, fontStyle) {
    const BORDER_WIDTH = 6;
    ctx.fillStyle = 'rgb(102, 177, 68)';
    ctx.fillRect(x - width/2 - BORDER_WIDTH/2, y - height/2 - BORDER_WIDTH/2, width + BORDER_WIDTH, height + BORDER_WIDTH);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(x - width/2, y - height/2, width, height);
    ctx.fillStyle = 'rgb(204, 204, 204)';
    ctx.font = fontStyle;
    ctx.fillText(text, x - ctx.measureText(text).width/2, y + 10);
}

function draw(x, y, angle, projectiles, entities) {
    ctx.fillStyle = 'rgb(100, 219, 45)';
    ctx.fillRect(280, 180, 40, 40);
}
