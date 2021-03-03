
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
        this.red=red
        this.green=green
        this.blue=blue
        this.alpha=alpha
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
    width: number;
    height: number;
    antialiasing: Boolean = false;
    z_buffer: number[]=[];
    back_color=new Color(245,245,245)
    constructor(width: number, height: number) {
        Canvas.setWindowSize(width,height)
        this.width = width;
        this.height = height;
        this.reset()
        this.showImage()
    }
    checkValid(x: number, y: number): Boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    showImage() {
        Canvas.showImage(this)
    }
    setPixel(x: number, y: number, color: Color) {
        if (!this.checkValid(x, y)) {
            return;
        }
        //console.log(x,y,color)
        this.frame_buffer[x][y] = color;
    }
    getColor(x: number, y: number) {
        if (this.checkValid(x, y)) {
            return this.frame_buffer[x][y]
        } else {
            return new Color();
        }

    }
    setAntialiase(b: Boolean) {
        this.antialiasing = b;
    }
    drawLine(p1: Vector2, p2: Vector2, color: Color) {
        let x1 = Math.round(p1.x());
        let x2 = Math.round(p2.x());
        let y1 = Math.round(p1.y());
        let y2 = Math.round(p2.y());
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
        let need_vague = false
        for (let x = x1, y = y1; x <= x2; ++x) {
            if (!steep) {
                this.setPixel(x, y, color)
                if (this.antialiasing) {
                    if (need_vague) {
                        this.Vague(x - 1, y);
                        this.Vague(x, y - dis);
                        need_vague = false
                    } else {
                        this.Vague(x, y - dis);
                        this.Vague(x, y + dis);
                    }
                }


            } else {
                this.setPixel(y, x, color)
                if (this.antialiasing) {
                    if (need_vague) {
                        this.Vague(y, x - 1);
                        this.Vague(y - dis, x);
                        need_vague = false
                    } else {
                        this.Vague(y - dis, x);
                        this.Vague(y + dis, x);
                    }
                }

            }
            error += derr;
            if (error > dx) {
                need_vague = true
                y += dis;
                error -= 2 * dx;
            }
        }

    }
    drawTriangle(info: DisplayInfo, shader: Shader,eye_pos:Vector3) {
        var eye_pos=eye_pos
        var t = info.tri;
        var texture=t.texture
        var view_pos = info.view_pos
        var lights = info.lights
        const w=info.z_correction
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
        if(x_min<0){
            x_min=0;
        }
        let x_max = Math.ceil(Math.max(p1.x(), p2.x(), p3.x()));
        if(x_max>=this.width){
            x_max=this.width-1;
        }
        let y_min = Math.floor(Math.min(p1.y(), p2.y(), p3.y()));
        if(y_min<0){
            y_min=0;
        }
        let y_max = Math.ceil(Math.max(p1.y(), p2.y(), p3.y()));
        if(y_max>=this.height){
            y_max=this.height-1;
        }
        for (let x = x_min; x <= x_max; ++x) {
            for (let y = y_min; y <= y_max; ++y) {
                let { alpha, bata, gamma } = t.getBarycentric(x, y);
                if (t.isInsidebyBarycentric(alpha, bata, gamma)) {
                    let w_reciprocal=1/(alpha/w[0]+bata/w[1]+gamma/w[2])
                    let z = p1.z() * alpha/w[0] + p2.z() * bata/w[1] + p3.z() * gamma/w[2]
                    z*=w_reciprocal;
                    let index = this.getIndex(x, y)
                    if (this.z_buffer[index] > z) {
                        var interpolate_tex_coord: Vector2;
                        var interpolate_color: Color=new Color();
                        if (c1 == null || c2 == null || c3 == null) {
                            interpolate_tex_coord = new Vector2(0, 0);
                            interpolate_color = new Color();
                            console.log("ddd")
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
                        this.frame_buffer[x][y] = shader.shade(new ShadeInfo(interpolate_position, interpolate_normal, interpolate_tex_coord, lights,texture,eye_pos))
                    }

                }
            }

        }
    }
    private Vague(x: number, y: number) {
        let my_color = this.getColor(x, y).multi(0.2)
        let c1 = this.getColor(x - 1, y).multi(0.2)
        let c2 = this.getColor(x + 1, y).multi(0.2)
        let c3 = this.getColor(x, y - 1).multi(0.2)
        let c4 = this.getColor(x - 1, y + 1).multi(0.2)
        my_color = my_color.add(c1).add(c2).add(c3).add(c4);
        my_color.round();
        this.setPixel(x, y, my_color);
    }
    private getIndex(x: number, y: number) {
        return x * this.width + y
    }
    public reset(){
        var width=this.width
        var height=this.height
        for (var i = 0; i < width; ++i) {
            this.frame_buffer[i] = [];
            for (var j = 0; j < height; ++j) {
                this.frame_buffer[i][j] = this.back_color;
            }
        }
        this.z_buffer = new Array(width * height).fill(Number.MAX_VALUE)
    }
    
}