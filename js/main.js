"use strict";
var scene;
function init() {
    var p = new Vector4(1, 1, 1, 1);
    var m = Matrix.createMatrix([[1, 2, 2, 1], [0, 1, 2, 0], [0, 0, 1, 3], [1, 1, 1, 1]]);
    p = m.multi(p);
    console.log(p.x(), p.y(), p.z(), p.w());
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
    /*let frame=new Frame(300,300);
    var t=new Triangle(new Vertex(new Vector3(10,10,0)),new Vertex(new Vector3(100, 30,0)),new Vertex(new Vector3(190, 160,0)))
    frame.drawTriangle(t,(t:Triangle,x:number,y:number)=>{
        return new Color(255,0,0);
    })
    frame.showImage();*/
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
        loader.loadModel(str, texture);
        let model = loader.getModel();
        console.timeEnd("Load model");
        let group = model.meshes_group;
        let width = 720;
        let height = 720;
        var scene = new Scene(width, height);
        scene.addModel(model);
        //console.log("sss")
        scene.drawModels();
    };
    /*var frame = new Frame(width, height);
    //frame.setAntialiase(true)
    for (let i=0; i<group.length; i++) {
        
        for (let j=0; j<3; j++) {
            let v0 = group[i].v[j]
            let v1 = group[i].v[(j+1)%3];
            let x0 = (v0.position.x()+1)*width/2.;
            let y0 = (v0.position.y()+1.)*height/2.;
            let x1 = (v1.position.x()+1.)*width/2.;
            let y1 = (v1.position.y()+1.)*height/2.;
            frame.drawLine(new Vector2(x0,y0),new Vector2(x1,y1),new Color(0,0,0));
        }
        let v=[]
        
        for (let j=0; j<3; j++) {
            let v0 = group[i].v[j]
            let x0 = (v0.position.x()+1.)*width/2.;
            let y0 = (v0.position.y()+1.)*height/2.;
            v.push(new Vertex(new Vector3(x0,y0,v0.position.z()),v0.normal,v0.texture_coordinate))
        }
        //console.log(v)
        let t:Triangle=new Triangle(v[0],v[1],v[2],texture)
        //let color=new Color(Math.random()*255,Math.random()*255,Math.random()*255);
        //let color=new Color(255,0,0)
        frame.drawTriangle(t,(t:Triangle,x:number,y:number)=>{
            const p1=t.v[0].position;
            const p2=t.v[1].position;
            const p3=t.v[2].position;
            const c1=t.v[0].texture_coordinate
            const c2=t.v[1].texture_coordinate
            const c3=t.v[2].texture_coordinate
            let {alpha,bata,gamma}=t.getBarycentric(x,y);
            if(c1==null||c2==null||c3==null){
                return new Color()
            }else{
                let color1=texture.getColor(c1.x(),c1.y())
                let color2=texture.getColor(c2.x(),c2.y())
                let color3=texture.getColor(c3.x(),c3.y())
                let result=color1.multi(alpha).add(color2.multi(bata).add(color3.multi(gamma)))
                result.round();
                return result
                let u=c1.x()*alpha+c2.x()*bata+c3.x()*gamma
                let v=c1.y()*alpha+c2.y()*bata+c3.y()*gamma
                return texture.getColor(u,v);
            }
        })
    }
    frame.showImage()
    //console.log(file_reader.result)
}
//console.log(file)*/
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
        this.model_matrix = Matrix.createMatrix([[2.5, 0, 0, 0], [0, 2.5, 0, 0], [0, 0, 2.5, 0], [0, 0, 0, 1]]);
        this.inverse_transpose_model = Matrix.createMatrix([[1 / 2.5, 0, 0, 0], [0, 1 / 2.5, 0, 0], [0, 0, 1 / 2.5, 0], [0, 0, 0, 1]]);
        this.eye_fov = eye_fov;
        this.z_near = z_near;
        this.z_far = z_far;
        this.setProjection(eye_fov, z_near, z_far, 1);
        this.setView(this.position);
        this.rotationByY(40);
    }
    rotationByY(angle) {
        angle = angle / 180 * PI;
        var cos_v = Math.cos(angle);
        var sin_v = Math.sin(angle);
        var model = Matrix.createMatrix([[cos_v, 0, sin_v, 0], [0, 1, 0, 0], [-sin_v, 0, cos_v, 0], [0, 0, 0, 1]]);
        var inverse_transpose_model = Matrix.createMatrix([[cos_v, 0, sin_v, 0], [0, 1, 0, 0], [-sin_v, 0, cos_v, 0], [0, 0, 0, 1]]);
        this.model_matrix = model.multi(this.model_matrix);
        this.inverse_transpose_model = inverse_transpose_model.multi(this.inverse_transpose_model);
    }
    setProjection(eye_fov, z_near, z_far, aspect_ratio) {
        var angle = eye_fov / 180 * PI;
        var high = Math.tan(angle / 2) * z_near * 2;
        console.log(high);
        var width = high * aspect_ratio;
        var length = z_far - z_near;
        var proj = Matrix.createMatrix([[z_near, 0, 0, 0], [0, z_near, 0, 0], [0, 0, z_near + z_far, -z_far * z_near], [0, 0, 1, 0]]);
        var move = Matrix.createMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, -(z_near + z_far) / 2], [0, 0, 0, 1]]);
        var ortho = Matrix.createMatrix([[2 / width, 0, 0, 0], [0, 2 / high, 0, 0], [0, 0, 2 / length, 0], [0, 0, 0, 1]]);
        this.proj = ortho.multi(move).multi(proj);
    }
    setView(position) {
        var x = position.x();
        var y = position.y();
        var z = position.z();
        this.view = Matrix.createMatrix([[1, 0, 0, -x], [0, 1, 0, -y], [0, 0, 1, -z], [0, 0, 0, 1]]);
        this.inverse_view = Matrix.createMatrix([[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]);
        this.inverse_transpose_view = Matrix.createMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [x, y, z, 1]]);
    }
    setPosition(new_position) {
        this.position = Vector.clone(new_position);
    }
    getProjection() {
        return this.proj;
    }
    getView() {
        return this.view;
    }
    getInverseTransposeView() {
        return this.inverse_transpose_view;
    }
    getModel() {
        return this.model_matrix;
    }
    getInverseTransposeModel() {
        return this.inverse_transpose_model;
    }
    getPosition() {
        return this.position;
    }
}
class Color {
    constructor(red = 255, green = 255, blue = 255, alpha = 255) {
        /*this.red = Math.min(Math.max(0,red),255);
        this.green = Math.min(Math.max(0,green),255);
        this.blue = Math.min(Math.max(0,blue),255);
        this.alpha = Math.min(Math.max(0,alpha),255);*/
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
    drawTriangle(info, shader, eye_pos) {
        var eye_pos = eye_pos;
        var t = info.tri;
        var texture = t.texture;
        var view_pos = info.view_pos;
        var lights = info.lights;
        const w = info.z_correction;
        const p1 = t.v[0].position;
        const p2 = t.v[1].position;
        const p3 = t.v[2].position;
        const n1 = t.v[0].normal;
        const n2 = t.v[1].normal;
        const n3 = t.v[2].normal;
        const v1 = view_pos[0];
        const v2 = view_pos[1];
        const v3 = view_pos[2];
        const c1 = t.v[0].texture_coordinate;
        const c2 = t.v[1].texture_coordinate;
        const c3 = t.v[2].texture_coordinate;
        let x_min = Math.floor(Math.min(p1.x(), p2.x(), p3.x()));
        if (x_min < 0) {
            x_min = 0;
        }
        let x_max = Math.ceil(Math.max(p1.x(), p2.x(), p3.x()));
        if (x_max >= this.width) {
            x_max = this.width - 1;
        }
        let y_min = Math.floor(Math.min(p1.y(), p2.y(), p3.y()));
        if (y_min < 0) {
            y_min = 0;
        }
        let y_max = Math.ceil(Math.max(p1.y(), p2.y(), p3.y()));
        if (y_max >= this.height) {
            y_max = this.height - 1;
        }
        for (let x = x_min; x <= x_max; ++x) {
            for (let y = y_min; y <= y_max; ++y) {
                let { alpha, bata, gamma } = t.getBarycentric(x, y);
                if (t.isInsidebyBarycentric(alpha, bata, gamma)) {
                    let w_reciprocal = 1 / (alpha / w[0] + bata / w[1] + gamma / w[2]);
                    let z = p1.z() * alpha / w[0] + p2.z() * bata / w[1] + p3.z() * gamma / w[2];
                    z *= w_reciprocal;
                    let index = this.getIndex(x, y);
                    if (this.z_buffer[index] > z) {
                        var interpolate_tex_coord;
                        var interpolate_color = new Color();
                        if (c1 == null || c2 == null || c3 == null) {
                            interpolate_tex_coord = new Vector2(0, 0);
                            interpolate_color = new Color();
                            console.log("ddd");
                        }
                        else {
                            let u = c1.x() * alpha + c2.x() * bata + c3.x() * gamma;
                            let v = c1.y() * alpha + c2.y() * bata + c3.y() * gamma;
                            interpolate_tex_coord = new Vector2(u, v);
                            /*let color1 = texture.getColor(c1.x(), c1.y())
                            let color2 = texture.getColor(c2.x(), c2.y())
                            let color3 = texture.getColor(c3.x(), c3.y())
                            let interpolate_color = color1.multi(alpha).add(color2.multi(bata).add(color3.multi(gamma)))
                            interpolate_color.round()*/
                        }
                        var interpolate_normal;
                        {
                            let x = n1.x() * alpha + n2.x() * bata + n3.x() * gamma;
                            let y = n1.y() * alpha + n2.y() * bata + n3.y() * gamma;
                            let z = n1.z() * alpha + n2.z() * bata + n3.z() * gamma;
                            interpolate_normal = new Vector3(x, y, z);
                            interpolate_normal.normalized();
                        }
                        var interpolate_position;
                        {
                            let x = v1.x() * alpha + v2.x() * bata + v3.x() * gamma;
                            let y = v1.y() * alpha + v2.y() * bata + v3.y() * gamma;
                            let z = v1.z() * alpha + v2.z() * bata + v3.z() * gamma;
                            interpolate_position = new Vector3(x, y, z);
                        }
                        this.z_buffer[index] = z;
                        this.frame_buffer[x][y] = shader.shade(new ShadeInfo(interpolate_position, interpolate_normal, interpolate_tex_coord, lights, texture, eye_pos));
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
    interpolate(alpha, bata, gamma, vec) {
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
        this.normal = normal;
        if (texture_coordinate) {
            this.texture_coordinate = texture_coordinate;
        }
        else {
            this.texture_coordinate = null;
        }
    }
}
class Mesh {
    constructor(vec, n, texture) {
        this.v = vec;
        this.normal = n;
        this.texture = texture;
    }
}
class Triangle extends Mesh {
    constructor(v1, v2, v3, texture) {
        let v = [v1, v2, v3];
        let a = Vector.sub(v1.position, v2.position);
        let b = Vector.sub(v2.position, v3.position);
        let normal = Vector3.crossProduct(a, b);
        normal.normalized();
        super(v, normal, texture);
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
class ImageLoader {
}
class Light {
    constructor(position, intensity) {
        this.position = position;
        this.intensity = intensity;
    }
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
    print() {
        console.log("Matrix:");
        for (var i = 0; i < this.r(); ++i) {
            var str = '';
            for (var j = 0; j < this.c(); ++j) {
                str += this.m_[i][j] + ' ';
            }
            console.log(str);
        }
        console.log();
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
    squaredNorm() {
        let result = 0;
        let r = this.v_.r();
        for (let i = 0; i < r; ++i) {
            result += Math.pow(this.v_.val(i, 0), 2);
        }
        return result;
    }
    norm() {
        return Math.sqrt(this.squaredNorm());
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
            if (!(b instanceof Vector)) {
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
            if (!(b instanceof Vector)) {
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
    static cwiseProduct(a, b) {
        return new Vector3(a.x() * b.x(), a.y() * b.y(), a.z() * b.z());
    }
    static toVector4(a, w = 1) {
        return new Vector4(a.x(), a.y(), a.z(), w);
    }
}
class Vector4 extends Vector {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        super(x, y, z, w);
    }
    static toVector3(a) {
        var w = a.w();
        if (Math.abs(w) < EPSILON) {
            w = 1;
        }
        return new Vector3(a.x() / w, a.y() / w, a.z() / w);
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
        var n = new Vector3(x, y, z);
        n.normalized();
        this.model.normals.push(n);
    }
    parseTexture(line_items) {
        const x = line_items.length >= 2 ? parseFloat(line_items[1]) : 0.0;
        const y = line_items.length >= 3 ? parseFloat(line_items[2]) : 0.0;
        this.model.texture_coords.push(new Vector2(x, y));
    }
    parseMesh(line_items, texture) {
        const v_len = line_items.length - 1;
        let v = [];
        for (let i = 1; i <= v_len; ++i) {
            const v_infos = line_items[i].split("/");
            var a = parseInt(v_infos[0]);
            var b = parseInt(v_infos[1]);
            var c = parseInt(v_infos[2]);
            v.push(new Vertex(this.model.point_coords[a - 1], this.model.normals[c - 1], this.model.texture_coords[b - 1]));
        }
        this.model.meshes_group.push(new Triangle(v[0], v[1], v[2], texture));
    }
    loadModel(obj, texture) {
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
                    this.parseMesh(line_items, texture);
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
class Scene {
    constructor(width = 500, height = 500) {
        this.models = [];
        this.camera = new Camera(new Vector3(0, 0, -10), 45, 0.1, 50);
        this.lights = [];
        this.shader = new BlinnPhongShader();
        this.width = width;
        this.height = height;
        this.frame = new Frame(width, height);
        this.lights.push(new Light(new Vector3(20, 20, 20), new Vector3(500, 500, 500)));
        this.lights.push(new Light(new Vector3(-20, 20, 0), new Vector3(500, 500, 500)));
    }
    addModel(model) {
        this.models.push(model);
    }
    drawModels() {
        for (var model of this.models) {
            for (var tri of model.meshes_group) {
                var info = this.tranlate(tri);
                //console.log(info)
                this.frame.drawTriangle(info, this.shader, new Vector3(0, 0, 0));
            }
        }
        this.frame.showImage();
    }
    tranlate(tri) {
        var model = this.camera.getModel();
        var view = this.camera.getView();
        var proj = this.camera.getProjection();
        var i_model = this.camera.getInverseTransposeModel();
        var i_view = this.camera.getInverseTransposeView();
        var mv = view.multi(model);
        var mvp = proj.multi(mv);
        var imv = i_view.multi(i_model);
        var v = tri.v;
        var new_v = [];
        var view_pos = [];
        var z_correction = [];
        for (var i = 0; i < 3; ++i) {
            var p = Vector3.toVector4(v[i].position);
            var n = Vector3.toVector4(v[i].normal, 0);
            let vp = mv.multi((p));
            let proj_p = mvp.multi(p);
            let new_n = imv.multi(n);
            let tmp_n = Vector4.toVector3(new_n);
            tmp_n.normalized();
            z_correction.push(proj_p.w());
            new_v.push(new Vertex(Vector4.toVector3(proj_p), tmp_n, v[i].texture_coordinate));
            view_pos.push(Vector4.toVector3(vp));
        }
        var z_far = this.camera.z_far;
        var z_near = this.camera.z_near;
        var f1 = (z_far - z_near) / 2;
        var f2 = (z_far + z_near) / 2;
        for (var i = 0; i < 3; ++i) {
            let x = new_v[i].position.x();
            let y = new_v[i].position.y();
            let z = new_v[i].position.z();
            new_v[i].position.x((x + 1) * this.width / 2);
            new_v[i].position.y((y + 1) * this.height / 2);
            new_v[i].position.z(z * f1 + f2);
            new_v[i].normal.normalized();
        }
        return new DisplayInfo(new Triangle(new_v[0], new_v[1], new_v[2], tri.texture), view_pos, this.lights, z_correction);
    }
}
class DisplayInfo {
    constructor(tri, view_pos, lights, z_correction) {
        this.tri = tri;
        this.view_pos = view_pos;
        this.lights = lights;
        this.z_correction = z_correction;
    }
}
class Shader {
}
class BlinnPhongShader extends Shader {
    shade(info) {
        var texture = info.texture;
        var tex_coord = info.tex_coord;
        var tex_color = texture.getColor(tex_coord.x(), tex_coord.y());
        var ka = new Vector3(0.00005, 0.00005, 0.00005);
        var kd = new Vector3(tex_color.red / 255, tex_color.green / 255, tex_color.blue / 255);
        var ks = new Vector3(0.7937, 0.7937, 0.7937);
        var eye_pos = info.eye_pos;
        var point = info.position;
        var normal = info.normal;
        var color_vec = new Vector3(0, 0, 0);
        var p = 150;
        var lights = info.lights;
        for (var i = 0; i < lights.length; ++i) {
            let light = lights[i];
            let r = Vector.sub(light.position, point);
            let r2 = r.squaredNorm();
            //console.log(r2)
            r.normalized();
            let diffuse_intensity = Vector.div(light.intensity, r2);
            diffuse_intensity = Vector3.cwiseProduct(diffuse_intensity, kd);
            let c = Vector3.dotProduct(normal, r);
            diffuse_intensity = Vector.multi(diffuse_intensity, Math.max(0, c));
            let v = Vector.sub(eye_pos, point);
            v.normalized();
            let h = Vector.add(v, r);
            h.normalized();
            let specular_intensity = Vector.div(light.intensity, r2);
            specular_intensity = Vector3.cwiseProduct(specular_intensity, ks);
            specular_intensity = Vector.multi(specular_intensity, Math.max(0, Math.pow(Vector3.dotProduct(normal, h), p)));
            //specular_intensity=new Vector3(0,0,0)
            let amb_intensity = Vector3.cwiseProduct(light.intensity, ka);
            //amb_intensity=new Vector3(0,0,0)
            let intensity = Vector.add(specular_intensity, diffuse_intensity);
            //intensity=Vector.add(intensity,amb_intensity);
            color_vec = Vector.add(color_vec, intensity);
        }
        return new Color(color_vec.x() * 255, color_vec.y() * 255, color_vec.z() * 255);
    }
}
class ShadeInfo {
    constructor(position, normal, tex_coord, lights, texture, eye_pos) {
        this.position = position;
        this.normal = normal;
        this.tex_coord = tex_coord;
        this.lights = lights;
        this.texture = texture;
        this.eye_pos = eye_pos;
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
        if (u < 0) {
            u += 1;
        }
        tmp = Math.trunc(v);
        v -= tmp;
        if (v < 0) {
            v += 1;
        }
        u = Math.round(u * this.width_);
        v = Math.round(v * this.height_);
        if (u == this.width_) {
            --u;
        }
        if (v == this.height_) {
            --v;
        }
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
        //console.log(image_data.data)
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
const PI = Math.acos(-1);
