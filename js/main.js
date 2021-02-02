"use strict";
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
    let frame = new Frame(300, 300);
    var t = new Triangle(new Vertex(new Vector3(10, 10, 0)), new Vertex(new Vector3(100, 30, 0)), new Vertex(new Vector3(190, 160, 0)));
    frame.drawTriangle(t, (t, x, y) => {
        return new Color(255, 0, 0);
    });
    frame.showImage();
    /*let ctx=Canvas.getCtx()
    Canvas.setWindowSize(512,512)
    ctx.drawImage(<HTMLImageElement>document.getElementById("img"),0,0,512,512)*/
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
    file_reader.onload = (e) => {
        var str = new String(file_reader.result);
        let loader = new ObjLoader();
        loader.loadModel(str);
        let model = loader.getModel();
        console.timeEnd("Load model");
        let group = model.meshes_group;
        let width = 720;
        let height = 720;
        var frame = new Frame(width, height);
        //frame.setAntialiase(true)
        for (let i = 0; i < group.length; i++) {
            /*for (let j=0; j<3; j++) {
                let v0 = group[i].v[j]
                let v1 = group[i].v[(j+1)%3];
                let x0 = (v0.position.x()+1)*width/2.;
                let y0 = (v0.position.y()+1.)*height/2.;
                let x1 = (v1.position.x()+1.)*width/2.;
                let y1 = (v1.position.y()+1.)*height/2.;
                frame.drawLine(new Vector2(x0,y0),new Vector2(x1,y1),new Color(0,0,0));
            }*/
            let v = [];
            for (let j = 0; j < 3; j++) {
                let v0 = group[i].v[j];
                let x0 = (v0.position.x() + 1.) * width / 2.;
                let y0 = (v0.position.y() + 1.) * height / 2.;
                v.push(new Vertex(new Vector3(x0, y0, -v0.position.z()), v0.normal, v0.texture_coordinate));
            }
            //console.log(v)
            let t = new Triangle(v[0], v[1], v[2]);
            //let color=new Color(Math.random()*255,Math.random()*255,Math.random()*255); 
            //let color=new Color(255,0,0)
            frame.drawTriangle(t, (t, x, y) => {
                const p1 = t.v[0].position;
                const p2 = t.v[1].position;
                const p3 = t.v[2].position;
                const c1 = t.v[0].texture_coordinate;
                const c2 = t.v[1].texture_coordinate;
                const c3 = t.v[2].texture_coordinate;
                let { alpha, bata, gamma } = t.getBarycentric(x, y);
                if (c1 == null || c2 == null || c3 == null) {
                    return new Color();
                }
                else {
                    /*let color1=texture.getColor(c1.x(),c1.y())
                    let color2=texture.getColor(c2.x(),c2.y())
                    let color3=texture.getColor(c3.x(),c3.y())
                    let result=color1.multi(alpha).add(color2.multi(bata).add(color3.multi(gamma)))
                    result.round();
                    return result*/
                    let u = c1.x() * alpha + c2.x() * bata + c3.x() * gamma;
                    let v = c1.y() * alpha + c2.y() * bata + c3.y() * gamma;
                    return texture.getColor(u, v);
                }
            });
        }
        frame.showImage();
        //console.log(file_reader.result)
        console.log(count);
    };
    //console.log(file)
}
var texture;
function uploadImg() {
    var e = document.getElementById("img_file");
    var file;
    if (e.files) {
        file = e.files[0];
    }
    else {
        return;
    }
    var file_reader = new FileReader();
    file_reader.readAsDataURL(file);
    file_reader.onload = (e) => {
        let img = document.createElement("img");
        if (e.target == null) {
            return;
        }
        img.src = e.target.result;
        img.onload = (e) => {
            let w = img.naturalWidth;
            let h = img.naturalHeight;
            let data = ImageTool.convertImgToData(img);
            texture = new Texture(data, w, h);
        };
    };
}
class Camera {
    constructor(position, eye_fov, z_near, z_far) {
        this.position = Vector.clone(position);
        this.rotation_matrix = Matrix.createMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
        this.eye_fov = eye_fov;
        this.z_near = z_near;
        this.z_far = z_far;
    }
    setPosition(new_position) {
        this.position = Vector.clone(new_position);
    }
}
class Color {
    constructor(red = 255, green = 255, blue = 255, alpha = 255) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.round();
    }
    add(color) {
        return new Color(this.red + color.red, this.green + color.green, this.blue + color.blue);
    }
    multi(a) {
        return new Color(this.red * a, this.green * a, this.blue * a);
    }
    round() {
        this.red = Math.round(this.red);
        this.blue = Math.round(this.blue);
        this.green = Math.round(this.green);
        this.alpha = Math.round(this.alpha);
    }
}
class Frame {
    constructor(width, height) {
        this.frame_buffer = [];
        this.antialiasing = false;
        for (var i = 0; i < width; ++i) {
            this.frame_buffer[i] = [];
            for (var j = 0; j < height; ++j) {
                this.frame_buffer[i][j] = new Color();
            }
        }
        this.z_buffer = new Array(width * height).fill(Number.MAX_VALUE);
        this.width = width;
        this.height = height;
    }
    checkValid(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    showImage() {
        Canvas.showImage(this);
    }
    setPixel(x, y, color) {
        if (!this.checkValid(x, y)) {
            return;
        }
        //console.log(x,y,color)
        this.frame_buffer[x][y] = color;
    }
    getColor(x, y) {
        if (this.checkValid(x, y)) {
            return this.frame_buffer[x][y];
        }
        else {
            return new Color();
        }
    }
    setAntialiase(b) {
        this.antialiasing = b;
    }
    drawLine(p1, p2, color) {
        let x1 = Math.round(p1.x());
        let x2 = Math.round(p2.x());
        let y1 = Math.round(p1.y());
        let y2 = Math.round(p2.y());
        let steep = false;
        if (Math.abs(x1 - x2) < Math.abs(y1 - y2)) {
            [x1, y1] = [y1, x1];
            [x2, y2] = [y2, x2];
            steep = true;
        }
        if (x1 > x2) {
            [x1, x2] = [x2, x1];
            [y1, y2] = [y2, y1];
        }
        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let derr = dy * 2;
        let dis = (y1 < y2) ? 1 : -1;
        let error = 0;
        let need_vague = false;
        for (let x = x1, y = y1; x <= x2; ++x) {
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
    }
    drawTriangle(t, getColor) {
        const p1 = t.v[0].position;
        const p2 = t.v[1].position;
        const p3 = t.v[2].position;
        let x_min = Math.floor(Math.min(p1.x(), p2.x(), p3.x()));
        let x_max = Math.ceil(Math.max(p1.x(), p2.x(), p3.x()));
        let y_min = Math.floor(Math.min(p1.y(), p2.y(), p3.y()));
        let y_max = Math.ceil(Math.max(p1.y(), p2.y(), p3.y()));
        for (let x = x_min; x <= x_max; ++x) {
            for (let y = y_min; y <= y_max; ++y) {
                let { alpha, bata, gamma } = t.getBarycentric(x, y);
                if (t.isInsidebyBarycentric(alpha, bata, gamma)) {
                    let z = p1.z() * alpha + p2.z() * bata + p3.z() * gamma;
                    let index = this.getIndex(x, y);
                    if (this.z_buffer[index] > z) {
                        this.z_buffer[index] = z;
                        this.frame_buffer[x][y] = getColor(t, x, y);
                    }
                }
            }
        }
    }
    Vague(x, y) {
        let my_color = this.getColor(x, y).multi(0.2);
        let c1 = this.getColor(x - 1, y).multi(0.2);
        let c2 = this.getColor(x + 1, y).multi(0.2);
        let c3 = this.getColor(x, y - 1).multi(0.2);
        let c4 = this.getColor(x - 1, y + 1).multi(0.2);
        my_color = my_color.add(c1).add(c2).add(c3).add(c4);
        my_color.round();
        this.setPixel(x, y, my_color);
    }
    getIndex(x, y) {
        return x * this.width + y;
    }
}
class Vertex {
    constructor(position, normal, texture_coordinate) {
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
}
class Mesh {
    constructor(vec, n) {
        this.v = vec;
        this.normal = n;
    }
}
class Triangle extends Mesh {
    constructor(v1, v2, v3) {
        let v = [v1, v2, v3];
        let a = Vector.sub(v1.position, v2.position);
        let b = Vector.sub(v2.position, v3.position);
        let normal = Vector3.crossProduct(a, b);
        normal.normalized();
        super(v, normal);
    }
    getBarycentric(x, y) {
        let v = [this.v[0].position, this.v[1].position, this.v[2].position];
        let c1 = (x * (v[1].y() - v[2].y()) + (v[2].x() - v[1].x()) * y + v[1].x() * v[2].y() - v[2].x() * v[1].y()) / (v[0].x() * (v[1].y() - v[2].y()) + (v[2].x() - v[1].x()) * v[0].y() + v[1].x() * v[2].y() - v[2].x() * v[1].y());
        let c2 = (x * (v[2].y() - v[0].y()) + (v[0].x() - v[2].x()) * y + v[2].x() * v[0].y() - v[0].x() * v[2].y()) / (v[1].x() * (v[2].y() - v[0].y()) + (v[0].x() - v[2].x()) * v[1].y() + v[2].x() * v[0].y() - v[0].x() * v[2].y());
        let c3 = (x * (v[0].y() - v[1].y()) + (v[1].x() - v[0].x()) * y + v[0].x() * v[1].y() - v[1].x() * v[0].y()) / (v[2].x() * (v[0].y() - v[1].y()) + (v[1].x() - v[0].x()) * v[2].y() + v[0].x() * v[1].y() - v[1].x() * v[0].y());
        return { alpha: c1, bata: c2, gamma: c3 };
    }
    isInside(x, y) {
        let { alpha, bata, gamma } = this.getBarycentric(x, y);
        return this.isInsidebyBarycentric(alpha, bata, gamma);
    }
    isInsidebyBarycentric(alpha, bata, gamma) {
        return !(alpha < -EPSILON || bata < -EPSILON || gamma < -EPSILON);
    }
}
class Rectangle extends Mesh {
    constructor(v1, v2, v3) {
        let v = [v1, v2, v3];
        let a = Vector.sub(v1.position, v2.position);
        let b = Vector.sub(v2.position, v3.position);
        let normal = Vector3.crossProduct(a, b);
        normal.normalized();
        super(v, normal);
    }
}
class ImageLoader {
}
class Material {
    constructor(img_data, name) {
        this.data_ = img_data;
        this.name_ = name;
    }
    get name() {
        return this.name_;
    }
    getColor(x, y) {
        return this.data_[x][y];
    }
}
class Matrix {
    constructor(r, c) {
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
    static createMatrix(m) {
        let result = new Matrix(0);
        result.r_ = m.length;
        result.c_ = m[0].length;
        for (let i = 0; i < result.r_; ++i) {
            result.m_[i] = [];
            for (let j = 0; j < result.c_; ++j) {
                result.m_[i][j] = m[i][j];
            }
        }
        return result;
    }
    val(x, y, value) {
        if (value) {
            this.m_[x][y] = value;
        }
        return this.m_[x][y];
    }
    r() {
        return this.r_;
    }
    c() {
        return this.c_;
    }
    resize(r, c) {
        if (this.r_ > r) {
            this.m_.splice(r, this.r_ - r);
        }
        else if (this.r_ < r) {
            for (let i = this.r_; i < r; ++i) {
                this.m_[i] = [];
            }
        }
        this.r_ = r;
        if (this.c_ > c) {
            for (let i = 0; i < this.r_; ++i) {
                this.m_[i].splice(c, this.c_ - c);
            }
        }
        else if (this.c_ < c) {
            for (let i = 0; i < this.r_; ++i) {
                for (let j = this.c_; j < c; ++j) {
                    this.m_[i][j] = 0;
                }
            }
        }
    }
    multi(v) {
        let result;
        if (v instanceof Matrix) {
            result = new Matrix(this.r(), v.c());
            let r = this.r();
            let c = v.c();
            let l = this.c();
            for (let i = 0; i < r; ++i) {
                for (let j = 0; j < c; ++j) {
                    let t = 0;
                    for (let k = 0; k < l; ++k) {
                        t += this.val(i, k) * v.val(k, j);
                    }
                    result.val(i, j, t);
                }
            }
        }
        else {
            result = Vector.clone(v);
            let r = this.r();
            let l = v.size();
            for (let i = 0; i < r; ++i) {
                let t = 0;
                for (let j = 0; j < l; ++j) {
                    t += this.val(i, j) * v.val(j);
                }
                result.val(i, t);
            }
        }
        return result;
    }
    static clone(m) {
        var k = new Matrix(m.r_, m.c_);
        for (let i = 0; i < k.r_; ++i) {
            for (var j = 0; j < k.c_; ++j) {
                k.m_[i][j] = m.m_[i][j];
            }
        }
        return k;
    }
}
class Vector {
    constructor(...values) {
        this.v_ = new Matrix(values.length, 1);
        for (let i = 0; i < values.length; ++i) {
            this.v_.val(i, 0, values[i]);
        }
    }
    size() {
        return this.v_.r();
    }
    val(i, v) {
        return this.v_.val(i, 0, v);
    }
    normalized() {
        let norm = this.norm();
        let r = this.v_.r();
        for (let i = 0; i < r; ++i) {
            let tmp = this.v_.val(i, 0);
            this.v_.val(i, 0, tmp / norm);
        }
    }
    norm() {
        let result = 0;
        let r = this.v_.r();
        for (let i = 0; i < r; ++i) {
            result += Math.pow(this.v_.val(i, 0), 2);
        }
        return Math.sqrt(result);
    }
    static clone(vec) {
        let tmp = new Vector();
        tmp.v_ = Matrix.clone(vec.v_);
        return tmp;
    }
    static sub(a, b) {
        let tmp = new Vector();
        tmp.v_ = new Matrix(a.v_.r(), 1);
        let r = a.v_.r();
        for (let i = 0; i < r; ++i) {
            tmp.v_.val(i, 0, a.v_.val(i, 0) - b.v_.val(i, 0));
        }
        return tmp;
    }
    static add(a, b) {
        let tmp = new Vector();
        tmp.v_ = new Matrix(a.v_.r(), 1);
        let r = a.v_.r();
        for (let i = 0; i < r; ++i) {
            tmp.v_.val(i, 0, a.v_.val(i, 0) + b.v_.val(i, 0));
        }
        return tmp;
    }
    static multi(a, b) {
        let tmp = new Vector();
        tmp.v_ = new Matrix(a.v_.r(), 1);
        let r = a.v_.r();
        for (let i = 0; i < r; ++i) {
            if (b instanceof Number) {
                tmp.v_.val(i, 0, a.v_.val(i, 0) * b);
            }
            else {
                tmp.v_.val(i, 0, a.v_.val(i, 0) * b.v_.val(i, 0));
            }
        }
        return tmp;
    }
    static div(a, b) {
        let tmp = new Vector();
        tmp.v_ = new Matrix(a.v_.r(), 1);
        let r = a.v_.r();
        for (let i = 0; i < r; ++i) {
            if (b instanceof Number) {
                tmp.v_.val(i, 0, a.v_.val(i, 0) / b);
            }
            else {
                tmp.v_.val(i, 0, a.v_.val(i, 0) / b.v_.val(i, 0));
            }
        }
        return tmp;
    }
    x(val) {
        return this.v_.val(0, 0, val);
    }
    y(val) {
        return this.v_.val(1, 0, val);
    }
    z(val) {
        return this.v_.val(2, 0, val);
    }
    w(val) {
        return this.v_.val(3, 0, val);
    }
}
class Vector2 extends Vector {
    constructor(x = 0, y = 0) {
        super(x, y);
    }
}
class Vector3 extends Vector {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z);
    }
    static crossProduct(a, b) {
        return new Vector3(a.y() * b.z() - a.z() * b.y(), a.z() * b.x() - a.x() * b.z(), a.x() * b.y() - a.y() * b.x());
    }
    static dotProduct(a, b) {
        return a.x() * b.x() + a.y() * b.y() + a.z() * b.z();
    }
}
class Vector4 extends Vector {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(x, y, z, w);
    }
}
class Model {
    constructor() {
        this.point_coords = [];
        this.normals = [];
        this.texture_coords = [];
        this.meshes_group = [];
    }
}
class ObjLoader {
    constructor() {
        this.model = new Model;
    }
    static removeComent(str) {
        var index = str.indexOf("#");
        if (index > -1) {
            return str.substring(0, index);
        }
        else {
            return str;
        }
    }
    parsePoint(line_items) {
        const x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
        const y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
        const z = line_items.length >= 4 ? parseFloat(line_items[3]) : 0.0;
        this.model.point_coords.push(new Vector3(x, y, z));
    }
    parseNormal(line_items) {
        const x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
        const y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
        const z = line_items.length >= 4 ? parseFloat(line_items[3]) : 0.0;
        this.model.normals.push(new Vector3(x, y, z));
    }
    parseTexture(line_items) {
        const x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
        const y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
        this.model.texture_coords.push(new Vector2(x, y));
    }
    parseMesh(line_items) {
        const v_len = line_items.length - 1;
        let v = [];
        for (let i = 1; i <= v_len; ++i) {
            const v_infos = line_items[i].split("/");
            var a = parseInt(v_infos[0]);
            var b = parseInt(v_infos[1]);
            var c = parseInt(v_infos[2]);
            v.push(new Vertex(this.model.point_coords[a - 1], this.model.normals[c - 1], this.model.texture_coords[b - 1]));
        }
        this.model.meshes_group.push(new Triangle(v[0], v[1], v[2]));
    }
    loadModel(obj) {
        let lines = obj.split('\n');
        let len = lines.length;
        for (let i = 0; i < len; ++i) {
            let line = ObjLoader.removeComent(lines[i]);
            let line_items = line.replace(/\s\s+/g, ' ').trim().split(' ');
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
    }
    getModel() {
        return this.model;
    }
}
class Texture {
    constructor(data, width, height) {
        this.data_ = data;
        this.width_ = width;
        this.height_ = height;
    }
    getColor(u, v) {
        let tmp = Math.trunc(u);
        u -= tmp;
        tmp = Math.trunc(v);
        v -= tmp;
        u = Math.round(u * this.width_);
        v = Math.round(v * this.height_);
        return this.data_[u][v];
    }
}
class Canvas {
    static getCtx() {
        var result = this.getCanvas().getContext("2d");
        return result ? result : new CanvasRenderingContext2D();
    }
    static getCanvas() {
        return document.getElementById("canvas");
    }
    static setWindowSize(width, height) {
        var canvas = Canvas.getCanvas();
        canvas.width = width;
        canvas.height = height;
    }
    static showImage(frame) {
        var data = frame.frame_buffer;
        var height = frame.height;
        var width = frame.width;
        this.setWindowSize(width, height);
        var ctx = this.getCtx();
        //var image_data=ctx.createImageData(width,height)
        var image_data = ImageTool.convertToImage(data, width, height);
        ctx.putImageData(image_data, 0, 0);
    }
}
class ImageTool {
    static convertToImage(data, width, height) {
        var image_data = new ImageData(width, height);
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
        return image_data;
    }
    static convertToFrameData(image_data, width, height) {
        var data = [];
        for (var i = 0; i < width; ++i) {
            data[i] = [];
        }
        for (var i = 0; i < height; ++i) {
            for (var j = 0; j < width; ++j) {
                var r = height - i - 1;
                var c = j;
                var index = r * width + c;
                index *= 4;
                data[j][i] = new Color(image_data.data[index], image_data.data[index + 1], image_data.data[index + 2], image_data.data[index + 3]);
                //console.log(data[j][i],image_data.data[index], image_data.data[index + 1],
                //image_data.data[index + 2], image_data.data[index + 3])
            }
        }
        console.log(image_data.data);
        return data;
    }
    static convertImgToData(img) {
        let w = img.naturalWidth;
        let h = img.naturalWidth;
        console.log(w, h);
        let canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        let image_data = ctx.getImageData(0, 0, w, h);
        return this.convertToFrameData(image_data, w, h);
    }
}
const EPSILON = 1e-6;
var count = 0;
