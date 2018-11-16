var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var pageWidth = document.documentElement.clientWidth
var pageHeight = document.documentElement.clientHeight
var range = document.getElementById("range");
var event = new Event('click')
var lineWidth = range.value
var lastPoint = {
    "x": undefined,
    "y": undefined
}
var using = false
var eraserEnabled = false
//切换画笔粗细功能
range.onchange = function () {
    lineWidth = this.value;
}
autoSetCanvas(canvas, pageWidth, pageHeight)
//设置canvas的宽和高
function autoSetCanvas(canvas, x, y) {
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
    canvasThick.onclick = function () {
        eraserEnabled = false
    }
    //特性检测
    if (document.body.ontouchstart !== undefined && document.body.ontouchstart !== null) {
        touchDevice()
    } else {
        unTouchDevice()
    }
}

function touchDevice() {
    //触屏设备
    canvas.ontouchstart = function (aaa) {
        var x = aaa.touches[0].clientX
        var y = aaa.touches[0].clientY
        using = true
        if (eraserEnabled) {
            context.clearRect(x - 3, y - 3, lineWidth, lineWidth)
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
            context.clearRect(x - 3, y - 3, lineWidth, lineWidth)
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
}
function unTouchDevice() {
    //非触控设备,鼠标事件
    canvas.onmousedown = function (aaa) {
        var x = aaa.clientX
        var y = aaa.clientY
        using = true
        if (eraserEnabled) {
            context.clearRect(x - 3, y - 3, lineWidth, lineWidth)
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
            return {}
        }
        if (eraserEnabled) {
            context.clearRect(x - 3, y - 3, lineWidth, lineWidth)
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

//画点和线
function drawLine(x1, y1, x2, y2, lineWidth) {
    context.beginPath();
    context.moveTo(x1, y1)
    context.lineWidth = lineWidth
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
}
function drawCircle(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2)
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
canvasDelete.onclick = function () {
    if (window.confirm("Do you really want to clear it?")) {
        context.clearRect(0, 0, pageWidth, pageHeight)
        setTimeout(() => {
            document.querySelector('#canvasThick').dispatchEvent(event)
        }, 1000); 
    }
    
}

//保存功能
canvasSave.onclick = function () {
    var a = document.createElement('a')
    document.body.appendChild(a)
    var url = canvas.toDataURL("img/png")
    a.href = url
    a.download = 'newImage'
    a.target = '_blank'
    a.click()
    setTimeout(() => {
        document.querySelector('#canvasThick').dispatchEvent(event)
    }, 1000);
}

//颜色    待优化 这里默认点击后切到铅笔,用到事件委托???
var colorWrapper = document.querySelector('.colorWrapper')
    colorWrapper.addEventListener('click', changeColor, false)
function changeColor(e) {
    var color = e.target.id
    context.fillStyle = color
    context.strokeStyle = color
    document.querySelector('#canvasThick').dispatchEvent(event)
}


var colorList = document.querySelectorAll('.color')
for (let index = 0; index < colorList.length; index++) {
    colorList[index].addEventListener("click", changeActive, false)  
    function changeActive() {
        for (let index = 0; index < colorList.length; index++) {
            colorList[index].classList.remove('active')
        }
        colorList[index].classList.add('active')
    }
}



// //布置的撤销功能
// canvas.ontouchstart = function (e) {
//     // 在这里储存绘图表面
//     this.firstDot = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     saveData(this.firstDot);

// }

// let undo = document.getElementById("undo");
// let historyDeta = [];

// function saveData (data) {
//     (historyDeta.length === 10) && (historyDeta.shift()); // 上限为储存10步，太多了怕挂掉
//     historyDeta.push(data);
// }
// undo.onclick = function(){
//     if(historyDeta.length < 1) return false;
//     ctx.putImageData(historyDeta[historyDeta.length - 1], 0, 0);
//     historyDeta.pop()
// };