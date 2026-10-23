// Classes
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
        ctx.fillStyle = 'rgb(122, 73, 8)';
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
        this.x += this.v * Math.cos(this.direction) * lastTick/50;
        this.y += this.v * Math.sin(this.direction) * lastTick/50;
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
                this.hp = 100;
                break;
            case "gunman":
                this.cooldown = 20;
                this.hp = 50;
                break;
            case "grenade":
                this.cooldown = 40;
                this.hp = 100;
                break;
            case "healer":
                this.cooldown = 5;
                this.hp = 500;
                break;
            case "tank":
                this.cooldown = 20;
                this.hp = 2000;
                break;
        }
    }

    step() {
        this.x += this.v * Math.cos(this.direction) + this.kb * Math.cos(this.kbdir) * lastTick/50;
        this.y += this.v * Math.sin(this.direction) + this.kb * Math.sin(this.kbdir) * lastTick/50;

        while (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > Math.PI) this.direction -= 2 * Math.PI;
        while (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -Math.PI) this.direction += 2 * Math.PI;

        this.kb /= 3;

        switch (this.type) {
            case "punch":
                if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0.1) this.direction -= 0.2;
                else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -0.1) this.direction += 0.2;
                if (performance.now() - refTime < 18000) this.v = 3;
                else if (performance.now() - refTime < 60000) this.v = (performance.now() - refTime)/6000;
                else this.v = 10;

                if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) < 48 && punchActiveUntil >= performance.now()) {
                    this.kbdir = this.direction + Math.PI;
                    this.kb += punch * 4 + 16;
                    this.hp -= punch * 5 + 10;
                } else if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) < 36 && performance.now() - this.lastAttack > this.cooldown * 50) {
                    this.lastAttack = performance.now();
                    pos.kbdir = Math.atan2(pos.kb * Math.sin(pos.kbdir) + 5 * Math.sin(this.direction), pos.kb * Math.cos(pos.kbdir) + 5 * Math.cos(this.direction));
                    pos.kb += 5;
                    hp -= 10 - defense;
                }
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
                    if (performance.now() - this.lastAttack > this.cooldown * 50) {
                        projectiles.push(new Projectile(this.x, this.y, 15, this.direction, 6, "arrow", 'rgb(156, 89, 0)', "Enemy"));
                        this.lastAttack = performance.now();
                    }
                } else {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < 2 && this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0) this.direction += 0.2;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > -2) this.direction += 0.2;
                    this.v = 3;
                }

                if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) < 48 && punchActiveUntil >= performance.now()) {
                    this.kbdir = Math.atan2(pos.y - this.y, pos.x - this.x) + Math.PI;
                    this.kb += punch * 4 + 16;
                    this.hp -= punch * 5 + 10;
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
                    if (performance.now() - this.lastAttack > this.cooldown * 50) {
                        projectiles.push(new Projectile(this.x, this.y, 10, this.direction, 10, "grenade", 'rgb(106, 153, 45)', "Enemy"));
                        this.lastAttack = performance.now();
                    }
                } else {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < 2 && this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0) this.direction += 0.2;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > -2) this.direction += 0.2;
                    this.v = 3;
                }
                if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) < 48 && punchActiveUntil >= performance.now()) {
                    this.kbdir = Math.atan2(pos.y - this.y, pos.x - this.x) + Math.PI;
                    this.kb += punch * 4 + 16;
                    this.hp -= punch * 5 + 10;
                }

                break;
            case "healer":
                if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) > 200) {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0.1) this.direction -= 0.1;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -0.1) this.direction += 0.1;
                    this.v = 2;
                } else if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) > 100) {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0.1) this.direction -= 0.1;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -0.1) this.direction += 0.1;
                    this.v = 0;
                    if (performance.now() - this.lastAttack > this.cooldown * 50) {
                        projectiles.push(new Projectile(this.x, this.y, 10, Math.random() * 2 * Math.PI, 6, "Health", 'rgb(44, 184, 189)', "Enemy"));
                        this.lastAttack = performance.now();
                    }
                } else {
                    if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < 2 && this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0) this.direction += 0.2;
                    else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > -2) this.direction += 0.2;
                    this.v = 2;
                }
                if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) < 48 && punchActiveUntil >= performance.now()) {
                    this.kbdir = Math.atan2(pos.y - this.y, pos.x - this.x) + Math.PI;
                    this.kb += punch * 4 + 16;
                    this.hp -= punch * 5 + 10;
                }
                
                break;
            case "tank":
                if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) > 0.1) this.direction -= 0.1;
                else if (this.direction - Math.atan2(pos.y - this.y, pos.x - this.x) < -0.1) this.direction += 0.1;
                this.v = 1;
                if (performance.now() - this.lastAttack > this.cooldown * 50) {
                    if (Math.random() > 0.5) {
                        projectiles.push(new Projectile(this.x, this.y, 10, this.direction, 10, "grenade", 'rgb(106, 153, 45)', "Enemy"));
                        projectiles.push(new Projectile(this.x, this.y, 15, this.direction, 6, "arrow", 'rgb(156, 89, 0)', "Enemy"));
                        projectiles.push(new Projectile(this.x, this.y, 15, this.direction + Math.PI/6, 6, "arrow", 'rgb(156, 89, 0)', "Enemy"));
                        projectiles.push(new Projectile(this.x, this.y, 15, this.direction - Math.PI/6, 6, "arrow", 'rgb(156, 89, 0)', "Enemy"));
                        this.lastAttack = performance.now();
                    } 
                    if (Math.random() > 0.5 && entities.length < 500) {
                        if (Math.random() < 0.3333333) entities.push(new Entity(this.x + Math.random() * 20, this.y + Math.random() * 20, this.direction, "punch", 0)); 
                        else if (Math.random < 0.5) entities.push(new Entity(this.x + Math.random() * 20, this.y + Math.random() * 20, this.direction, "gunman", 0)); 
                        else entities.push(new Entity(this.x + Math.random() * 20, this.y + Math.random() * 20, this.direction, "grenade", 0)); 
                        this.lastAttack = performance.now();
                    }
                }
                if (Math.sqrt((this.x - pos.x) * (this.x - pos.x) + (this.y - pos.y) * (this.y - pos.y)) < 48 && punchActiveUntil >= performance.now()) {
                    this.kbdir = Math.atan2(pos.y - this.y, pos.x - this.x) + Math.PI;
                    this.kb += punch * 4 + 16;
                    this.hp -= punch * 5 + 10;
                }

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
                ctx.drawImage(sprites, 64, 256, 64, 64, - 16, - 16, 32, 32);
                break;
            case "gunman":
                ctx.drawImage(sprites, 128, 256, 64, 64, - 16, - 16, 32, 32);
                break;
            case "grenade":
                ctx.drawImage(sprites, 192, 256, 64, 64, - 16, - 16, 32, 32);
                break;
            case "healer":
                ctx.drawImage(sprites, 256, 256, 64, 64, - 16, - 16, 32, 32);
                break;
            case "tank":
                ctx.drawImage(sprites, 320, 256, 64, 64, - 16, - 16, 32, 32);
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

