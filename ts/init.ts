function init() {
    /**var frame = new Frame(300, 300);

    frame.drawLine(new Vector2(0, 0), new Vector2(70, 210), new Color(255, 0, 0));
    frame.setAntialiase(true)
    frame.drawLine(new Vector2(30, 0), new Vector2(100, 210), new Color(255, 0, 0));
    //frame.drawLine(new Vector2(0,1.2),new Vector2(0,280.4),new Color(0,255,0));
    //frame.drawLine(new Vector2(1.2,0),new Vector2(280.4,0),new Color(255,0,0));
    frame.showImage();
    var canvas = <HTMLCanvasElement>document.getElementById("canvas")
    var context = canvas.getContext("2d")
    if (context != null) {
        context.moveTo(60, 300);       //设置起点状态
        context.lineTo(130, 90);       //设置末端状态
        context.lineWidth = 1;          //设置线宽状态
        context.strokeStyle = '#FF0000';  //设置线的颜色状态
        context.stroke();               //进行绘制
    }*/
    let frame=new Frame(200,200);
    var t=new Triangle(new Vertex(new Vector3(10,10,0)),new Vertex(new Vector3(100, 30,0)),new Vertex(new Vector3(190, 160,0)))
    frame.drawTriangle(t,(t:Triangle,x:number,y:number)=>{
        return new Color(255,0,0);
    })
    frame.showImage();
}

function upload()
{
    var e:HTMLInputElement=<HTMLInputElement>document.getElementById("model_file");
    var file:File;
    if(e.files){
        file=e.files[0];
    }else{
        return;
    }
    var file_reader=new FileReader()
    console.time("Load model")
    file_reader.readAsBinaryString(file)
    file_reader.onload=(e)=>{
        var str=new String(file_reader.result)
        let loader=new ObjLoader();
        loader.loadModel(str);
        let model=loader.getModel();
        console.timeEnd("Load model")
        let group=model.meshes_group
        let width=720;
        let height=720;
        var frame = new Frame(width, height);
        //frame.setAntialiase(true)
        console.time("Draw triangle")
        for (let i=0; i<group.length; i++) { 
            
            /*for (let j=0; j<3; j++) { 
                let v0 = group[i].v[j]
                let v1 = group[i].v[(j+1)%3]; 
                let x0 = (v0.position.x()+1)*width/2.; 
                let y0 = (v0.position.y()+1.)*height/2.; 
                let x1 = (v1.position.x()+1.)*width/2.; 
                let y1 = (v1.position.y()+1.)*height/2.; 
                frame.drawLine(new Vector2(x0,y0),new Vector2(x1,y1),new Color(0,0,0));
            }*/
            let v=[]
            
            for (let j=0; j<3; j++) { 
                let v0 = group[i].v[j]
                let x0 = (v0.position.x()+1.)*width/2.; 
                let y0 = (v0.position.y()+1.)*height/2.; 
                v.push(new Vertex(new Vector3(x0,y0,-v0.position.z())))
            }
            //console.log(v)
            let t:Triangle=new Triangle(v[0],v[1],v[2])
            let color=new Color(Math.random()*255,Math.random()*255,Math.random()*255); 
            //let color=new Color(255,0,0)
            frame.drawTriangle(t,(t:Triangle,x:number,y:number)=>{
                return color;
            })
        }
        frame.showImage()
        //console.log(file_reader.result)
        console.timeEnd("Draw triangle")
        console.log(count)
    }    
    //console.log(file)
}

