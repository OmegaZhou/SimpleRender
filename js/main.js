"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function init() {
    /**var frame = new Frame(300, 300);

    frame.drawLine(new Vector2(0, 0), new Vector2(70, 210), new Color(255, 0, 0));
    frame.setAntialiase(true)
    frame.drawLine(new Vector2(30, 0), new Vector2(100, 210), new Color(255, 0, 0));
    //frame.drawLine(new Vector2(0,1.2),new Vector2(0,280.4),new Color(0,255,0));
    //frame.drawLine(new Vector2(1.2,0),new Vector2(280.4,0),new Color(255,0,0));
    frame.showImage();
    var canvas = <HTMLCanvasElement>document.getElementById("canvas")
    var context = canvas.getContext("2d")
    if (context != null) {
        context.moveTo(60, 300);       //设置起点状态
        context.lineTo(130, 90);       //设置末端状态
        context.lineWidth = 1;          //设置线宽状态
        context.strokeStyle = '#FF0000';  //设置线的颜色状态
        context.stroke();               //进行绘制
    }*/
    var frame = new Frame(200, 200);
    var t = new Triangle(new Vertex(new Vector3(10, 10, 0)), new Vertex(new Vector3(100, 30, 0)), new Vertex(new Vector3(190, 160, 0)));
    frame.drawTriangle(t, function (t, x, y) {
        return new Color(255, 0, 0);
    });
    frame.showImage();
}
function upload() {
    var e = document.getElementById("model_file");
    var file;
    if (e.files) {
        file = e.files[0];
    }
    else {
        return;
    }
    var file_reader = new FileReader();
    console.time("Load model");
    file_reader.readAsBinaryString(file);
    file_reader.onload = function (e) {
        var str = new String(file_reader.result);
        var loader = new ObjLoader();
        loader.loadModel(str);
        var model = loader.getModel();
        console.timeEnd("Load model");
        var group = model.meshes_group;
        var width = 720;
        var height = 720;
        var frame = new Frame(width, height);
        //frame.setAntialiase(true)
        console.time("Draw triangle");
        var _loop_1 = function (i) {
            /*for (let j=0; j<3; j++) {
                let v0 = group[i].v[j]
                let v1 = group[i].v[(j+1)%3];
                let x0 = (v0.position.x()+1)*width/2.;
                let y0 = (v0.position.y()+1.)*height/2.;
                let x1 = (v1.position.x()+1.)*width/2.;
                let y1 = (v1.position.y()+1.)*height/2.;
                frame.drawLine(new Vector2(x0,y0),new Vector2(x1,y1),new Color(0,0,0));
            }*/
            var v = [];
            for (var j = 0; j < 3; j++) {
                var v0 = group[i].v[j];
                var x0 = (v0.position.x() + 1.) * width / 2.;
                var y0 = (v0.position.y() + 1.) * height / 2.;
                v.push(new Vertex(new Vector3(x0, y0)));
            }
            //console.log(v)
            var t = new Triangle(v[0], v[1], v[2]);
            var color = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
            //let color=new Color(255,0,0)
            frame.drawTriangle(t, function (t, x, y) {
                return color;
            });
        };
        for (var i = 0; i < group.length; i++) {
            _loop_1(i);
        }
        frame.showImage();
        //console.log(file_reader.result)
        console.timeEnd("Draw triangle");
        console.log(count);
    };
    //console.log(file)
}
var Camera = /** @class */ (function () {
    function Camera(position, eye_fov, z_near, z_far) {
        this.position = Vector.clone(position);
        this.rotation_matrix = Matrix.createMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
        this.eye_fov = eye_fov;
        this.z_near = z_near;
        this.z_far = z_far;
    }
    Camera.prototype.setPosition = function (new_position) {
        this.position = Vector.clone(new_position);
    };
    return Camera;
}());
var Vertex = /** @class */ (function () {
    function Vertex(position, normal, texture_coordinate) {
        /*this.position = Vector.clone(position);
        this.normal = normal?Vector.clone(normal):null;
        if (texture_coordinate) {
            this.texture_coordinate = Vector.clone(texture_coordinate);
        } else {
            this.texture_coordinate = null;
        }*/
        this.position = position;
        this.normal = normal ? normal : null;
        if (texture_coordinate) {
            this.texture_coordinate = texture_coordinate;
        }
        else {
            this.texture_coordinate = null;
        }
    }
    return Vertex;
}());
var Mesh = /** @class */ (function () {
    function Mesh(vec, n) {
        this.v = vec;
        this.normal = n;
    }
    return Mesh;
}());
var Triangle = /** @class */ (function (_super) {
    __extends(Triangle, _super);
    function Triangle(v1, v2, v3) {
        var _this = this;
        var v = [v1, v2, v3];
        var a = Vector.sub(v1.position, v2.position);
        var b = Vector.sub(v2.position, v3.position);
        var normal = Vector3.crossProduct(a, b);
        normal.normalized();
        _this = _super.call(this, v, normal) || this;
        return _this;
    }
    Triangle.prototype.getBarycentric = function (x, y) {
        var v = [this.v[0].position, this.v[1].position, this.v[2].position];
        var c1 = (x * (v[1].y() - v[2].y()) + (v[2].x() - v[1].x()) * y + v[1].x() * v[2].y() - v[2].x() * v[1].y()) / (v[0].x() * (v[1].y() - v[2].y()) + (v[2].x() - v[1].x()) * v[0].y() + v[1].x() * v[2].y() - v[2].x() * v[1].y());
        var c2 = (x * (v[2].y() - v[0].y()) + (v[0].x() - v[2].x()) * y + v[2].x() * v[0].y() - v[0].x() * v[2].y()) / (v[1].x() * (v[2].y() - v[0].y()) + (v[0].x() - v[2].x()) * v[1].y() + v[2].x() * v[0].y() - v[0].x() * v[2].y());
        var c3 = (x * (v[0].y() - v[1].y()) + (v[1].x() - v[0].x()) * y + v[0].x() * v[1].y() - v[1].x() * v[0].y()) / (v[2].x() * (v[0].y() - v[1].y()) + (v[1].x() - v[0].x()) * v[2].y() + v[0].x() * v[1].y() - v[1].x() * v[0].y());
        return { alpha: c1, bata: c2, gamma: c3 };
    };
    Triangle.prototype.isInside = function (x, y) {
        var _a = this.getBarycentric(x, y), alpha = _a.alpha, bata = _a.bata, gamma = _a.gamma;
        return !(alpha < -EPSILON || bata < -EPSILON || gamma < -EPSILON);
    };
    return Triangle;
}(Mesh));
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
        this.round();
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
        for (var i = 0; i < width; ++i) {
            this.frame_buffer[i] = [];
            for (var j = 0; j < height; ++j) {
                this.frame_buffer[i][j] = new Color();
            }
        }
        this.width = width;
        this.height = height;
    }
    Frame.prototype.checkValid = function (x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    };
    Frame.prototype.showImage = function () {
        Canvas.showImage(this);
    };
    Frame.prototype.setPixel = function (x, y, color) {
        if (!this.checkValid(x, y)) {
            return;
        }
        //console.log(x,y,color)
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
        var x1 = Math.round(p1.x());
        var x2 = Math.round(p2.x());
        var y1 = Math.round(p1.y());
        var y2 = Math.round(p2.y());
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
            if (!steep) {
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
    Frame.prototype.drawTriangle = function (t, getColor) {
        var p1 = t.v[0].position;
        var p2 = t.v[1].position;
        var p3 = t.v[2].position;
        var x_min = Math.floor(Math.min(p1.x(), p2.x(), p3.x()));
        var x_max = Math.ceil(Math.max(p1.x(), p2.x(), p3.x()));
        var y_min = Math.floor(Math.min(p1.y(), p2.y(), p3.y()));
        var y_max = Math.ceil(Math.max(p1.y(), p2.y(), p3.y()));
        var k = true;
        for (var x = x_min; x <= x_max; ++x) {
            for (var y = y_min; y <= y_max; ++y) {
                if (t.isInside(x, y)) {
                    this.frame_buffer[x][y] = getColor(t, x, y);
                    k = false;
                }
                ++count;
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
var Matrix = /** @class */ (function () {
    function Matrix(r, c) {
        this.m_ = [];
        if (!c) {
            c = r;
        }
        this.r_ = r;
        this.c_ = c;
        for (var i = 0; i < r; ++i) {
            this.m_[i] = [];
            for (var j = 0; j < c; ++j) {
                this.m_[i][j] = 0;
            }
        }
    }
    Matrix.createMatrix = function (m) {
        var result = new Matrix(0);
        result.r_ = m.length;
        result.c_ = m[0].length;
        for (var i = 0; i < result.r_; ++i) {
            result.m_[i] = [];
            for (var j = 0; j < result.c_; ++j) {
                result.m_[i][j] = m[i][j];
            }
        }
        return result;
    };
    Matrix.prototype.val = function (x, y, value) {
        if (value) {
            this.m_[x][y] = value;
        }
        return this.m_[x][y];
    };
    Matrix.prototype.r = function () {
        return this.r_;
    };
    Matrix.prototype.c = function () {
        return this.c_;
    };
    Matrix.prototype.resize = function (r, c) {
        if (this.r_ > r) {
            this.m_.splice(r, this.r_ - r);
        }
        else if (this.r_ < r) {
            for (var i = this.r_; i < r; ++i) {
                this.m_[i] = [];
            }
        }
        this.r_ = r;
        if (this.c_ > c) {
            for (var i = 0; i < this.r_; ++i) {
                this.m_[i].splice(c, this.c_ - c);
            }
        }
        else if (this.c_ < c) {
            for (var i = 0; i < this.r_; ++i) {
                for (var j = this.c_; j < c; ++j) {
                    this.m_[i][j] = 0;
                }
            }
        }
    };
    Matrix.prototype.multi = function (v) {
        var result;
        if (v instanceof Matrix) {
            result = new Matrix(this.r(), v.c());
            var r = this.r();
            var c = v.c();
            var l = this.c();
            for (var i = 0; i < r; ++i) {
                for (var j = 0; j < c; ++j) {
                    var t = 0;
                    for (var k = 0; k < l; ++k) {
                        t += this.val(i, k) * v.val(k, j);
                    }
                    result.val(i, j, t);
                }
            }
        }
        else {
            result = Vector.clone(v);
            var r = this.r();
            var l = v.size();
            for (var i = 0; i < r; ++i) {
                var t = 0;
                for (var j = 0; j < l; ++j) {
                    t += this.val(i, j) * v.val(j);
                }
                result.val(i, t);
            }
        }
        return result;
    };
    Matrix.clone = function (m) {
        var k = new Matrix(m.r_, m.c_);
        for (var i = 0; i < k.r_; ++i) {
            for (var j = 0; j < k.c_; ++j) {
                k.m_[i][j] = m.m_[i][j];
            }
        }
        return k;
    };
    return Matrix;
}());
var Vector = /** @class */ (function () {
    function Vector() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this.v_ = new Matrix(values.length, 1);
        for (var i = 0; i < values.length; ++i) {
            this.v_.val(i, 0, values[i]);
        }
    }
    Vector.prototype.size = function () {
        return this.v_.r();
    };
    Vector.prototype.val = function (i, v) {
        return this.v_.val(i, 0, v);
    };
    Vector.prototype.normalized = function () {
        var norm = this.norm();
        var r = this.v_.r();
        for (var i = 0; i < r; ++i) {
            var tmp = this.v_.val(i, 0);
            this.v_.val(i, 0, tmp / norm);
        }
    };
    Vector.prototype.norm = function () {
        var result = 0;
        var r = this.v_.r();
        for (var i = 0; i < r; ++i) {
            result += Math.pow(this.v_.val(i, 0), 2);
        }
        return Math.sqrt(result);
    };
    Vector.clone = function (vec) {
        var tmp = new Vector();
        tmp.v_ = Matrix.clone(vec.v_);
        return tmp;
    };
    Vector.sub = function (a, b) {
        var tmp = new Vector();
        tmp.v_ = new Matrix(a.v_.r(), 1);
        var r = a.v_.r();
        for (var i = 0; i < r; ++i) {
            tmp.v_.val(i, 0, a.v_.val(i, 0) - b.v_.val(i, 0));
        }
        return tmp;
    };
    Vector.add = function (a, b) {
        var tmp = new Vector();
        tmp.v_ = new Matrix(a.v_.r(), 1);
        var r = a.v_.r();
        for (var i = 0; i < r; ++i) {
            tmp.v_.val(i, 0, a.v_.val(i, 0) + b.v_.val(i, 0));
        }
        return tmp;
    };
    Vector.multi = function (a, b) {
        var tmp = new Vector();
        tmp.v_ = new Matrix(a.v_.r(), 1);
        var r = a.v_.r();
        for (var i = 0; i < r; ++i) {
            if (b instanceof Number) {
                tmp.v_.val(i, 0, a.v_.val(i, 0) * b);
            }
            else {
                tmp.v_.val(i, 0, a.v_.val(i, 0) * b.v_.val(i, 0));
            }
        }
        return tmp;
    };
    Vector.div = function (a, b) {
        var tmp = new Vector();
        tmp.v_ = new Matrix(a.v_.r(), 1);
        var r = a.v_.r();
        for (var i = 0; i < r; ++i) {
            if (b instanceof Number) {
                tmp.v_.val(i, 0, a.v_.val(i, 0) / b);
            }
            else {
                tmp.v_.val(i, 0, a.v_.val(i, 0) / b.v_.val(i, 0));
            }
        }
        return tmp;
    };
    Vector.prototype.x = function (val) {
        return this.v_.val(0, 0, val);
    };
    Vector.prototype.y = function (val) {
        return this.v_.val(1, 0, val);
    };
    Vector.prototype.z = function (val) {
        return this.v_.val(2, 0, val);
    };
    Vector.prototype.w = function (val) {
        return this.v_.val(3, 0, val);
    };
    return Vector;
}());
var Vector2 = /** @class */ (function (_super) {
    __extends(Vector2, _super);
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return _super.call(this, x, y) || this;
    }
    return Vector2;
}(Vector));
var Vector3 = /** @class */ (function (_super) {
    __extends(Vector3, _super);
    function Vector3(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        return _super.call(this, x, y, z) || this;
    }
    Vector3.crossProduct = function (a, b) {
        return new Vector3(a.y() * b.z() - a.z() * b.y(), a.z() * b.x() - a.x() * b.z(), a.x() * b.y() - a.y() * b.x());
    };
    Vector3.dotProduct = function (a, b) {
        return a.x() * b.x() + a.y() * b.y() + a.z() * b.z();
    };
    return Vector3;
}(Vector));
var Vector4 = /** @class */ (function (_super) {
    __extends(Vector4, _super);
    function Vector4(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        return _super.call(this, x, y, z, w) || this;
    }
    return Vector4;
}(Vector));
var Model = /** @class */ (function () {
    function Model() {
        this.point_coords = [];
        this.normals = [];
        this.texture_coords = [];
        this.meshes_group = [];
    }
    return Model;
}());
var ObjLoader = /** @class */ (function () {
    function ObjLoader() {
        this.model = new Model;
    }
    ObjLoader.removeComent = function (str) {
        var index = str.indexOf("#");
        if (index > -1) {
            return str.substring(0, index);
        }
        else {
            return str;
        }
    };
    ObjLoader.prototype.parsePoint = function (line_items) {
        var x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
        var y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
        var z = line_items.length >= 4 ? parseFloat(line_items[3]) : 0.0;
        this.model.point_coords.push(new Vector3(x, y, z));
    };
    ObjLoader.prototype.parseNormal = function (line_items) {
        var x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
        var y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
        var z = line_items.length >= 4 ? parseFloat(line_items[3]) : 0.0;
        this.model.normals.push(new Vector3(x, y, z));
    };
    ObjLoader.prototype.parseTexture = function (line_items) {
        var x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
        var y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
        this.model.texture_coords.push(new Vector2(x, y));
    };
    ObjLoader.prototype.parseMesh = function (line_items) {
        var v_len = line_items.length - 1;
        var v = [];
        for (var i = 1; i <= v_len; ++i) {
            var v_infos = line_items[i].split("/");
            var a = parseInt(v_infos[0]);
            var b = parseInt(v_infos[1]);
            var c = parseInt(v_infos[2]);
            v.push(new Vertex(this.model.point_coords[a - 1], this.model.normals[c - 1], this.model.texture_coords[b - 1]));
        }
        this.model.meshes_group.push(new Triangle(v[0], v[1], v[2]));
    };
    ObjLoader.prototype.loadModel = function (obj) {
        var lines = obj.split('\n');
        var len = lines.length;
        for (var i = 0; i < len; ++i) {
            var line = ObjLoader.removeComent(lines[i]);
            var line_items = line.replace(/\s\s+/g, ' ').trim().split(' ');
            switch (line_items[0].toLowerCase()) {
                case "v":
                    this.parsePoint(line_items);
                    break;
                case "vn":
                    this.parseNormal(line_items);
                    break;
                case "vt":
                    this.parseTexture(line_items);
                    break;
                case "f":
                    this.parseMesh(line_items);
                    break;
                default:
                    break;
            }
        }
    };
    ObjLoader.prototype.getModel = function () {
        return this.model;
    };
    return ObjLoader;
}());
var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    Canvas.getCtx = function () {
        var result = this.getCanvas().getContext("2d");
        return result ? result : new CanvasRenderingContext2D();
    };
    Canvas.getCanvas = function () {
        return document.getElementById("canvas");
    };
    Canvas.setWindowSize = function (width, height) {
        var canvas = Canvas.getCanvas();
        canvas.width = width;
        canvas.height = height;
    };
    Canvas.showImage = function (frame) {
        var data = frame.frame_buffer;
        var height = frame.height;
        var width = frame.width;
        this.setWindowSize(width, height);
        var ctx = this.getCtx();
        var image_data = ctx.createImageData(width, height);
        for (var i = 0; i < height; ++i) {
            for (var j = 0; j < width; ++j) {
                var r = height - i - 1;
                var c = j;
                var index = r * width + c;
                index *= 4;
                image_data.data[index] = data[j][i].red;
                image_data.data[index + 1] = data[j][i].green;
                image_data.data[index + 2] = data[j][i].blue;
                image_data.data[index + 3] = data[j][i].alpha;
            }
        }
        ctx.putImageData(image_data, 0, 0);
    };
    return Canvas;
}());
var EPSILON = 1e-6;
var count = 0;
