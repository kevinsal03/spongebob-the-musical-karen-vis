var canvas;
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioContext.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;


function setupVisualize(){
    canvas = document.getElementById("main_canvas");
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
    
    setupAudioDevice();

    console.log("ready!");
}

function visualize() {
    var drawVisual;
    var canvasContext = canvas.getContext("2d");

    const WIDTH = canvasContext.width;
    const HEIGHT = canvasContext.height;

    analyser.fftSize = 2048;
    var bufferLength = analyser.fftSize;
    var dataArray = new Uint8Array(bufferLength);

    canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

    var draw = function() {
        drawVisual = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        console.log(dataArray)
        canvasContext.fillStyle = 'rgb(0, 0, 0)';
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
        canvasContext.lineWidth = 10;
        canvasContext.strokeStyle = 'rgb(255, 255, 255)';
        canvasContext.beginPath();
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;
            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }
            x += sliceWidth;
        }
        canvasContext.lineTo(canvasContext.width, canvasContext.height/2);
        canvasContext.stroke();
    };

    draw();
}

function setupAudioDevice() {
    let constraints = {audio: true}
    navigator.mediaDevices.getUserMedia (constraints)
       .then(
         function(stream) {
            source = audioContext.createMediaStreamSource(stream);
            analyser.connect(audioContext.destination);
            visualize();
       })
       .catch( function(err) { alert('Unable to setup audio device. \nReason: ' + err);})
}