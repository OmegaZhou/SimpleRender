class Vertex {
    position: Vector3;
    normal: Vector3 | null | undefined;
    texture_coordinate: Vector2 | null | undefined;
    constructor(position: Vector3, normal?: Vector3 | null, texture_coordinate?: Vector2 | null) {
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
        } else {
            this.texture_coordinate = null;
        }
    }
}
abstract class Mesh {
    v: Vertex[];
    normal: Vector3;
    constructor(vec: Vertex[], n: Vector3) {
        this.v = vec;
        this.normal = n;
    }
}
class Triangle extends Mesh {
    constructor(v1: Vertex, v2: Vertex, v3: Vertex) {
        let v = [v1, v2, v3];
        let a: Vector3 = <Vector3>Vector.sub<Vector3>(v1.position, v2.position)
        let b: Vector3 = <Vector3>Vector.sub<Vector3>(v2.position, v3.position)
        let normal = Vector3.crossProduct(a, b);
        normal.normalized();
        super(v, normal)
    }
    getBarycentric(x: number, y: number) {
        let v = [this.v[0].position, this.v[1].position, this.v[2].position]
        let c1 = (x * (v[1].y() - v[2].y()) + (v[2].x() - v[1].x()) * y + v[1].x() * v[2].y() - v[2].x() * v[1].y()) / (v[0].x() * (v[1].y() - v[2].y()) + (v[2].x() - v[1].x()) * v[0].y() + v[1].x() * v[2].y() - v[2].x() * v[1].y());
        let c2 = (x * (v[2].y() - v[0].y()) + (v[0].x() - v[2].x()) * y + v[2].x() * v[0].y() - v[0].x() * v[2].y()) / (v[1].x() * (v[2].y() - v[0].y()) + (v[0].x() - v[2].x()) * v[1].y() + v[2].x() * v[0].y() - v[0].x() * v[2].y());
        let c3 = (x * (v[0].y() - v[1].y()) + (v[1].x() - v[0].x()) * y + v[0].x() * v[1].y() - v[1].x() * v[0].y()) / (v[2].x() * (v[0].y() - v[1].y()) + (v[1].x() - v[0].x()) * v[2].y() + v[0].x() * v[1].y() - v[1].x() * v[0].y());
        return { alpha: c1, bata: c2, gamma: c3 }
    }
    isInside(x: number, y: number): boolean {
        let { alpha, bata, gamma } = this.getBarycentric(x, y);
        return this.isInsidebyBarycentric(alpha, bata, gamma)
    }
    isInsidebyBarycentric(alpha: number, bata: number, gamma: number): boolean {
        return !(alpha < -EPSILON || bata < -EPSILON || gamma < -EPSILON)
    }
}
class Rectangle extends Mesh {
    constructor(v1: Vertex, v2: Vertex, v3: Vertex,) {
        let v = [v1, v2, v3];
        let a: Vector3 = <Vector3>Vector.sub<Vector3>(v1.position, v2.position)
        let b: Vector3 = <Vector3>Vector.sub<Vector3>(v2.position, v3.position)
        let normal = Vector3.crossProduct(a, b);
        normal.normalized();
        super(v, normal)
    }
}