var canvas=document.getElementById('canvas')
console.log(1)
var context=canvas.getContext('2d')
var pageWidth = document.documentElement.clientWidth
var pageHeight = document.documentElement.clientHeight
var lineWidth = 2
 var lastPoint = {
     "x": undefined,
     "y": undefined
 }
 var using = false
 var eraserEnabled = false
autoSetCanvas(canvas, pageWidth, pageHeight)
//设置canvas的宽和高
function autoSetCanvas(canvas,x,y) {
    setCanvasSize()
    window.onresize = function () {
        setCanvasSize()
    }
    function setCanvasSize() {
        canvas.width = x
        canvas.height = y
    }
}  

//非触屏设备
    //监听鼠标事件
listenToMouse(canvas)
function listenToMouse(canvas) {
    //切换功能
    canvasEraser.onclick = function () {
        eraserEnabled = true
    }
    canvasThin.onclick = function () {
        eraserEnabled = false
    }
    canvasThick.onclick = function () {
        eraserEnabled = false
    }
    //特性检测
    if (document.body.ontouchstart !== undefined&&document.body.ontouchstart!==null) {
        //触屏设备
        canvas.ontouchstart = function (aaa) {
            var x = aaa.touches[0].clientX
            var y = aaa.touches[0].clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x - 3, y - 3, 6, 6)
            } else {
                lastPoint = {
                    "x": x,
                    "y": y
                }
                drawCircle(x, y, (lineWidth / 2))
            }
        }

        canvas.ontouchmove = function (aaa) {
            var x = aaa.touches[0].clientX
            var y = aaa.touches[0].clientY
            if (using == false) {
                return {}
            }
            if (eraserEnabled) {
                context.clearRect(x - 3, y - 3, 6, 6)
            } else {
                var newPoint = {
                    "x": x,
                    "y": y
                }
                drawCircle(x, y, (lineWidth / 2))
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, lineWidth)
                lastPoint = newPoint
            }
        }

        canvas.ontouchend = function () {
            using = false
        }

        
    } else {
        //非触控设备,鼠标事件
        canvas.onmousedown = function (aaa) {
            var x = aaa.clientX
            var y = aaa.clientY
            using = true
            if (eraserEnabled) {
                context.clearRect(x - 3, y - 3, 6, 6)
            } else {
                lastPoint = {
                    "x": x,
                    "y": y
                }
                drawCircle(x, y, (lineWidth / 2))
            }
        }

        canvas.onmousemove = function (aaa) {
            var x = aaa.clientX
            var y = aaa.clientY
            if (using == false) {
                return{}
            }
            if (eraserEnabled) {
                context.clearRect(x - 3, y - 3, 6, 6)
            } else {
                var newPoint = {
                    "x": x,
                    "y": y
                }
                drawCircle(x, y, (lineWidth / 2))
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y, lineWidth)
                lastPoint = newPoint
            }
        }
        canvas.onmouseup = function () {
            using = false
        }
    }
}



//画点和线
function drawLine(x1, y1, x2, y2, lineWidth) {
    context.beginPath();
    context.moveTo(x1,y1)
    context.lineWidth = lineWidth
    context.lineTo(x2,y2)
    context.stroke()
    context.closePath()
}
function drawCircle(x,y,radius) {
    context.beginPath();
    context.arc(x,y,radius,0,Math.PI*2)  
    context.fill()
}

// 图标被点中时放大,不被点中时还原
var arr = document.getElementsByClassName('icon')
for (let index = 0; index < arr.length; index++) {
    arr[index].addEventListener("click", checked, false)
    function checked() {
        for (let index = 0; index < arr.length; index++) {
            arr[index].classList.remove('checked')     
        }
        arr[index].classList.add('checked')
    } 
}

//清空页面功能
canvasDelete.onclick=function () {
    if (window.confirm("Do you really want to clear it?")) { 
        context.clearRect(0, 0, pageWidth, pageHeight)
    }
    
}
//切换画笔粗细功能
canvasThin.addEventListener("click", function () {lineWidth = 2;}, false)
canvasThick.addEventListener("click", function () {lineWidth = 6;}, false)
//保存功能
canvasSave.onclick=function(){
    //这里保存前须定义文件名....................................................................................................
    var a =document.createElement('a')
    document.body.appendChild(a)
    var url=canvas.toDataURL("img/png")
    a.href=url
    a.download='newImage'
    a.target='_blank'
    a.click()
}

//颜色    待优化 这里默认点击后切到铅笔,用到事件委托???
red.onclick=function(){
    context.fillStyle = 'red'
    context.strokeStyle='red'
}
yellow.onclick = function () {
    context.fillStyle = 'yellow'
    context.strokeStyle = 'yellow'
}
blue.onclick = function () {
    context.fillStyle = 'blue'
    context.strokeStyle = 'blue'
}
black.onclick = function () {
    context.fillStyle = 'black'
    context.strokeStyle = 'black'
}
green.onclick = function () {
    context.fillStyle = 'green'
    context.strokeStyle = 'green'
}
var colorList= document.querySelectorAll('.color')
for(let index=0;index<colorList.length;index++){
    colorList[index].addEventListener("click", changeColor, false)
    function changeColor(){
        for (let index = 0; index < colorList.length; index++) {
            colorList[index].classList.remove('active')
        }
        colorList[index].classList.add('active')
    }
}
console.log(3)