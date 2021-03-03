class Camera {
    position!: Vector3;
    model_matrix!: Matrix;
    inverse_transpose_model!: Matrix;
    eye_fov: number;
    z_near: number;
    z_far: number;
    proj!: Matrix;
    view!: Matrix;
    inverse_view!: Matrix
    inverse_transpose_view!: Matrix;
    origin_position:Vector3
    constructor(position: Vector3, eye_fov: number, z_near: number, z_far: number) {
        this.origin_position=position
        this.eye_fov = eye_fov;
        this.z_near = z_near;
        this.z_far = z_far;
        this.init()
        
    }
    init(){
        this.model_matrix=Matrix.createMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
        this.inverse_transpose_model=Matrix.createMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
        this.setProjection(this.eye_fov, this.z_near, this.z_far, 1);
        this.setPosition(this.origin_position)
        this.rotationByY(180)
        this.scale(2.5)
    }
    rotationByX(angle: number) {
        angle = angle / 180 * PI;
        var cos_v = Math.cos(angle)
        var sin_v = Math.sin(angle)
        var model = Matrix.createMatrix([[1, 0, 0, 0], [0, cos_v, -sin_v, 0], [0, sin_v, cos_v, 0], [0, 0, 0, 1]]);
        var inverse_transpose_model = Matrix.createMatrix([[1, 0, 0, 0], [0, cos_v, -sin_v, 0], [0, sin_v, cos_v, 0], [0, 0, 0, 1]]);
        this.setModel(model,inverse_transpose_model)
    }
    rotationByY(angle: number) {
        angle = angle / 180 * PI;
        var cos_v = Math.cos(angle)
        var sin_v = Math.sin(angle)
        var model = Matrix.createMatrix([[cos_v, 0, sin_v, 0], [0, 1, 0, 0], [-sin_v, 0, cos_v, 0], [0, 0, 0, 1]]);
        var inverse_transpose_model = Matrix.createMatrix([[cos_v, 0, sin_v, 0], [0, 1, 0, 0], [-sin_v, 0, cos_v, 0], [0, 0, 0, 1]]);
        this.setModel(model,inverse_transpose_model)
    }
    rotationByZ(angle: number) {
        angle = angle / 180 * PI;
        var cos_v = Math.cos(angle)
        var sin_v = Math.sin(angle)
        var model = Matrix.createMatrix([[cos_v, -sin_v, 0, 0], [sin_v, cos_v, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
        var inverse_transpose_model = Matrix.createMatrix([[cos_v, -sin_v, 0, 0], [sin_v, cos_v, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
        this.setModel(model,inverse_transpose_model)
    }
    scale(scale: number) {
        var model = Matrix.createMatrix([[scale, 0, 0, 0], [0, scale, 0, 0], [0, 0, scale, 0], [0, 0, 0, 1]]);
        var inverse_transpose_model = Matrix.createMatrix([[1 / scale, 0, 0, 0], [0, 1 / scale, 0, 0], [0, 0, 1 / scale, 0], [0, 0, 0, 1]]);
        this.setModel(model,inverse_transpose_model)
    }
    move(x:number,y:number,z:number){
        var model=Matrix.createMatrix([[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]);
        var inverse_transpose_model = Matrix.createMatrix([[1 , 0, 0, 0], [0, 1 , 0, 0], [0, 0, 1, 0], [-x, -y, -z, 1]]);
        this.setModel(model,inverse_transpose_model)
    }
    setProjection(eye_fov: number, z_near: number, z_far: number, aspect_ratio: number) {
        var angle = eye_fov / 180 * PI;
        var high = Math.tan(angle / 2) * z_near * 2;
        console.log(high)
        var width = high * aspect_ratio;
        var length = z_far - z_near;
        var proj: Matrix = Matrix.createMatrix([[z_near, 0, 0, 0], [0, z_near, 0, 0], [0, 0, z_near + z_far, -z_far * z_near], [0, 0, 1, 0]])
        var move: Matrix = Matrix.createMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, -(z_near + z_far) / 2], [0, 0, 0, 1]])
        var ortho: Matrix = Matrix.createMatrix([[2 / width, 0, 0, 0], [0, 2 / high, 0, 0], [0, 0, 2 / length, 0], [0, 0, 0, 1]])
        this.proj = <Matrix>(<Matrix>ortho.multi(move)).multi(proj)
    }
    
    setPosition(new_position: Vector3) {
        this.position = Vector.clone(new_position)
        this.setView(this.position)
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
    private setModel(model:Matrix,inverse_transpose_model:Matrix){
        this.model_matrix = <Matrix>model.multi(this.model_matrix)
        this.inverse_transpose_model = <Matrix>inverse_transpose_model.multi(this.inverse_transpose_model)
    }
    private setView(position: Vector3) {
        var x = position.x();
        var y = position.y();
        var z = position.z();
        this.view = Matrix.createMatrix([[1, 0, 0, -x], [0, 1, 0, -y], [0, 0, 1, -z], [0, 0, 0, 1]]);
        this.inverse_view = Matrix.createMatrix([[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]);
        this.inverse_transpose_view = Matrix.createMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [x, y, z, 1]]);
    }
}