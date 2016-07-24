function shape (canvas,cobj,dobj) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.copy=dobj;
    this.type="line";
    this.style="stroke";
    this.fillColor="#000";
    this.strokeColor="#000";
    this.biannum=5;
    this.history=[];
    this.linewidth=1;
    this.bflag=true;
    this.xpsize=10;
    this.selecthis=[];
}
shape.prototype= {   
    insit:function(){
        this.cobj.lineWidth=this.linewidth;
        this.cobj.fillStyle=this.fillColor;
        this.cobj.strokeStyle=this.strokeColor;
    },
    draw:function(){
        var that=this;
        this.copy.onmousemove=null;
        this.copy.onmousedown=function (e) {
            var sx=e.offsetX;
            var sy=e.offsetY;
            that.bflag=true;
            that.copy.onmousemove=function (e) {
                var ex=e.offsetX;
                var ey=e.offsetY;
                that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);
                if(that.history.length!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                that.insit();
                that.cobj.beginPath();
                that[that.type](sx,sy,ex,ey);
                that.cobj[that.style]();

            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));

            }
        }
    },
    line:function (x,y,x1,y1) {
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
    },
    rect:function(x,y,x1,y1){
        this.cobj.rect(x,y,x1-x,y1-y);
    },
    arc:function(x,y,x1,y1){
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,2*Math.PI);
    },
    bian:function(x,y,x1,y1){
        var ang=360/this.biannum*Math.PI/180;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        for(var i=0;i<this.biannum;i++){
            this.cobj.lineTo(Math.cos(i*ang)*r+x,Math.sin(i*ang)*r+y);
        }
        this.cobj.closePath();
    },
    jiao:function(x,y,x1,y1){
        var ang=360/this.biannum*Math.PI/180;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        for(var i=0;i<this.biannum;i++){
            this.cobj.lineTo(Math.cos(i*ang)*r+x,Math.sin(i*ang)*r+y);
            this.cobj.lineTo(Math.cos((i+0.5)*ang)*r/2+x,Math.sin((i+0.5)*ang)*r/2+y);
        }
        this.cobj.closePath();
    },
    pen:function () {
        var that=this;
        this.copy.onmousemove=null;
        this.copy.onmousedown=function (e) {
            var sx=e.offsetX;
            var sy=e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(sx,sy);
            that.bflag=true;
            that.copy.onmousemove=function (e) {
                var ex=e.offsetX;
                var ey=e.offsetY;
                that.insit();
                that.cobj.lineTo(ex,ey);
                that.cobj.strokeStyle=that.strokeColor;
                that.cobj.stroke();
            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));

            }
        }
    },
    xpaa:function (xpobj) {
        var that=this;
        that.copy.onmousemove=function (e) {
            that.xpmove(e,that,xpobj);
        }
        that.copy.onmousedown=function (e) {
            that.copy.onmousemove=function (e) {
                that.xpmove(e,that,xpobj);
                var ox=e.offsetX;
                var oy=e.offsetY;
                that.cobj.clearRect(ox-that.xpsize/2,oy-that.xpsize/2,that.xpsize,that.xpsize);
            }
            that.copy.onmouseup=function () {
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.xpaa(xpobj);
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
            }
        }
    },
    xpmove:function (e,that,xpobj) {
        var movex=e.offsetX;
        var movey=e.offsetY;
        var left=movex-that.xpsize/2;
        var top=movey-that.xpsize/2;
        xpobj.style.cssText="width:"+that.xpsize+"px;height:"+that.xpsize+"px;left:"+left+"px;top:"+top+"px;";
    },
    selectarea:function(selectobj){
        var that=this;
        selectobj.show();
        selectobj.css({width:0,height:0,border:"none"});
        that.copy.onmousedown=function (e) {
            var startx=e.offsetX;
            var starty=e.offsetY;
            var sx,sy,width1,height1;
            that.copy.onmousemove=function (e) {
                var endx=e.offsetX;
                var endy=e.offsetY;
                width1=Math.abs(endx-startx);
                height1=Math.abs(endy-starty);
                sx=startx>endx?endx:startx;
                sy=starty>endy?endy:starty;
                selectobj.css({width:width1,height:height1,top:sy,left:sx,border:"1px dashed #333"});
            }
            that.copy.onmouseup=function () {
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.selectmove(sx,sy,width1,height1,selectobj);
            }
        }
    },
    selectmove:function(sx,sy,width1,height1,selectobj){
        var that=this;
        that.copy.onmousedown=function (e) {
            var startx=e.offsetX;
            var starty=e.offsetY;
            var endx,endy,ex1,ey1;
            that.selecthis.push(that.cobj.getImageData(sx,sy,width1,height1));
            that.cobj.clearRect(sx,sy,width1,height1);
            that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
            that.copy.onmousemove=function (e) {
                endx=e.offsetX;
                endy=e.offsetY;
                var ex=startx>endx?endx:startx;
                var ey=starty>endy?endy:starty;
                ex1=parseInt(ex+sx-startx);
                ey1=parseInt(ey+sy-starty);
                selectobj.css({left:ex1,top:ey1});
                that.cobj.clearRect(0,0,that.canvas.width,that.canvas.height);
                if(that.history.length!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                that.cobj.putImageData(that.selecthis[that.selecthis.length-1],ex1,ey1,0,0,width1,height1);

            }
            that.copy.onmouseup=function () {
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                selectobj.hide();
                that.cobj.putImageData(that.selecthis[that.selecthis.length-1],ex1,ey1,0,0,width1,height1);
                that.history.push(that.cobj.getImageData(0,0,that.canvas.width,that.canvas.height));
            }
        }
    }
}