class upgrade {
    name;
    level = 0;
    maxLevel;
    type;

    constructor (name, maxLevel, type) {
        this.name = name;
        this.maxLevel = maxLevel;
        this.type = type;
    }

    upgrade () {
        if (!this.maxed()) {
            this.level++;

        switch (this.name) {
            case "punch":
                punch++;
                break;
            case "gun":
                gun++;
                break;
            case "speed":
                speed++;
                break;
            case "maxhp":
                maxhp += 200;
                hp += 200;
                break;
            case "defense":
                defense++;
                break;
            case "regen":
                regen += 1;
                break;
            case "atkspeed":
                punchCooldown -= 3;
                gunCooldown -= 1.5;
                break;
            case "multiBullet":
                gun = 7;
                break;
            case "megaPunch":
                punch = 7;
                break;
            case "dash":
                special = 1;
                specialStrength++;
                break;
            case "teleport":
                special = 2;
                specialStrength++;
                break;
            case "laser":
                special = 3;
                specialStrength++;
                break;
            case "shield":
                special = 4;
                specialStrength++;
                break;
            default:
                console.log("Error: upgrade not found");
            }
        }
    }

    maxed () {
        return this.level >= this.maxLevel;
    }
}

class lilypads {
    xrel;
    yrel;
    type;
    
