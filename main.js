// Class defenitions
class Button {
    pageID = 0;
    visible = false;
    func = "NA";
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    text = 0;
    fontSize = 30;
    borderWidth = 5;

    constructor(x, y, width, height, text, pageID, functionality, fontSize, borderWidth) {
        this.x = x;
        this.y = y;
        this.func = functionality;
        this.width = width;
        this.height = height;
        this.text = text;
        this.pageID = pageID;
        this.fontSize = fontSize;
        this.borderWidth = borderWidth;
    }

    drawButton() {
        ctx.fillStyle = 'rgb(102, 177, 68)';
        ctx.fillRect(this.x - this.width/2 - this.borderWidth/2, this.y - this.height/2 - this.borderWidth/2, this.width + this.borderWidth, this.height + this.borderWidth);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.fillStyle = 'rgb(102, 177, 68)';
        ctx.font = `${this.fontSize}px monospace`;
        ctx.fillText(this.text, this.x - ctx.measureText(this.text).width/2, this.y + this.fontSize / 3);
        this.visible = true;
    }

    inBounds(xpos, ypos) {
        if (xpos > this.x - this.width/2 && xpos < this.x + this.width/2 && ypos > this.y - this.height/2 && ypos < this.y + this.height/2) return true;
        else return false;
    }
}

class position {
    x = 0;
    y = 0;
    v = 0;
    dir = -Math.PI/2;
}

class Projectile {
    x;
    y;
    v;
    length;
    direction;
    size;
    effect;
    color;
    source;

    constructor(x, y, v, len, dir, size, effect, color, source) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.length = len;
        this.direction = dir;
        this.size = size;
        this.effect = effect;
        this.color = color;
        this.source = source;
    }

    step() {
        x += v * cos(dir);
        y += v * sin(dir);
    }

    draw(playerX, playerY, playerDir) {
        let rx = this.x - playerX;
        let ry = this.y - playerY;
        let rytemp = ry;
        let rDir = this.dir - playerDir;

        ry = rx * sin(playerDir) + rytemp * sin(playerDir);
        rx = rx * cos(playerDir) - rytemp * sin(playerDir);

        ctx.strokeStyle = this.color;
        ctx.borderWidth = this.size;

        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + length * cos(rDir), ry + length * sin(rDir));
        ctx.stroke();
    }
}

class Entity {
    x;
    y;
    direction;
    size;
    type;
    xv;
    yv;

    constructor(x, y, dir, size, type, xv, yv) {
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.size = size;
        this.type = type;
        this.xv = xv;
        this.yv = yv;
    }

}

class keys {
    up = false;
    down = false;
    left = false;
    right = false;
    space = false;
    escape = false;
    q = false;
    e = false;
}



//setting up some vars for the canvas
const plot = document.getElementById("plot");
const ctx = plot.getContext("2d");

const buttons = [
    new Button(320, 240, 400, 45, "Play Rogue", 0, "PlayGame", 30, 5), 
    new Button(320, 310, 400, 45, "Exit Game", 0, "Close", 30, 5), 
    new Button(50, 30, 60, 20, "Quit", 1, "LoadRunMenu", 15, 5)
];

let menuState = 0;
let running = true;
let tickCount = 0;

let keyIn = new keys();
let pos = new position();

plot.addEventListener('click', function(e) {
    let func = "NA";
    for (let i = 0; i < buttons.length; i++) 
        if (buttons.at(i).inBounds(e.clientX -plot.getBoundingClientRect().left, e.clientY - plot.getBoundingClientRect().top) == true && buttons.at(i).visible == true) {
            func = buttons.at(i).func;
            break;
        }
    switch(func) {
        case "PlayGame":
            menuState = 1;
            break;
        case "Close":
            break;
        case "LoadRunMenu":
            menuState = 0;
            break;
        default:
    };
});

window.addEventListener('keydown', function(e) {
    if (e.key == 'ArrowUp' || e.key == 'w') keyIn.up = true;
    else if (e.key == 'ArrowDown' || e.key == 's') keyIn.down = true;
    else if (e.key == 'ArrowLeft' || e.key == 'a') keyIn.left = true;
    else if (e.key == 'ArrowRight' || e.key == 'd') keyIn.right = true;
    else if (e.key == ' ') keyIn.space = true;
    else if (e.key == 'e') keyIn.e = true;
    else if (e.key == 'q') keyIn.q = true;
    else if (e.key == 'Escape') keyIn.escape = true;
});

window.addEventListener('keyup', function(e) {
    if (e.key == 'ArrowUp' || e.key == 'w') keyIn.up = false;
    else if (e.key == 'ArrowDown' || e.key == 's') keyIn.down = false;
    else if (e.key == 'ArrowLeft' || e.key == 'a') keyIn.left = false;
    else if (e.key == 'ArrowRight' || e.key == 'd') keyIn.right = false;
    else if (e.key == ' ') keyIn.space = false;
    else if (e.key == 'e') keyIn.e = false;
    else if (e.key == 'q') keyIn.q = false;
    else if (e.key == 'Escape') keyIn.escape = false;
});

timer = setInterval(access, 50);

function access() {
    if (menuState == 1) game();
    draw();
}

function game() {
    //update player position
    if (keyIn.up) {
        if (pos.v < 5) pos.v++;
    } else if (pos.v > 0) pos.v /= 2;
    if (keyIn.right) pos.dir += 0.1;
    if (keyIn.left) pos.dir -= 0.1;
    pos.x += pos.v * Math.cos(pos.dir);
    pos.y += pos.v * Math.sin(pos.dir);
    //update entity position
    //update projectile position
    //calculate collisions/attacks
    //check health to see if dead
    //check score to see if it's time to upgrade
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(3, 3, 634, 354);

    
    if (menuState == 0) {
        ctx.fillStyle = 'rgb(100, 219, 45)';
        ctx.font = '60px monospaced';
        ctx.fillText("--Rogue--", 190 + 10 * Math.cos(tickCount/10), 150 + 5 * Math.sin(tickCount/5));
    } else if (menuState == 1) {
        // temporary placeholder
        ctx.fillStyle = 'rgb(200, 0, 250)';
        ctx.fillRect(pos.x + 320, pos.y + 160, 3, 3);
    }

    for (var i = 0; i < buttons.length; i++) 
        if (buttons.at(i).pageID == menuState) buttons.at(i).drawButton();
        else buttons.at(i).visible = false;

    tickCount++;
}
