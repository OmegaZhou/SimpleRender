class Camera{
    position:Vector3;
    rotation_matrix:Matrix;
    eye_fov:number;
    z_near:number;
    z_far:number;
    constructor(position:Vector3,eye_fov:number,z_near:number,z_far:number){
        this.position=Vector.clone(position);
        this.rotation_matrix=Matrix.createMatrix([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
        this.eye_fov=eye_fov;
        this.z_near=z_near;
        this.z_far=z_far;
    }
    setPosition(new_position:Vector3){
        this.position=Vector.clone(new_position)
    }
}