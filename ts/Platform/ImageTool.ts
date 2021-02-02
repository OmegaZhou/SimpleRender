class ImageTool {
    static convertToImage(data: Color[][], width: number, height: number): ImageData {
        var image_data = new ImageData(width, height)
        for (var i = 0; i < height; ++i) {
            for (var j = 0; j < width; ++j) {
                var r = height - i - 1;
                var c = j;
                var index = r * width + c;
                index *= 4;
                image_data.data[index] = data[j][i].red
                image_data.data[index + 1] = data[j][i].green
                image_data.data[index + 2] = data[j][i].blue
                image_data.data[index + 3] = data[j][i].alpha
            }
        }
        return image_data
    }
    static convertToFrameData(image_data: ImageData, width: number, height: number) {
        var data: Color[][] = []
        for (var i = 0; i < width; ++i) {
            data[i] = []
        }
        for (var i = 0; i < height; ++i) {
            for (var j = 0; j < width; ++j) {
                var r = height - i - 1;
                var c = j;
                var index = r * width + c;
                index *= 4;
                data[j][i] = new Color(image_data.data[index], image_data.data[index + 1],
                    image_data.data[index + 2], image_data.data[index + 3]);
                //console.log(data[j][i],image_data.data[index], image_data.data[index + 1],
                    //image_data.data[index + 2], image_data.data[index + 3])
            }
        }
        console.log(image_data.data)
        return data;
    }
    static convertImgToData(img: HTMLImageElement) {
        let w = img.naturalWidth
        let h = img.naturalWidth;
        console.log(w,h)
        let canvas = <HTMLCanvasElement>document.createElement("canvas")
        canvas.width=w
        canvas.height=h
        let ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        let image_data = ctx.getImageData(0, 0, w, h);
        return this.convertToFrameData(image_data, w, h);
    }
}