    constructor () {
        let angle = Math.random() * Math.PI;
        this.xrel = 500 * (1 - Math.random() * Math.random()) * Math.cos(angle) + pos.x;
        this.yrel = 500 * (1 - Math.random() * Math.random()) * Math.sin(angle) + pos.y;
        this.type = Math.floor(Math.random() * 4);
    }

    drawDel() {
        let rx = this.xrel - pos.x;
        let ry = this.yrel - pos.y;

        if (rx * rx + ry * ry > 370 * 370) return true;
        else {
            ctx.save();
            ctx.translate(-(rx * -Math.sin(pos.dir) + ry * Math.cos(pos.dir)) + 320, -(rx * Math.cos(pos.dir) + ry * Math.sin(pos.dir)) + 180);
            ctx.rotate(pos.dir);

            ctx.drawImage(sprites, 128 + 64 * this.type, 320, 64, 64, -16, -16, 32, 32);

            ctx.restore();

            return false;
        }
    }

    flip() {
        this.xrel = pos.x + pos.x - this.xrel;
        this.yrel = pos.y + pos.y - this.yrel;
    }
}

const plot = document.getElementById("plot");
const ctx = plot.getContext("2d");
const sprites = document.getElementById("sprites");

let upOps = [
    "basic",
    "basic",
    "adv",
    "basic",
    "basic",
    "adv",
    "basic",
    "special",
    "basic",
    "adv",
    "basic",
    "basic",
    "adv",
    "basic",
    "basic",
    "adv",
    "basic",
    "basic",
    "adv",
    "basic",
    "basic",
    "adv",
    "basic",
    "basic",
    "adv",
    "basic",
    "basic",
    "adv",
    "basic",
    "basic"
];
const enemyTypes = [
    "punch",
    "gunman",
    "grenade",
    "healer",
    "tank"
];
const buttons = [
    new Button(320, 240, 400, 45, "Play Rogue", 0, "PlayGame", 30, 5), 
    new Button(50, 30, 60, 20, "Quit", 1, "LoadRunMenu", 15, 5),
    new Button(320, 150, 400, 45, "Resume Game", 2, "ResumeGame", 30, 5),
    new Button(320, 220, 400, 45, "Quit Game", 2, "ExitGame", 30, 5),
    new Button(120, 220, 130, 20, "Pick 1", 4, "op1", 15, 5),
    new Button(320, 220, 130, 20, "Pick 2", 4, "op2", 15, 5),
    new Button(520, 220, 130, 20, "Pick 3", 4, "op3", 15, 5),
    new Button(320, 300, 400, 45, "Continue", 5, "ExitGame", 30, 5),
];
const allUps = [
new upgrade("punch", 5, "basic"),
new upgrade("gun", 5, "basic"),
new upgrade("speed", 5, "basic"),
new upgrade("maxhp", 5, "basic"),
new upgrade("defense", 3, "advanced"),
new upgrade("regen", 3, "advanced"),
new upgrade("atkspeed", 3, "advanced"),
new upgrade("multiBullet", 1, "advanced"), // upgrades gun
new upgrade("megaPunch", 1, "advanced"), // upgrades punch
new upgrade("dash", 2, "special"), // special (spacebar)
new upgrade("teleport", 2, "special"), // special (spacebar) teleports you to where your tp bullet 'dies'
new upgrade("laser", 2, "special"), // special (spacebar) fast weak gun (compliments base gun)
new upgrade("shield", 2, "special") // special (spacebar) acts as a shield, no cooldown, but you cannot attack
];
let keyIn = new keys();
let pos = new position();

let entities = [];
let projectiles = [];

let menuState = 0;
let tickCount = 0;
let saveTime = 0;
let lastCheck = 0;
let lastTick = performance.now();
let lastTickTime = 0;
let lastEnemy = 0;
let refTime = performance.now();

