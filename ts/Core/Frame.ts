
class Color {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    constructor(red: number = 255, green: number = 255, blue: number = 255, alpha: number = 255) {
        /*this.red = Math.min(Math.max(0,red),255);
        this.green = Math.min(Math.max(0,green),255);
        this.blue = Math.min(Math.max(0,blue),255);
        this.alpha = Math.min(Math.max(0,alpha),255);*/
        this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
        this.round()
    }
    add(color: Color) {
        return new Color(this.red + color.red, this.green + color.green, this.blue + color.blue)
    }
    multi(a: number) {
        return new Color(this.red * a, this.green * a, this.blue * a)
    }
    round() {
        this.red = Math.round(this.red)
        this.blue = Math.round(this.blue)
        this.green = Math.round(this.green)
        this.alpha = Math.round(this.alpha)
    }
}

class Frame {
    frame_buffer: Color[][] = [];
    ssaa_buffer: Color[][] = [];
    width: number;
    height: number;
    antialiasing: Boolean = false;
    z_buffer: number[] = [];
    back_color = new Color(245, 245, 245)
    ssaa_times = 2;
    constructor(width: number, height: number) {
        Canvas.setWindowSize(width, height)
        this.width = width;
        this.height = height;
        this.reset()
        this.showImage()
    }
    checkValid(x: number, y: number): Boolean {
        if(this.antialiasing){
            return x >= 0 && x < this.width*this.ssaa_times && y >= 0 && y < this.height*this.ssaa_times;
        }else{
            return x >= 0 && x < this.width && y >= 0 && y < this.height;
        }
        
    }
    showImage() {
        if (this.antialiasing) {
            for (var i = 0; i < this.width; ++i) {
                for (var j = 0; j < this.height; ++j) {
                    var color: Color = new Color(0, 0, 0);
                    for (var m = 0; m < this.ssaa_times; ++m) {
                        for (var n = 0; n < this.ssaa_times; ++n) {
                            color = color.add(this.ssaa_buffer[i * this.ssaa_times + m][j * this.ssaa_times + n]);
                        }
                    }
                    color = color.multi(1 / this.ssaa_times / this.ssaa_times)
                    this.frame_buffer[i][j] = color
                }
            }
        }
        Canvas.showImage(this)
    }
    setPixel(x: number, y: number, color: Color) {
        if (!this.checkValid(x, y)) {
            return;
        }
        //console.log(x,y,color)
        if(this.antialiasing){
            this.ssaa_buffer[x][y]=color
        }else{
            this.frame_buffer[x][y] = color;
        }
        
    }
    getColor(x: number, y: number) {
        if (this.checkValid(x, y)) {
            return this.frame_buffer[x][y]
        } else {
            return new Color();
        }

    }
    setSSAATimes(times: number) {
        this.ssaa_times = Math.round(times)
    }
    setAntialiase(b: Boolean) {
        this.antialiasing = b;
    }
    drawLine(p1: Vector2, p2: Vector2, color: Color) {
        let x1 = Math.round(p1.x());
        let x2 = Math.round(p2.x());
        let y1 = Math.round(p1.y());
        let y2 = Math.round(p2.y());
        if(this.antialiasing){
            x1*=this.ssaa_times;
            x2*=this.ssaa_times;
            y1*=this.ssaa_times;
            y2*=this.ssaa_times;
        }
        let steep = false
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
        for (let x = x1, y = y1; x <= x2; ++x) {
            if (!steep) {
                this.setPixel(x, y, color)
            } else {
                this.setPixel(y, x, color)

            }
            error += derr;
            if (error > dx) {
                y += dis;
                error -= 2 * dx;
            }
        }

    }
    drawCircle(center:Vector2,r:number,color:Color){
        var center_x=center.x()
        var center_y=center.y()
        var tmp_w=this.antialiasing?this.width*this.ssaa_times:this.width;
        var tmp_h=this.antialiasing?this.height*this.ssaa_times:this.height;
        if(this.antialiasing){
            center_x*=this.ssaa_times
            center_y*=this.ssaa_times
            r*=this.ssaa_times;
        }
        
        var x_max=Math.min(center_x+r,tmp_w-1);
        var y_max=Math.min(center_y+r,tmp_h-1);
        var x_min=Math.max(center_x-r,0);
        var y_min=Math.max(center_y-r,0);
        for(var i=x_min;i<=x_max;++i){
            for(var j=y_min;j<=y_max;++j){
                let x=i+0.5-center_x;
                let y=j+0.5-center_y;
                if(x*x+y*y<=r*r){
                    this.setPixel(i,j,color)
                }
            }
        }
    }
    drawTriangle(info: DisplayInfo, shader: Shader, eye_pos: Vector3) {
        var eye_pos = eye_pos
        var t = info.tri;
        var texture = t.texture
        var view_pos = info.view_pos
        var lights = info.lights
        const w = info.z_correction
        const p1 = t.v[0].position;
        const p2 = t.v[1].position;
        const p3 = t.v[2].position;
        const n1 = t.v[0].normal;
        const n2 = t.v[1].normal;
        const n3 = t.v[2].normal;
        const v1 = view_pos[0]
        const v2 = view_pos[1]
        const v3 = view_pos[2];
        const c1 = t.v[0].texture_coordinate
        const c2 = t.v[1].texture_coordinate
        const c3 = t.v[2].texture_coordinate
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
        if (this.antialiasing) {
            x_min *= this.ssaa_times;
            x_max *= this.ssaa_times;
            y_min *= this.ssaa_times;
            y_max *= this.ssaa_times;
            for (var i = 0; i < 3; ++i) {
                let x = t.v[i].position.x()
                let y = t.v[i].position.y()
                t.v[i].position.x(x * this.ssaa_times)
                t.v[i].position.y(y * this.ssaa_times)
            }
        }
        for (let x = x_min; x <= x_max; ++x) {
            for (let y = y_min; y <= y_max; ++y) {
                let { alpha, bata, gamma } = t.getBarycentric(x + 0.5, y + 0.5);
                if (t.isInsidebyBarycentric(alpha, bata, gamma)) {
                    let w_reciprocal = 1 / (alpha / w[0] + bata / w[1] + gamma / w[2])
                    let z = p1.z() * alpha / w[0] + p2.z() * bata / w[1] + p3.z() * gamma / w[2]
                    z *= w_reciprocal;
                    let index = this.getIndex(x, y)
                    if (this.z_buffer[index] > z) {
                        var interpolate_tex_coord: Vector2;
                        var interpolate_color: Color = new Color();
                        if (c1 == null || c2 == null || c3 == null) {
                            interpolate_tex_coord = new Vector2(0, 0);
                            interpolate_color = new Color();
                        } else {
                            let u = c1.x() * alpha + c2.x() * bata + c3.x() * gamma
                            let v = c1.y() * alpha + c2.y() * bata + c3.y() * gamma
                            interpolate_tex_coord = new Vector2(u, v);
                            /*let color1 = texture.getColor(c1.x(), c1.y())
                            let color2 = texture.getColor(c2.x(), c2.y())
                            let color3 = texture.getColor(c3.x(), c3.y())
                            let interpolate_color = color1.multi(alpha).add(color2.multi(bata).add(color3.multi(gamma)))
                            interpolate_color.round()*/
                        }
                        var interpolate_normal: Vector3;
                        {
                            let x = n1.x() * alpha + n2.x() * bata + n3.x() * gamma
                            let y = n1.y() * alpha + n2.y() * bata + n3.y() * gamma
                            let z = n1.z() * alpha + n2.z() * bata + n3.z() * gamma
                            interpolate_normal = new Vector3(x, y, z);
                            interpolate_normal.normalized();
                        }
                        var interpolate_position: Vector3;
                        {
                            let x = v1.x() * alpha + v2.x() * bata + v3.x() * gamma
                            let y = v1.y() * alpha + v2.y() * bata + v3.y() * gamma
                            let z = v1.z() * alpha + v2.z() * bata + v3.z() * gamma
                            interpolate_position = new Vector3(x, y, z);
                        }
                        this.z_buffer[index] = z;
                        if (this.antialiasing) {
                            this.ssaa_buffer[x][y] = shader.shade(new ShadeInfo(interpolate_position, interpolate_normal, interpolate_tex_coord, lights, texture, eye_pos))
                        } else {
                            this.frame_buffer[x][y] = shader.shade(new ShadeInfo(interpolate_position, interpolate_normal, interpolate_tex_coord, lights, texture, eye_pos))
                        }

                    }

                }
            }

        }
    }

    private getIndex(x: number, y: number) {
        if (this.antialiasing) {
            return x * this.width * this.ssaa_times + y
        } else {
            return x * this.width + y
        }

    }
    public clearAntialiaseConfig() {
        this.antialiasing = false
        this.ssaa_times = 2
    }
    public reset() {
        var width = this.width
        var height = this.height
        for (var i = 0; i < width; ++i) {
            this.frame_buffer[i] = [];
            for (var j = 0; j < height; ++j) {
                this.frame_buffer[i][j] = this.back_color;
            }
        }
        for (var i = 0; i < width * this.ssaa_times; ++i) {
            this.ssaa_buffer[i] = [];
            for (var j = 0; j < height * this.ssaa_times; ++j) {
                this.ssaa_buffer[i][j] = this.back_color;
            }
        }
        if (this.antialiasing) {
            this.z_buffer = new Array(width * height * this.ssaa_times * this.ssaa_times).fill(Number.MAX_VALUE)
        } else {
            this.z_buffer = new Array(width * height).fill(Number.MAX_VALUE)
        }

    }

}