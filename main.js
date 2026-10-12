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
    kb = 0;
    dir = -Math.PI/2;
    kbdir = 0;
}

class Projectile {
    x;
    y;
    v;
    direction;
    size;
    effect;
    color;
    source;

    constructor(x, y, v, dir, size, effect, color, source) {
        this.x = x;
        this.y = y;
        this.v = v;
        this.direction = dir;
        this.size = size;
        this.effect = effect;
        this.color = color;
        this.source = source;
    }

    step() {
        this.x += this.v * Math.cos(this.direction);
        this.y += this.v * Math.sin(this.direction);
    }

    draw() {
        let rx = this.x - pos.x;
        let ry = this.y - pos.y;

        ctx.fillStyle = this.color;
        ctx.fillRect(-(rx * -Math.sin(pos.dir) + ry * Math.cos(pos.dir)) - this.size/2 + 320, -(rx * Math.cos(pos.dir) + ry * Math.sin(pos.dir)) - this.size/2 + 180, this.size, this.size);
    }
}

class Entity {
    x;
    y;
    direction;
    type;
    xv;
    yv;
    lastAttack = 0;
    cooldown;
    kb = 0;
    kbdir = 0;
    hp;

    constructor(x, y, dir, type, v) {
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.type = type;
        this.v = v;
        switch (type) {
            case "punch":
                this.cooldown = 4;
                this.hp = 200;
                break;
            case "gunman":
                this.cooldown = 20;
                this.hp = 100;
                break;
            case "grenade":
                this.cooldown = 40;
                this.hp = 200;
                break;
            case "healer":
                this.cooldown = 100;
                this.hp = 500;
                break;
            case "tank":
                this.cooldown = 20;
                this.hp = 2000;
                break;
        }
    }

    step() {
        this.x += this.v * Math.cos(this.direction) + this.kb * Math.cos(this.kbdir);
        this.y += this.v * Math.sin(this.direction) + this.kb * Math.sin(this.kbdir);

        while (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > Math.PI) this.direction -= 2 * Math.PI;
        while (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -Math.PI) this.direction += 2 * Math.PI;

        switch (this.type) {
            case "punch":
                if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0.1) this.direction -= 0.1;
                else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -0.1) this.direction += 0.1;
                break;
            case "gunman":
                if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) > 250) {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0.1) this.direction -= 0.1;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -0.1) this.direction += 0.1;
                    this.v = 3;
                } else if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) > 150) {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0.1) this.direction -= 0.1;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -0.1) this.direction += 0.1;
                    this.v = 0;
                    if (tickCount - this.lastAttack > this.cooldown) {
                        projectiles.push(new Projectile(this.x, this.y, 15, this.direction, 6, "arrow", 'rgb(156, 89, 0)', "Enemy"));
                        this.lastAttack = tickCount;
                    }
                } else {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < 2 && this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0) this.direction += 0.2;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > -2) this.direction += 0.2;
                    this.v = 3;
                }
                
                break;
            case "grenade":
                if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) > 250) {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0.1) this.direction -= 0.1;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -0.1) this.direction += 0.1;
                    this.v = 3;
                } else if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) > 150) {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0.1) this.direction -= 0.1;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -0.1) this.direction += 0.1;
                    this.v = 0;
                    if (tickCount - this.lastAttack > this.cooldown) {
                        projectiles.push(new Projectile(this.x, this.y, 10, this.direction, 10, "grenade", 'rgb(106, 153, 45)', "Enemy"));
                        this.lastAttack = tickCount;
                    }
                } else {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < 2 && this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0) this.direction += 0.2;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > -2) this.direction += 0.2;
                    this.v = 3;
                }

                break;
            case "healer":
                
                break;
            case "tank":
                
                break;
        }
    }

    draw() {
        let rx = this.x - pos.x;
        let ry = this.y - pos.y;

        ctx.save();
        ctx.translate(-(rx * -Math.sin(pos.dir) + ry * Math.cos(pos.dir)) + 320, -(rx * Math.cos(pos.dir) + ry * Math.sin(pos.dir)) + 180);
        ctx.rotate(pos.dir - this.direction);

        switch (this.type) {
            case "punch":
                ctx.drawImage(sprites, 32, 0, 32, 32, - 16, - 16, 32, 32);
                break;
            case "gunman":
                ctx.drawImage(sprites, 64, 0, 32, 32, - 16, - 16, 32, 32);
                break;
            case "grenade":
                ctx.drawImage(sprites, 64, 0, 32, 32, - 16, - 16, 32, 32);
                break;
            case "healer":
                ctx.drawImage(sprites, 96, 0, 32, 32, - 16, - 16, 32, 32);
                break;
            case "tank":
                ctx.drawImage(sprites, 128, 0, 32, 32, - 16, - 16, 32, 32);
                break;
        }

        ctx.restore();
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
    w = false;
    a = false;
    s = false;
    d = false;
}

