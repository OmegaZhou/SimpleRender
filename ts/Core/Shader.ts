abstract class Shader {
    abstract shade(info: ShadeInfo): Color;
}

class BlinnPhongShader extends Shader {
    shade(info: ShadeInfo): Color {
        var texture=info.texture;
        var tex_coord=info.tex_coord;
        var tex_color:Color=texture.getColor(tex_coord.x(),tex_coord.y());
        var ka:Vector3=new Vector3(0.00005,0.00005,0.00005);
        var kd:Vector3=new Vector3(tex_color.red/255,tex_color.green/255,tex_color.blue/255);
        var ks:Vector3=new Vector3(0.7937,0.7937,0.7937);
        var eye_pos:Vector3=info.eye_pos
        var point:Vector3=info.position
        var normal:Vector3=info.normal
        var color_vec:Vector3=new Vector3(0,0,0);
        var p=150;
        var lights=info.lights
        for(var i=0;i<lights.length;++i){
            let light=lights[i];
            let r:Vector3=Vector.sub(light.position,point)
            let r2:number=r.squaredNorm()
            //console.log(r2)
            r.normalized()
            let diffuse_intensity=Vector.div(light.intensity,r2);
            diffuse_intensity=Vector3.cwiseProduct(diffuse_intensity,kd);
            let c=Vector3.dotProduct(normal,r);
            diffuse_intensity=Vector.multi(diffuse_intensity,Math.max(0,c));

            let v:Vector3=Vector.sub(eye_pos,point);
            v.normalized();
            let h:Vector3=Vector.add(v,r);
            h.normalized();
            let specular_intensity=Vector.div(light.intensity,r2);
            specular_intensity=Vector3.cwiseProduct(specular_intensity,ks);
            specular_intensity=Vector.multi(specular_intensity,Math.max(0,Math.pow(Vector3.dotProduct(normal,h),p)));
            //specular_intensity=new Vector3(0,0,0)

            let amb_intensity=Vector3.cwiseProduct(light.intensity,ka);
            //amb_intensity=new Vector3(0,0,0)

            let intensity=Vector.add(specular_intensity,diffuse_intensity);
            //intensity=Vector.add(intensity,amb_intensity);
            color_vec=Vector.add(color_vec,intensity);
        }
        return new Color(color_vec.x()*255,color_vec.y()*255,color_vec.z()*255)
    }
}
class ShadeInfo {
    constructor(public position: Vector3, public normal: Vector3, public tex_coord: Vector2, public lights: Light[], public texture: Texture,public eye_pos:Vector3) {

    }
}