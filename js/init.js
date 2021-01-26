"use strict";
var frame = new Frame(300, 300);
frame.drawLine(new Vector2(0, 0), new Vector2(70, 210), new Color(255, 0, 0));
frame.setAntialiase(true);
frame.drawLine(new Vector2(30, 0), new Vector2(100, 210), new Color(255, 0, 0));
//frame.drawLine(new Vector2(0,1.2),new Vector2(0,280.4),new Color(0,255,0));
//frame.drawLine(new Vector2(1.2,0),new Vector2(280.4,0),new Color(255,0,0));
frame.showImage();
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
if (context != null) {
    context.moveTo(60, 300); //设置起点状态
    context.lineTo(130, 90); //设置末端状态
    context.lineWidth = 1; //设置线宽状态
    context.strokeStyle = '#FF0000'; //设置线的颜色状态
    context.stroke(); //进行绘制
}