let hp = 500;
let score = 0;
let scoreChecks = 0;
let punchActiveUntil = 0;
let lastBullet = 0;

let ups = ["", "", ""];
let lilypad = [
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads(),
    new lilypads()
];

let punch = 1;
let gun = 1;
let speed = 1;
let maxhp = 500;
let defense = 0;
let regen = 0;
let punchCooldown = 20;
let gunCooldown = 10;
let special = 0;
let specialStrength = 0;
let nextSpecial = 0;

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
            tickCount = 0;
            resetDefault();
            break;
        case "LoadRunMenu":
            menuState = 2;
            saveTime = performance.now();
            break;
        case "ResumeGame":
            menuState = 1;
            refTime -= performance.now() - saveTime;
            break;
        case "ExitGame":
            menuState = 0;
            break;
        case "op1":
            if (ups[0] != "Sold Out") {
                menuState = 1;
                refTime -= performance.now() - saveTime;
                allUps.at(inUps(ups.at(0))).upgrade();
            } else alert("Sold out!");
            break;
        case "op2":
            if (ups[1] != "Sold Out") {
                menuState = 1;
                refTime -= performance.now() - saveTime;
                allUps.at(inUps(ups.at(1))).upgrade();
            } else alert("Sold out!");
            break;
        case "op3":
            if (ups[2] != "Sold Out") {
                menuState = 1;
                refTime -= performance.now() - saveTime;
                allUps.at(inUps(ups.at(2))).upgrade();
            } else alert("Sold out!");
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
    else if (e.code == 'Space') keyIn.space = true;
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
    else if (e.code == 'Space') keyIn.space = false;
    else if (e.key == 'e') keyIn.e = false;
    else if (e.key == 'q') keyIn.q = false;
    else if (e.key == 'Escape') keyIn.escape = false;
});

requestAnimationFrame(access);

function access() {
    lastTickTime = performance.now() - lastTick;

    if (menuState == 1) game();
    draw();

    requestAnimationFrame(access);
}

function inUps(upName) {
    for (let i = 0; i < allUps.length; i++) {
        if (allUps.at(i).name == upName) return i;
    }
    return -1;
}

function resetDefault() {
    entities = [];
    projectiles = [];
    tickCount = 0;
    saveTime = 0;
    refTime = performance.now();
    lastCheck = 0;
    hp = 500;
    score = 0;
    scoreChecks = 0;
    punchActiveUntil = 0;
    lastBullet = 0;
    ups = ["", "", ""];
    punch = 1;
    gun = 1;
    speed = 1;
    maxhp = 500;
    defense = 0;
    regen = 0;
    punchCooldown = 20;
    gunCooldown = 10;
    special = 0;
    specialStrength = 0;
    nextSpecial = 0;
    pos = new position();
}