//setting up some vars for the canvas
const plot = document.getElementById("plot");
const ctx = plot.getContext("2d");
const sprites = document.getElementById("sprites");

const enemyTypes = [
    "punch",
    "gunman",
    "grenade",
    "healer",
    "tank"
];
const buttons = [
    new Button(320, 240, 400, 45, "Play Rogue", 0, "PlayGame", 30, 5), 
    new Button(320, 310, 400, 45, "Exit Game", 0, "Close", 30, 5), 
    new Button(50, 30, 60, 20, "Quit", 1, "LoadRunMenu", 15, 5)
];
let entities = [];
let projectiles = [];

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
    if (e.key == 'ArrowUp') keyIn.up = true;
    else if (e.key == 'ArrowDown') keyIn.down = true;
    else if (e.key == 'ArrowLeft') keyIn.left = true;
    else if (e.key == 'ArrowRight') keyIn.right = true;
    else if (e.key == 'w') keyIn.w = true;
    else if (e.key == 'a') keyIn.a = true;
    else if (e.key == 's') keyIn.s = true;
    else if (e.key == 'd') keyIn.d = true;
    else if (e.key == ' ') keyIn.space = true;
    else if (e.key == 'e') keyIn.e = true;
    else if (e.key == 'q') keyIn.q = true;
    else if (e.key == 'Escape') keyIn.escape = true;
});

window.addEventListener('keyup', function(e) {
    if (e.key == 'ArrowUp') keyIn.up = false;
    else if (e.key == 'ArrowDown') keyIn.down = false;
    else if (e.key == 'ArrowLeft') keyIn.left = false;
    else if (e.key == 'ArrowRight') keyIn.right = false;
    else if (e.key == 'w') keyIn.w = false;
    else if (e.key == 'a') keyIn.a = false;
    else if (e.key == 's') keyIn.s = false;
    else if (e.key == 'd') keyIn.d = false;
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
    //update player position +
    if (keyIn.up || keyIn.w) {
        if (pos.v < 10) pos.v++;
    } else if (pos.v > 0) pos.v /= 2;
    if (keyIn.right || keyIn.d) pos.dir -= 0.1;
    if (keyIn.left || keyIn.a) pos.dir += 0.1;
    pos.x += pos.v * Math.cos(pos.dir); + pos.kb + Math.cos(pos.kbdir);
    pos.y += pos.v * Math.sin(pos.dir); + pos.kb * Math.sin(pos.kbdir);

    //update entity position/ add Entities
    let entityType = Math.floor(Math.sqrt(Math.random() * tickCount/200)) % 5;
    let angle = Math.random() * 2 * Math.PI;
    let entityx = 400 * Math.cos(angle); 
    if (Math.random() > 0.5) entityx = entityx - 2 * Math.cos(angle);
    let entityy = 400 * Math.sin(angle); 
    if (Math.random() > 0.5) entityy = entityy - 2 * Math.sin(angle);
    
    if (Math.random() > 0.98 && entities.length < 50) entities.push(new Entity(entityx, entityy, Math.atan2(pos.y - entityy, pos.x - entityx), enemyTypes[entityType], 2));
    for (let i = 0; i < entities.length; i++) entities.at(i).step();

    //update projectile position +
    for (let i = 0; i < projectiles.length; i++) projectiles.at(i).step();

    //calculate collisions/attacks
    //check health to see if dead
    //check score to see if it's time to upgrade
}

function draw() {
    ctx.fillStyle = 'rgb(100, 219, 45)';
    ctx.fillRect(0, 0, 640, 360);
    ctx.fillStyle = 'black';
    ctx.fillRect(3, 3, 634, 354);
    
    if (menuState == 0) ctx.drawImage(sprites, 0, 33, 160, 52, 170 + 10 * Math.cos(tickCount/10), 100 + 5 * Math.sin(tickCount/5), 300, 100);
    else if (menuState == 1) {
        ctx.fillStyle = 'rgb(0, 100, 0';
        for (let o = -5; o < 6; o++) {
            let x = 100 * (Math.floor(pos.x/100) + o) - pos.x;
            for (let i = -3; i < 4; i++) {
                let y = 100 * (Math.floor(pos.y/100) + i) - pos.y;
                ctx.fillRect(-(x * -Math.sin(pos.dir) + y * Math.cos(pos.dir)) - 5/2 + 320, -(x * Math.cos(pos.dir) + y * Math.sin(pos.dir)) - 5/2 + 180, 5, 5);
            }
        }
        ctx.drawImage(sprites, 0, 0, 32, 32, 288, 148, 64, 64);
        //draw entities
        for (let i = 0; i < entities.length; i++) entities.at(i).draw();
        //draw projectiles
        for (let i = 0; i < projectiles.length; i++) projectiles.at(i).draw();
    } // add various menus/upgrades

    for (var i = 0; i < buttons.length; i++) 
        if (buttons.at(i).pageID == menuState) buttons.at(i).drawButton();
        else buttons.at(i).visible = false;

    tickCount++;
}
