class Matrix{
    private m:number[][]=[]
    private r:number;
    private c:number;
    constructor(r:number,c?:number){
        if(!c){
            c=r;
        }
        this.r=r;
        this.c=c;
        for(var i=0;i<r;++i){
            this.m[i]=[];
            for(var j=0;j<c;++j){
                this.m[i][j]=0;
            }
        }
    }
    val(x:number,y:number,value?:number){
        if(value){
            this.m[x][y]=value;
        }
        return this.m[x][y];
    }
    resize(r:number,c:number){
        if(this.r>r){
            this.m.splice(r,this.r-r)
        }else if(this.r<r){
            for(let i=this.r;i<r;++i){
                this.m[i]=[]
            }
        }
        this.r=r;
        if(this.c>c){
            for(let i=0;i<this.r;++i){
                this.m[i].splice(c,this.c-c);
            }
        }else if(this.c<c){
            for(let i=0;i<this.r;++i){
                for(let j=this.c;j<c;++j){
                    this.m[i][j]=0;
                }
            }
        }
    }
}

class Vector2{
    protected v:Matrix;
    constructor(x:number=0,y:number=0){
        this.v=new Matrix(2,1);
        this.v.val(0,0,x);
        this.v.val(1,0,y);
    }
    x(val?:number){
        return this.v.val(0,0,val)
    }
    y(val?:number){
        return this.v.val(1,0,val)
    }
}
class Vector3 extends Vector2{
    constructor(x:number=0,y:number=0,z:number=0){
        super(x,y);
        this.v.resize(3,1)
        this.v.val(2,0,z);
    }
    z(val?:number){
        return this.v.val(2,0,val)
    }
}
class Vector4 extends Vector3{
    constructor(x:number=0,y:number=0,z:number=0,w:number=0){
        super(x,y,z)
        this.v.resize(4,1);
        this.v.val(3,0,w)
    }
    w(val?:number){
        return this.v.val(3,0,val)
    }
}