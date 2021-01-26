# SimpleRender

## 前言

* 在学完闫令琪老师的[games101](https://games-cn.org/intro-graphics/)课程后，为检验这段时间自己的学习成果，于是就准备自己尝试制作一个软光珊渲染器，顺便巩固一下学习成果
* 本项目同时参考了GitHub上的[tinyrender](https://github.com/ssloy/tinyrenderer)项目，来逐步完成渲染器的核心功能，同时帮助我查缺补漏
* 同时我也参考了相应的[知乎问答](https://www.zhihu.com/question/24786878)，对整个光栅渲染器的结构设计有了一个初步的想法
* 在实现本项目的技术选择上
  * 在我研究了一下Windows原生的桌面编程相关的API后，感觉太过繁琐，加上不想引入像QT这样比较重的库，因此我决定直接使用自己比较熟悉的HTML5的canvas作为渲染结果的展示平台，这样可以省去许多繁琐的工作
  * 同时，在本次项目中仅使用imageData来以像素为单位地直接操作canvas，从而避免使用canvas提供的相关绘制API
  * 在相关代码的编写上，我选择使用typescript来帮助我完成类型限制、优化编写类的体验，但为能够直接在文件系统中打开网页访问，我并没有采用模块化的方式将js代码导入HTML文件中，而是以传统方式将所有js文件导入HTML文件

## 准备工作

* 首先我要完成的就是实现与canvas的直接交互工作，对其进行封装，这样在之后的编写过程中就可以不再与canvas直接打交道了
* 根据习惯，我准备采用的是左下角为原点的坐标系，并定义了``Color``类，表示像素的RGB颜色，并在此基础上定义了存储``Color``的二维数组作为帧缓存``frame_buffer``
* 在研究了canvas所使用的``ImageData``格式之后，我完成了从``frame_buffer``到``ImageData``的映射工作（包括了将我使用的左下角为原点的坐标系转换为``ImageData``使用的左上角为原点的坐标系），并封装为``Frame``类的成员函数``showImage``，将帧缓存导入canvas并显示
* 这样准备工作就做好了，之后就不用再考虑有关canvas操作的相关问题了

## 1. 绘制线段

### Bresenham’s Line算法

* 首先要实现的就是在屏幕中画一条线，定义函数``drawLine(p1:Vector2,p2:Vector2,color:Color)``，其中``p1``和``p2``分别是线段的起点和终点

* Bresenham’s Line算法就不再阐述了，具体代码如下

  ```typescript
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
          for(let x=x1,y=y1;x<=x2;++x){
              if(steep){
                  this.setPixel(x,y,color)
                  
              }else{
                  this.setPixel(y,x,color)
              }
              error+=derr;
              if(error>dx){
                  y+=dis;
                  error-=2*dx;
              }
          }
  
      }
  ```

### 反走样

* 采用Bresenham’s Line算法实现了绘制之后，我发现对于斜线段，锯齿感明显
* 因此需要进行反走样操作，这里我采用的是对线段周围的像素进行模糊操作
* 我使用的模糊操作比较简单，直接令相应像素与周围像素的颜色取平均值
* 以下从左到右依次是未采用反走样、采用反走样以及使用canvas自带绘制API得到的同一条直线
  ![](./doc_img/antialiase.png)

* 可以看到最左边的线段锯齿状明显，中间的线段虽不如右端，但比起左端效果明显变好，缺陷是由于我是对周围线段进行的反走样操作，线段变得较粗