class Matrix{
    private m_:number[][]=[]
    private r_:number;
    private c_:number;
    constructor(r:number,c?:number){
        if(!c){
            c=r;
        }
        this.r_=r;
        this.c_=c;
        for(var i=0;i<r;++i){
            this.m_[i]=[];
            for(var j=0;j<c;++j){
                this.m_[i][j]=0;
            }
        }
    }
    static createMatrix(m:number[][]){
        let result=new Matrix(0)
        result.r_=m.length;
        result.c_=m[0].length;
        for(let i=0;i<result.r_;++i){
            result.m_[i]=[]
            for(let j=0;j<result.c_;++j){
                result.m_[i][j]=m[i][j];
            }
        }
        return result
    }
    val(x:number,y:number,value?:number){
        if(value){
            this.m_[x][y]=value;
        }
        return this.m_[x][y];
    }
    r():number{
        return this.r_;
    }
    c():number{
        return this.c_;
    }
    resize(r:number,c:number){
        if(this.r_>r){
            this.m_.splice(r,this.r_-r)
        }else if(this.r_<r){
            for(let i=this.r_;i<r;++i){
                this.m_[i]=[]
            }
        }
        this.r_=r;
        if(this.c_>c){
            for(let i=0;i<this.r_;++i){
                this.m_[i].splice(c,this.c_-c);
            }
        }else if(this.c_<c){
            for(let i=0;i<this.r_;++i){
                for(let j=this.c_;j<c;++j){
                    this.m_[i][j]=0;
                }
            }
        }
    }
    multi(v:Matrix|Vector){
        let result:Matrix|Vector;
        if(v instanceof Matrix){
            result=new Matrix(this.r(),v.c());
            let r=this.r();
            let c=v.c();
            let l=this.c();
            for(let i=0;i<r;++i){
                for(let j=0;j<c;++j){
                    let t:number=0;
                    for(let k=0;k<l;++k){
                        t+=this.val(i,k)*v.val(k,j);
                    }
                    result.val(i,j,t);
                }
            }
        }else{
            result=Vector.clone(v);
            let r=this.r();
            let l=v.size()
            for(let i=0;i<r;++i){
                let t=0;
                for(let j=0;j<l;++j){
                    t+=this.val(i,j)*v.val(j);
                }
                result.val(i,t);
            }
        }
        return result;
    }
    static clone(m:Matrix):Matrix{
        var k=new Matrix(m.r_,m.c_);
        for(let i=0;i<k.r_;++i){
            for(var j=0;j<k.c_;++j){
                k.m_[i][j]=m.m_[i][j]
            }
        }
        return k;
    }

}
class Vector{
    protected v_:Matrix;
    constructor(...values:number[]){
        this.v_=new Matrix(values.length,1);
        for(let i=0;i<values.length;++i){
            this.v_.val(i,0,values[i]);
        }
    }
    size(){
        return this.v_.r();
    }
    val(i:number,v?:number){
        return this.v_.val(i,0,v);
    }
    normalized(){
        let norm=this.norm();
        let r=this.v_.r()
        for(let i=0;i<r;++i){
            let tmp=this.v_.val(i,0);
            this.v_.val(i,0,tmp/norm);
        }
    }
    norm(){
        let result=0;
        let r=this.v_.r()
        for(let i=0;i<r;++i){
            result+= Math.pow(this.v_.val(i,0),2);
        }
        return Math.sqrt(result)
    }
    static clone<T extends Vector>(vec:T):T{
        let tmp = new Vector();
        tmp.v_=Matrix.clone(vec.v_);
        return <T>tmp;
    }
    static sub<T extends Vector>(a:T,b:T):T{
        let tmp=new Vector();
        tmp.v_=new Matrix(a.v_.r(),1);
        let r=a.v_.r()
        for(let i=0;i<r;++i){
            tmp.v_.val(i,0,a.v_.val(i,0)-b.v_.val(i,0))
        }
        return <T>tmp;
    }
    static add<T extends Vector>(a:T,b:T):T{
        let tmp=new Vector();
        tmp.v_=new Matrix(a.v_.r(),1);
        let r=a.v_.r()
        for(let i=0;i<r;++i){
            tmp.v_.val(i,0,a.v_.val(i,0)+b.v_.val(i,0))
        }
        return <T>tmp;
    }
    static multi<T extends Vector>(a:T,b:T|number):T{
        let tmp=new Vector();
        tmp.v_=new Matrix(a.v_.r(),1);
        let r=a.v_.r()
        for(let i=0;i<r;++i){
            if(b instanceof Number){
                tmp.v_.val(i,0,a.v_.val(i,0)*<number>b)
            }else{
                tmp.v_.val(i,0,a.v_.val(i,0)*(<T>b).v_.val(i,0))
            }
            
        }
        return <T>tmp;
    }
    static div<T extends Vector>(a:T,b:T|number):T{
        let tmp=new Vector();
        tmp.v_=new Matrix(a.v_.r(),1);
        let r=a.v_.r()
        for(let i=0;i<r;++i){
            if(b instanceof Number){
                tmp.v_.val(i,0,a.v_.val(i,0)/<number>b)
            }else{
                tmp.v_.val(i,0,a.v_.val(i,0)/(<T>b).v_.val(i,0))
            }
            
        }
        return <T>tmp;
    }
    x(val?:number){
        return this.v_.val(0,0,val)
    }
    y(val?:number){
        return this.v_.val(1,0,val)
    }
    z(val?:number){
        return this.v_.val(2,0,val)
    }
    w(val?:number){
        return this.v_.val(3,0,val)
    }
}
class Vector2 extends Vector{
    
    constructor(x:number=0,y:number=0){
        super(x,y);
    }
}
class Vector3 extends Vector{
    constructor(x:number=0,y:number=0,z:number=0){
        super(x,y,z);

    }
    static crossProduct(a:Vector3,b:Vector3):Vector3{
        return new Vector3(a.y() * b.z() - a.z() * b.y(),a.z() * b.x() - a.x() * b.z(),a.x() * b.y() - a.y() * b.x());
    }
    static dotProduct(a:Vector3,b:Vector3):number{
        return a.x()*b.x()+a.y()*b.y()+a.z()*b.z();
    }
}
class Vector4 extends Vector{
    constructor(x:number=0,y:number=0,z:number=0,w:number=0){
        super(x,y,z,w)
    }
    
}