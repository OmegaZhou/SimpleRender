"use strict";
var Color = /** @class */ (function () {
    function Color(red, green, blue, alpha) {
        if (red === void 0) { red = 255; }
        if (green === void 0) { green = 255; }
        if (blue === void 0) { blue = 255; }
        if (alpha === void 0) { alpha = 255; }
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    Color.prototype.add = function (color) {
        return new Color(this.red + color.red, this.green + color.green, this.blue + color.blue);
    };
    Color.prototype.multi = function (a) {
        return new Color(this.red * a, this.green * a, this.blue * a);
    };
    Color.prototype.round = function () {
        this.red = Math.round(this.red);
        this.blue = Math.round(this.blue);
        this.green = Math.round(this.green);
        this.alpha = Math.round(this.alpha);
    };
    return Color;
}());
var Frame = /** @class */ (function () {
    function Frame(width, height) {
        this.frame_buffer = [];
        this.antialiasing = false;
        for (var i = 0; i < height; ++i) {
            this.frame_buffer[i] = [];
            for (var j = 0; j < width; ++j) {
                this.frame_buffer[i][j] = new Color();
            }
        }
        this.width = width;
        this.height = height;
    }
    Frame.prototype.checkValid = function (x, y) {
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    };
    Frame.prototype.showImage = function () {
        Canvas.showImage(this);
    };
    Frame.prototype.setPixel = function (x, y, color) {
        if (!this.checkValid(x, y)) {
            return;
        }
        this.frame_buffer[x][y] = color;
    };
    Frame.prototype.getColor = function (x, y) {
        if (this.checkValid(x, y)) {
            return this.frame_buffer[x][y];
        }
        else {
            return new Color();
        }
    };
    Frame.prototype.setAntialiase = function (b) {
        this.antialiasing = b;
    };
    Frame.prototype.drawLine = function (p1, p2, color) {
        var _a, _b, _c, _d;
        var x1 = Math.round(p1.x);
        var x2 = Math.round(p2.x);
        var y1 = Math.round(p1.y);
        var y2 = Math.round(p2.y);
        var steep = false;
        if (Math.abs(x1 - x2) < Math.abs(y1 - y2)) {
            _a = [y1, x1], x1 = _a[0], y1 = _a[1];
            _b = [y2, x2], x2 = _b[0], y2 = _b[1];
            steep = true;
        }
        if (x1 > x2) {
            _c = [x2, x1], x1 = _c[0], x2 = _c[1];
            _d = [y2, y1], y1 = _d[0], y2 = _d[1];
        }
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var derr = dy * 2;
        var dis = (y1 < y2) ? 1 : -1;
        var error = 0;
        var need_vague = false;
        for (var x = x1, y = y1; x <= x2; ++x) {
            if (steep) {
                this.setPixel(x, y, color);
                if (this.antialiasing) {
                    if (need_vague) {
                        this.Vague(x - 1, y);
                        this.Vague(x, y - dis);
                        need_vague = false;
                    }
                    else {
                        this.Vague(x, y - dis);
                        this.Vague(x, y + dis);
                    }
                }
            }
            else {
                this.setPixel(y, x, color);
                if (this.antialiasing) {
                    if (need_vague) {
                        this.Vague(y, x - 1);
                        this.Vague(y - dis, x);
                        need_vague = false;
                    }
                    else {
                        this.Vague(y - dis, x);
                        this.Vague(y + dis, x);
                    }
                }
            }
            error += derr;
            if (error > dx) {
                need_vague = true;
                y += dis;
                error -= 2 * dx;
            }
        }
    };
    Frame.prototype.Vague = function (x, y) {
        var my_color = this.getColor(x, y).multi(0.2);
        var c1 = this.getColor(x - 1, y).multi(0.2);
        var c2 = this.getColor(x + 1, y).multi(0.2);
        var c3 = this.getColor(x, y - 1).multi(0.2);
        var c4 = this.getColor(x - 1, y + 1).multi(0.2);
        my_color = my_color.add(c1).add(c2).add(c3).add(c4);
        my_color.round();
        this.setPixel(x, y, my_color);
    };
    return Frame;
}());
