
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
    constructor(width:number,height:number){
        for(var i=0;i<height;++i){
            this.frame_buffer[i]=[];
            for(var j=0;j<width;++j){
                this.frame_buffer[i][j]=new Color();
            }
        }
        this.width=width;
        this.height=height;
    }
    checkValid(x:number,y:number):Boolean{
        return x>=0&&x<=this.width&&y>=0&&y<=this.height;
    }
    showImage(){
        Canvas.showImage(this)
    }
    setPixel(x:number,y:number,color:Color){
        if(!this.checkValid(x,y)){
            return;
        }
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
        let x1=Math.round(p1.x);
        let x2=Math.round(p2.x);
        let y1=Math.round(p1.y);
        let y2=Math.round(p2.y);
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
            if(steep){
                this.setPixel(x,y,color)
                if(this.antialiasing){
                    if(need_vague){
                        this.Vague(x-1,y);
                        this.Vague(x,y-dis);
                        need_vague=false
                    }else{
                        if(derr!=0){
                            this.Vague(x,y-dis);
                            this.Vague(x,y+dis);
                        }  
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
                        if(derr!=0){
                            this.Vague(y-dis,x);
                            this.Vague(y+dis,x);
                        }
                        
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
}