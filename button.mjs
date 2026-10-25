export class Button {
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
    alignment = "";

    constructor(x, y, width, height, text, pageID, functionality, fontSize, borderWidth, alignment) {
        this.x = x;
        this.y = y;
        this.func = functionality;
        this.width = width;
        this.height = height;
        this.text = text;
        this.pageID = pageID;
        this.fontSize = fontSize;
        this.borderWidth = borderWidth;
        this.alignment = alignment;
    }

    drawButton(width, height, ctx) {
        let xy = this.align(width, height);

        ctx.fillStyle = 'rgb(102, 177, 68)';
        ctx.fillRect(xy.x - this.borderWidth/2, xy.y - this.borderWidth/2, this.width + this.borderWidth, this.height + this.borderWidth);
        ctx.fillStyle = 'rgb(122, 73, 8)';
        ctx.fillRect(xy.x, xy.y, this.width, this.height);
        ctx.fillStyle = 'rgb(102, 177, 68)';
        ctx.font = `${this.fontSize}px monospace`;
        ctx.fillText(this.text, xy.x - ctx.measureText(this.text).width/2 + this.width/2, xy.y + this.fontSize / 3 + this.height/2);
        this.visible = true;
    }

    align(width, height) {
        let x = this.x;
        let y = this.y;

        switch (this.alignment) {
            case "top-center":
                x += width/2 - this.width/2;
                break;
            case "bottom-center":
                x += width/2 - this.width/2;
                y = height - this.height + y;
                break;
            case "top-left":
                break;
            case "bottom-left":
                y = height - this.height + y;
                break;
            case "top-right":
                x = width - this.width + x;
                break;
            case "bottom-right":
                x = width - this.width + x;
                y = height - this.height + y;
                break;
            case "center-center":
                x += width/2 - this.width/2;
                y += height/2 - this.height/2;
                break;
            default:
        }

        return {x, y};
    }

    inBounds(xpos, ypos, width, height) {
        let xy = this.align(width, height);

        if (xpos > xy.x && xpos < xy.x + this.width && ypos > xy.y && ypos < xy.y + this.height) return true;
        else return false;
    }
}