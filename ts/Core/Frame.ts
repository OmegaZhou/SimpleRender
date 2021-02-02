
class Color{
    red:number;
    green:number;
    blue:number;
    alpha:number;
    constructor(red:number=255,green:number=255,blue:number=255,alpha:number=255){
        this.red=red;
        this.green=green;
        this.blue=blue;
        this.alpha=alpha;
        this.round()
    }
    add(color:Color){
        return new Color(this.red+color.red,this.green+color.green,this.blue+color.blue)
    }
    multi(a:number){
        return new Color(this.red*a,this.green*a,this.blue*a)
    }
    round(){
        this.red=Math.round(this.red)
        this.blue=Math.round(this.blue)
        this.green=Math.round(this.green)
        this.alpha=Math.round(this.alpha)
    }
}

class Frame{
    frame_buffer:Color[][]=[];
    width:number;
    height:number;
    antialiasing:Boolean=false;
    z_buffer:number[];
    constructor(width:number,height:number){
        for(var i=0;i<width;++i){
            this.frame_buffer[i]=[];
            for(var j=0;j<height;++j){
                this.frame_buffer[i][j]=new Color();
            }
        }
        this.z_buffer=new Array(width*height).fill(Number.MAX_VALUE)
        this.width=width;
        this.height=height;
    }
    checkValid(x:number,y:number):Boolean{
        return x>=0&&x<this.width&&y>=0&&y<this.height;
    }
    showImage(){
        Canvas.showImage(this)
    }
    setPixel(x:number,y:number,color:Color){
        if(!this.checkValid(x,y)){
            return;
        }
        //console.log(x,y,color)
        this.frame_buffer[x][y]=color;
    }
    getColor(x:number,y:number){
        if(this.checkValid(x,y)){
            return this.frame_buffer[x][y]
        }else{
            return new Color();
        }
        
    }
    setAntialiase(b:Boolean){
        this.antialiasing=b;
    }
    drawLine(p1:Vector2,p2:Vector2,color:Color){
        let x1=Math.round(p1.x());
        let x2=Math.round(p2.x());
        let y1=Math.round(p1.y());
        let y2=Math.round(p2.y());
        let steep=false
        if(Math.abs(x1-x2)<Math.abs(y1-y2)){
            [x1,y1]=[y1,x1];
            [x2,y2]=[y2,x2];
            steep=true;
        }
        if(x1>x2){
            [x1,x2]=[x2,x1];
            [y1,y2]=[y2,y1];
        }
        let dx=Math.abs(x2-x1);
        let dy=Math.abs(y2-y1);
        let derr=dy*2;
        let dis=(y1<y2)?1:-1;
        let error=0;
        let need_vague=false
        for(let x=x1,y=y1;x<=x2;++x){
            if(!steep){
                this.setPixel(x,y,color)
                if(this.antialiasing){
                    if(need_vague){
                        this.Vague(x-1,y);
                        this.Vague(x,y-dis);
                        need_vague=false
                    }else{
                        this.Vague(x,y-dis);
                        this.Vague(x,y+dis);
                    }
                }
                
                
            }else{
                this.setPixel(y,x,color)
                if(this.antialiasing){
                    if(need_vague){
                        this.Vague(y,x-1);
                        this.Vague(y-dis,x);
                        need_vague=false
                    }else{
                        this.Vague(y-dis,x);
                        this.Vague(y+dis,x);
                    }
                }
                
            }
            error+=derr;
            if(error>dx){
                need_vague=true
                y+=dis;
                error-=2*dx;
            }
        }

    }
    drawTriangle(t:Triangle,getColor:(t:Triangle,x:number,y:number)=>Color){
        const p1=t.v[0].position;
        const p2=t.v[1].position;
        const p3=t.v[2].position;
        let x_min=Math.floor(Math.min(p1.x(),p2.x(),p3.x()));
        let x_max=Math.ceil(Math.max(p1.x(),p2.x(),p3.x()));
        let y_min=Math.floor(Math.min(p1.y(),p2.y(),p3.y()));
        let y_max=Math.ceil(Math.max(p1.y(),p2.y(),p3.y()));
        for(let x=x_min;x<=x_max;++x){
            for(let y=y_min;y<=y_max;++y){
                let {alpha,bata,gamma}=t.getBarycentric(x,y);
                if(t.isInsidebyBarycentric(alpha,bata,gamma)){
                    let z=p1.z()*alpha+p2.z()*bata+p3.z()*gamma
                    
                    let index=this.getIndex(x,y)
                    if(this.z_buffer[index]>z){
                        this.z_buffer[index]=z;
                        this.frame_buffer[x][y]=getColor(t,x,y);
                    }
                    
                }
            }
            
        }
    }
    private Vague(x:number,y:number){
        let my_color=this.getColor(x,y).multi(0.2)
        let c1=this.getColor(x-1,y).multi(0.2)
        let c2=this.getColor(x+1,y).multi(0.2)
        let c3=this.getColor(x,y-1).multi(0.2)
        let c4=this.getColor(x-1,y+1).multi(0.2)
        my_color=my_color.add(c1).add(c2).add(c3).add(c4);
        my_color.round();
        this.setPixel(x,y,my_color);
    }
    private getIndex(x:number,y:number){
        return x*this.width+y
    }
}