function game() {
    //update player position +
    if (keyIn.up || keyIn.w) {
        if (pos.v < 4 * speed + 6) pos.v += 2 * speed * lastTick/50;
    } else if (keyIn.down || keyIn.s) {
        if (pos.v > -2 * speed - 3) pos.v -= 2 * speed * lastTick/50;
    } else if (pos.v != 0) pos.v /= 2;
    if (pos.v > 4 * speed + 6) pos.v -= 1 * lastTick/50;
    pos.kb /= 3 * 50/lastTick;
    if (keyIn.right) pos.dir -= 0.1 * lastTick/50;
    if (keyIn.left) pos.dir += 0.1 * lastTick/50;
    if (keyIn.a) {
        pos.x += 4 * speed * Math.cos(pos.dir + Math.PI/2) * lastTick/50;
        pos.y += 4 * speed * Math.sin(pos.dir + Math.PI/2) * lastTick/50;
    }
    if (keyIn.d) {
        pos.x -= 4 * speed * Math.cos(pos.dir + Math.PI/2) * lastTick/50;
        pos.y -= 4 * speed * Math.sin(pos.dir + Math.PI/2) * lastTick/50;
    }


    if (keyIn.q && performance.now() - punchActiveUntil > punchCooldown * 50) punchActiveUntil = performance.now() + punch * 200 + 1000;
    if (keyIn.e && performance.now() - lastBullet > gunCooldown * 50) {
        lastBullet = performance.now();
        projectiles.push(new Projectile(pos.x, pos.y, gun + 6, pos.dir, 5 + gun * 2, "bullet", 'rgb(233, 0, 0)', "Player"));
    }

    if (hp < maxhp) hp += regen/5;
    if (keyIn.space && performance.now() > nextSpecial) {
        switch (special) {
            case 1:
                nextSpecial = performance.now() + 5000/specialStrength;
                punchActiveUntil = performance.now() + 200 * specialStrength;
                pos.v = 40 + 20 * specialStrength;
                break;
            case 2:
                projectiles.push(new Projectile(pos.x, pos.y, 25, pos.dir, 4, "tp", "rgb(101, 18, 196)", "Player"));
                nextSpecial = performance.now() + 5000/specialStrength;
                break;
            case 3:
                projectiles.push(new Projectile(pos.x, pos.y, 30 * specialStrength, pos.dir, 4, "laser", "rgb(238, 33, 33)", "Player"));
                nextSpecial = performance.now() + 200/specialStrength;
                break;
            case 4:
                // add shield functionality
                break;
        }
    }

    pos.x += (pos.v * Math.cos(pos.dir) + pos.kb * Math.cos(pos.kbdir)) * lastTick/50;
    pos.y += (pos.v * Math.sin(pos.dir) + pos.kb * Math.sin(pos.kbdir)) * lastTick/50;

    //update entity position & add Entities
    if (performance.now() - lastEnemy > 20 && Math.random() > 0.97 && entities.length < 200) {
        let entityType = Math.floor(Math.random() * Math.random() * 5);
        if (performance.now() - refTime < 60000 && entityType > 1) entityType = 0;
        else if (performance.now() - refTime < 120000 && entityType > 2) entityType = 0;
        else if (performance.now() - refTime < 150000 && entityType > 3) entityType = 0;
        let angle = Math.random() * 2 * Math.PI;
        let entityx = 500 * Math.cos(angle); 
        if (Math.random() > 0.5) entityx = entityx - 2 * Math.cos(angle);
        let entityy = 500 * Math.sin(angle); 
        if (Math.random() > 0.5) entityy = entityy - 2 * Math.sin(angle);
    
        entities.push(new Entity(entityx, entityy, Math.atan2(pos.y - entityy, pos.x - entityx), enemyTypes[entityType], 2));
        lastEnemy = performance.now();
    }

    for (let i = 0; i < entities.length; i++) {
        entities.at(i).step();
        if (entities.at(i).hp <= 0) {
            switch (entities.at(i).type) {
                case "health":
                    score += 5;
                    break;
                case "tank":
                    score += 50;
                    break;
                default:
                score += 4;
            }
            entities.splice(i, 1);
        }
    }

    //update projectile position + Character-particle interactions
    for (let i = 0; i < projectiles.length; i++) {
        projectiles.at(i).step();
        if (projectiles.at(i).source == "Enemy") {
            if (projectiles.at(i).effect == "Health") {
                let deleted = false;
                for (let o = 0; o < entities.length; o++) {
                    if (Math.sqrt((projectiles.at(i).x - entities.at(o).x) * (projectiles.at(i).x - entities.at(o).x) + (projectiles.at(i).y - entities.at(o).y) * (projectiles.at(i).y - entities.at(o).y)) < projectiles.at(i).size + 16 && entities.at(o).type != "healer") {
                        entities.at(o).hp += 40;
                        projectiles.splice(i, 1);
                        i--;
                        deleted = true;
                        break;
                    }
                }
                if (!deleted && Math.sqrt((projectiles.at(i).x - pos.x) * (projectiles.at(i).x - pos.x) + (projectiles.at(i).y - pos.y) * (projectiles.at(i).y - pos.y)) > 500) {
                    projectiles.splice(i, 1);
                    i--;
                }
            } else if (Math.sqrt((projectiles.at(i).x - pos.x) * (projectiles.at(i).x - pos.x) + (projectiles.at(i).y - pos.y) * (projectiles.at(i).y - pos.y)) < projectiles.at(i).size + 24) {
                switch (projectiles.at(i).effect) {
                    case "arrow":
                        hp -= 3 - defense;
                        pos.kbdir = Math.atan2(pos.kb * Math.sin(pos.kbdir) + Math.sin(projectiles.at(i).direction), pos.kb * Math.cos(pos.kbdir) + Math.cos(projectiles.at(i).direction));
                        pos.kb += 1;
                        projectiles.splice(i, 1);
                        i--;
                        break;
                    case "grenade":
                        hp -= 10 - defense;
                        pos.kb += 10;
                        pos.kbdir = Math.atan2(pos.kb * Math.sin(pos.kbdir) + 10 * Math.sin(projectiles.at(i).direction), pos.kb * Math.cos(pos.kbdir) + 10 * Math.cos(projectiles.at(i).direction));
                        projectiles.splice(i, 1);
                        i--;
                        break;

                }
            } else if (Math.sqrt((projectiles.at(i).x - pos.x) * (projectiles.at(i).x - pos.x) + (projectiles.at(i).y - pos.y) * (projectiles.at(i).y - pos.y)) > 500) {
                projectiles.splice(i, 1);
                i--;
            }
        } else if (projectiles.at(i).source == "Player") {
            let deleted = false;
            for (let o = 0; o < entities.length; o++) {
                if (Math.sqrt((projectiles.at(i).x - entities.at(o).x) * (projectiles.at(i).x - entities.at(o).x) + (projectiles.at(i).y - entities.at(o).y) * (projectiles.at(i).y - entities.at(o).y)) < projectiles.at(i).size + 16) {
                    switch (projectiles.at(i).effect) {
                        case "tp":
                            let tx = pos.x;
                            let ty = pos.y;
                            pos.x = entities.at(o).x;
                            pos.y = entities.at(o).y;
                            entities.at(o).y = ty;
                            entities.at(o).x = tx;
                            entities.at(o).hp -= 50;
                            projectiles.splice(i, 1);
                            i--;
                            deleted = true;
                            break;
                        case "laser":
                            entities.at(o).hp -= 40;
                            projectiles.splice(i, 1);
                            i--;
                            deleted = true;
                            break;
                        case "bullet":
                            entities.at(o).hp -= gun * 10 + 40;
                            projectiles.splice(i, 1);
                            i--;
                            deleted = true;
                        break;
                    }
                    break;
                }
            } if (!deleted && Math.sqrt((projectiles.at(i).x - pos.x) * (projectiles.at(i).x - pos.x) + (projectiles.at(i).y - pos.y) * (projectiles.at(i).y - pos.y)) > 500) {
                if (projectiles.at(i).effect == "tp") {
                    pos.x = projectiles.at(i).x;
                    pos.y = projectiles.at(i).y;
                }
                projectiles.splice(i, 1);
                i--;
            }
        }

    }

    if (hp <= 0) {
        menuState = 5;
        saveTime = performance.now();
    } else if (score - scoreChecks * 60 > 60 && performance.now() - lastCheck > 10000) {
        menuState = 4;
        scoreChecks++;
        saveTime = performance.now();
        lastCheck = performance.now();

        if (punch == 6 && gun == 6 && specialStrength == 1) {
            let supped = "";
            for (let i = -4; i < 0; i++)
                if (allUps.at(i).level == 1) {
                    supped = allUps.at(i).name;
                    break;
                }
            ups = ["multiBullet", "megaPunch", supped];
        } else {
            let skip = Math.floor(Math.random() * 4);
            switch (upOps.at(scoreChecks - 1)) {
                case "basic":
                    for (let i = 0; i < 4; i++)
                        if (i < skip) ups[i] = allUps.at(i).name;
                        else if (i != skip) ups[i - 1] = allUps.at(i).name;
                    break;
                case "adv":
                    ups = ["defense", "regen", "atkspeed"];
                    break;
                case "special":
                    for (let i = 0; i < 4; i++)
                        if (i < skip) ups[i] = allUps.at(i + 9).name;
                        else if (i != skip) ups[i - 1] = allUps.at(i + 9).name;
                    break;
                default:
                    console.log("upgrade level not found");
            }
            for (let i = 0; i < ups.length; i++) {
                if (allUps.at(inUps(ups.at(i))).maxed()) ups[i] = "Sold Out";
            }
        }
    }
}

