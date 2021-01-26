
class Canvas
{
    private static getCtx():CanvasRenderingContext2D{
        var result=this.getCanvas().getContext("2d")
        return result?result:new CanvasRenderingContext2D();
    }
    private static getCanvas():HTMLCanvasElement{
        return <HTMLCanvasElement>document.getElementById("canvas");
    }
    private static setWindowSize(width:number,height:number){
        var canvas=Canvas.getCanvas();
        canvas.width=width;
        canvas.height=height;
    }
    static showImage(frame:Frame){
        var data:Color[][]=frame.frame_buffer;
        var height=frame.height;
        var width=frame.width;
        this.setWindowSize(width,height)
        var ctx=this.getCtx();
        var image_data=ctx.createImageData(width,height)
        for(var i=0;i<height;++i){
            for(var j=0;j<width;++j){
                var r=height-i-1;
                var c=j;
                var index=r*width+c;
                index*=4;
                image_data.data[index]=data[i][j].red
                image_data.data[index+1]=data[i][j].green
                image_data.data[index+2]=data[i][j].blue
                image_data.data[index+3]=data[i][j].alpha
            }
        }
        ctx.putImageData(image_data,0,0);
    }
}