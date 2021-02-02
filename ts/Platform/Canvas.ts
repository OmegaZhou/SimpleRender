
class Canvas
{
    static getCtx():CanvasRenderingContext2D{
        var result=this.getCanvas().getContext("2d")
        return result?result:new CanvasRenderingContext2D();
    }
    private static getCanvas():HTMLCanvasElement{
        return <HTMLCanvasElement>document.getElementById("canvas");
    }
    static setWindowSize(width:number,height:number){
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
        
        //var image_data=ctx.createImageData(width,height)
        var image_data=ImageTool.convertToImage(data,width,height)
        ctx.putImageData(image_data,0,0);
    }
}