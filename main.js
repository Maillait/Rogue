// Class defenitions
class UI {

}

class Button {
    pageID = 0;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    text = 0;
    fontSize = 30;
    borderWidth = 5;

    constructor(x, y, width, height, text, pageID) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.pageID = pageID;
    }

    drawButton() {
        ctx.fillStyle = 'rgb(102, 177, 68)';
        ctx.fillRect(this.x - this.width/2 - this.borderWidth/2, this.y - this.height/2 - this.borderWidth/2, this.width + this.borderWidth, this.height + this.borderWidth);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.fillStyle = 'rgb(102, 177, 68)';
        ctx.font = `${this.fontSize}px monospace`;
        ctx.fillText(this.text, this.x - ctx.measureText(this.text).width/2, this.y + this.fontSize / 3);
    }

    setStyle(borderWidth, fontSize) {
        this.borderWidth = borderWidth;
        this.fontSize = fontSize;
    }

    inBounds(xpos, ypos) {
        if (xpos > this.x - this.width/2 && xpos < x + this.width/2 && ypos > this.y - this.height/2 && ypos < this.y + this.height/2) return 1;
        else return 0;
    }
}

//setting up some vars for the canvas
const plot = document.getElementById("plot");
const ctx = plot.getContext("2d");

const buttons = [
    new Button(320, 240, 400, 45, "Play Rogue", 0), 
    new Button(320, 310, 400, 45, "Exit Game", 0)
];

access();

function access() {
    var menuState = 0;

    ctx.fillStyle = 'black';
    ctx.fillRect(3, 3, 634, 354);

    for (var i = 0; i < buttons.length; i++) if (buttons.at(i).pageID == menuState) buttons.at(i).drawButton();

    if (menuState == 0) {
        ctx.fillStyle = 'rgb(100, 219, 45)';
        ctx.font = '60px monospaced';
        ctx.fillText("--Rogue--", 190, 150);
    }
    
}

function game() {
}

function shop() {
}

function upgrade() {
}

function draw(x, y, angle, projectiles, entities) {
    ctx.fillStyle = 'rgb(100, 219, 45)';
    ctx.fillRect(280, 180, 40, 40);
}