function draw() {
    ctx.fillStyle = 'rgb(100, 219, 45)';
    ctx.fillRect(0, 0, 640, 360);
    ctx.fillStyle = 'rgb(59, 201, 211)';
    ctx.fillRect(3, 3, 634, 354);
    
    if (menuState == 0) ctx.drawImage(sprites, 0, 0, 384, 128, 128 + 10 * Math.cos(performance.now()/500), 80 + 5 * Math.sin(performance.now()/250), 384, 128);
    else if (menuState == 1) {

        for (let i = 0; i < lilypad.length; i++) {
            if (lilypad.at(i).drawDel()) {
                lilypad.at(i).flip();
            }
        }

        //draw projectiles
        for (let i = 0; i < projectiles.length; i++) projectiles.at(i).draw();
        // draw Player
        if (punchActiveUntil >= performance.now()) {
            ctx.fillStyle = 'rgba(223, 30, 30, 0.36)';
            ctx.beginPath();
            ctx.ellipse(320, 180, 48, 48, 0, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.drawImage(sprites, 0, 256, 64, 64, 288, 148, 64, 64);
        //draw entities
        for (let i = 0; i < entities.length; i++) entities.at(i).draw();

        ctx.fillStyle = 'rgb(100, 219, 45)';
        ctx.font = "20px monospaced";
        ctx.fillText("Score : " + score, 500, 30);

        ctx.fillStyle = 'rgb(63, 1, 1)';
        ctx.fillRect(20, 320, 600, 20);

        ctx.fillStyle = 'rgb(192, 7, 7)';
        ctx.fillRect(20, 320, hp * 600 / maxhp, 20);

        ctx.fillStyle = 'rgb(2, 2, 2)';
        ctx.font = "15px monospaced";
        ctx.fillText("hp : " + Math.floor(hp), 25, 335);
        
    } else if (menuState == 2) {
        for (let i = 0; i < lilypad.length; i++) {
            if (lilypad.at(i).drawDel()) {
                lilypad.at(i).flip();
            }
        }
    } else if (menuState == 4) {
        for (let i = 0; i < lilypad.length; i++) {
            if (lilypad.at(i).drawDel()) {
                lilypad.at(i).flip();
            }
        }
        // draw 3 Options
        ctx.fillStyle = 'rgb(1, 179, 1)';
        ctx.fillRect(25, 125, 190, 120);
        ctx.fillRect(225, 125, 190, 120);
        ctx.fillRect(425, 125, 190, 120);
        ctx.fillStyle = 'rgb(122, 73, 8)';
        ctx.fillRect(30, 130, 180, 110);
        ctx.fillRect(230, 130, 180, 110);
        ctx.fillRect(430, 130, 180, 110);
        ctx.fillStyle = 'rgb(1, 179, 1)';
        ctx.font = '20px monospaced';
        ctx.fillText(ups.at(0), 120 - ctx.measureText(ups.at(0)).width/2, 180);
        ctx.fillText(ups.at(1), 320 - ctx.measureText(ups.at(1)).width/2, 180);
        ctx.fillText(ups.at(2), 520 - ctx.measureText(ups.at(2)).width/2, 180);

    } else if (menuState == 5) {
        ctx.fillStyle = 'rgb(1, 179, 1)';
        ctx.font = "40px monospaced";
        ctx.fillText("You Died...", 230, 100);
        ctx.font = "20px monospaced";
        ctx.fillText("Score : " + score, 280, 130);
        ctx.fillText("Time : " + Math.floor((saveTime - refTime)/1000) + " seconds", 240, 160);
    }

    for (var i = 0; i < buttons.length; i++) 
        if (buttons.at(i).pageID == menuState) buttons.at(i).drawButton();
        else buttons.at(i).visible = false;

    tickCount++;
}
