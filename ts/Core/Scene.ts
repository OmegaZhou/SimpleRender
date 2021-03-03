class Scene {
    models: Model[] = [];
    camera: Camera = new Camera(new Vector3(0, 0, -10), 45, 0.1, 50);
    frame: Frame;
    width: number;
    height: number;
    lights: Light[] = [];
    shader: Shader = new BlinnPhongShader();
    constructor(width: number = 500, height: number = 500) {
        this.width = width;
        this.height = height;
        this.frame = new Frame(width, height);

        this.lights.push(new Light(new Vector3(20, 20, 20), new Vector3(1300, 1300, 1300)))
        this.lights.push(new Light(new Vector3(-20, 20, 0), new Vector3(1300, 1300, 1300)))
    }
    setCameraPosition(position:Vector3){
        this.camera.setPosition(position)
    }
    reset() {
        this.models = []
        this.frame.reset()
        this.clearConfig()
    }
    clear(){    
        this.frame.reset()
    }
    clearConfig(){
        this.camera.init()
        this.lights=[]
        this.lights.push(new Light(new Vector3(20, 20, 20), new Vector3(1300, 1300, 1300)))
        this.lights.push(new Light(new Vector3(-20, 20, 0), new Vector3(1300, 1300, 1300)))
        this.shader=new BlinnPhongShader()
    }
    scale(sc:number){
        this.camera.scale(sc)
    }
    move(x:number,y:number,z:number){
        this.camera.move(x,y,z)
    }
    rotate(type: number, angle: number) {
        switch (type) {
            case 0:
                this.camera.rotationByX(angle);
                break;
            case 1:
                this.camera.rotationByY(angle);
                break;
            case 2:
                this.camera.rotationByZ(angle);
                break;
            default:
                break;
        }
    }
    addModel(model: Model) {
        this.models.push(model)
    }
    drawModels() {
        for (var model of this.models) {
            for (var tri of model.meshes_group) {

                var info: DisplayInfo = this.tranlate(tri);
                //console.log(info)
                this.frame.drawTriangle(info, this.shader, new Vector3(0, 0, 0));
            }
        }

        this.frame.showImage();
    }
    tranlate(tri: Triangle) {
        var model = this.camera.getModel()
        var view = this.camera.getView()
        var proj = this.camera.getProjection();
        var i_model = this.camera.getInverseTransposeModel();
        var i_view = this.camera.getInverseTransposeView();
        var mv: Matrix = <Matrix>view.multi(model);
        var mvp: Matrix = <Matrix>proj.multi(mv);
        var imv = <Matrix>i_view.multi(i_model)
        var v = tri.v
        var new_v: Vertex[] = [];
        var view_pos: Vector3[] = [];
        var z_correction: number[] = []
        for (var i = 0; i < 3; ++i) {
            var p = Vector3.toVector4(v[i].position)
            var n: Vector3 = Vector3.toVector4(<Vector3>v[i].normal, 0)
            let vp: Vector4 = <Vector4>mv.multi((p));
            let proj_p: Vector4 = <Vector4>mvp.multi(p);
            let new_n: Vector4 = <Vector4>imv.multi(n);
            let tmp_n = Vector4.toVector3(new_n)
            tmp_n.normalized()

            z_correction.push(proj_p.w())
            new_v.push(new Vertex(Vector4.toVector3(proj_p), tmp_n, v[i].texture_coordinate));
            view_pos.push(Vector4.toVector3(vp))
        }
        var z_far = this.camera.z_far
        var z_near = this.camera.z_near;
        var f1 = (z_far - z_near) / 2;
        var f2 = (z_far + z_near) / 2;
        for (var i = 0; i < 3; ++i) {
            let x = new_v[i].position.x()
            let y = new_v[i].position.y()
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
    constructor(public tri: Triangle, public view_pos: Vector3[], public lights: Light[], public z_correction: number[]) {

    }
}