var scene: Scene
var texture: Texture;
declare var $: any;
function init() {
    scene = new Scene(720, 720)
}

function upload() {
    var e1: HTMLInputElement = <HTMLInputElement>document.getElementById("model_file");
    var e2: HTMLInputElement = <HTMLInputElement>document.getElementById("img_file");
    var img_file: File;
    var obj_file: File;
    var obj_name: string
    if (e1.files && e2.files && e1.files.length != 0 && e2.files.length != 0) {
        obj_file = e1.files[0]
        obj_name = obj_file.name
        img_file = e2.files[0];
    } else {
        showWarnInfo()
        return;
    }
    scene.reset()
    var file_reader = new FileReader()
    file_reader.readAsDataURL(img_file)
    file_reader.onload = (e) => {
        let img = <HTMLImageElement>document.createElement("img")

        if (e.target == null) {
            return;
        }
        img.src = <string>e.target.result
        img.onload = (e) => {
            let w = img.naturalWidth
            let h = img.naturalHeight
            let data = ImageTool.convertImgToData(img);
            texture = new Texture(data, w, h);
            var file_reader2 = new FileReader()
            file_reader2.readAsBinaryString(obj_file)
            file_reader2.onload = (e) => {
                var str = new String(file_reader2.result)
                let loader = new ObjLoader();
                loader.loadModel(str, texture);
                let model = loader.getModel();
                scene.addModel(model);
                loadSccess(obj_name)
                //console.log("sss")
            }
        }

    }

    clearModal()
    closeModal()
}
function showWarnInfo() {
    $("#warn_info").attr("class", "visible")
}
function clearModal() {
    $("#warn_info").attr("class", "invisible")
    $("#model_file").val(null);
    $("#img_file").val(null);
}

function closeModal() {
    $('#model_modal').modal('hide')
}
function loadSccess(name: string) {
    $("#obj_name").text(name)
    $("#render").removeClass("invisible")
}
function showModel() {
    scene.clear()
    scene.drawModels()
}
function rotate(type: number) {
    var id = "#rotate-" + type;
    var angle = toNumber(id)
    if (isNaN(angle)) {
        console.log("false")
        return;
    }
    scene.rotate(type, angle)
}
function scale() {
    var sc = toNumber("#scale")
    if (isNaN(sc)) {
        console.log("false")
        return;
    }
    scene.scale(sc)
}
function move() {
    var x = toNumber("#move-x")
    var y = toNumber("#move-y")
    var z = toNumber("#move-z")
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
        console.log("false")
        return;
    }
    scene.move(x, y, z)
}
function clearConfig() {
    scene.clearConfig()
}
function addLight() {
    var p = []
    var intensity_a = []
    for (var i = 0; i < 3; ++i) {
        var tmp0 = toNumber('#light-position' + i)
        var tmp1 = toNumber('#light-intensity' + i)

        p.push(tmp0)
        intensity_a.push(tmp1)
    }
    for (var i = 0; i < 3; ++i) {
        var tmp0 = p[i]
        var tmp1 = intensity_a[i]
        if (isNaN(tmp0) || isNaN(tmp1)) {
            console.log("false")
            return;
        }
    }
    var position = new Vector3(p[0], p[1], p[2])
    var intenstiy = new Vector3(intensity_a[0], intensity_a[1], intensity_a[2])
    scene.lights.push(new Light(position, intenstiy))
    showLightList()
}
function removeLight() {
    var index = toNumber('#remove-light')
    scene.lights.splice(index, 1);
    showLightList()
}
function showLightList() {
    var lights = scene.lights
    var text = '<table class="table"><thead><tr><th scope="col">#</th><th scope="col">位置</th><th scope="col">强度</th></thread>'
    text += '<tbody>'
    for (var i = 0; i < lights.length; ++i) {
        var position = lights[i].position
        var intensity = lights[i].intensity;
        text += '<tr><th scope="row">'
        text += i;
        text += '</th>'
        text += '<th>'
        text += '(' + position.x() + ',' + position.y() + ',' + position.z() + ')'
        text += '</th>'
        text += '<th>'
        text += '(' + intensity.x() + ',' + intensity.y() + ',' + intensity.z() + ')'
        text += '</th></tr>'
    }
    text += '</tbody></table>'
    $("#light-list").html(text)
}
function lightConfig() {
    $('#light').modal('show')
    showLightList()
}
function setCamera() {
    var p = []
    for (var i = 0; i < 3; ++i) {
        var tmp0 = toNumber('#camera-position' + i)

        p.push(tmp0)
    }
    for (var i = 0; i < 3; ++i) {
        var tmp0 = p[i]
        if (isNaN(tmp0)) {
            console.log("false")
            return;
        }
    }
    scene.setCameraPosition(new Vector3(p[0], p[1], p[2]))

}
function toNumber(id: string) {
    var re = parseFloat($(id).val())
    $(id).val(null)
    return re;
}
function setShader() {
    var e: HTMLInputElement = <HTMLInputElement>document.getElementById("shader_file");
    var shader_file: File;
    if (e.files && e.files.length != 0) {
        shader_file = e.files[0]
    } else {
        return;
    }
    var file_reader = new FileReader()
    file_reader.readAsBinaryString(shader_file)
    file_reader.onload = (e) => {
        var str = new String(file_reader.result)
        {
            
            let shader:Shader=new BlinnPhongShader();
            let name=$("#shader-name").val()
            $("#shader-name").val(null)
            if(!name){
                name="MyShader";
            }
            let code="scene.shader=new "+name+"()"
            eval(str.toString()+'\n'+code)
        }
        //console.log("sss")
    }
    $("#shader_file").val(null)
    $('#shader-config').modal('hide')
}

