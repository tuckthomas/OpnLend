document.addEventListener('DOMContentLoaded', (event) => {
    var canvas = document.getElementById('signatureCanvas');
    var ctx = canvas.getContext('2d');
    var drawing = false;

    // Set canvas size to match the actual displayed size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial resize to set correct dimensions

    function getMousePosition(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function startDrawing(e) {
        drawing = true;
        var pos = getMousePosition(canvas, e);
        ctx.moveTo(pos.x, pos.y); // Move to the initial position without drawing a line
    }

    function draw(e) {
        if (!drawing) return;
        var pos = getMousePosition(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function stopDrawing() {
        if (!drawing) return;
        drawing = false;
        ctx.beginPath(); // Begin a new path to not connect lines after stopping
    }

    canvas.addEventListener('mousedown', (e) => {
        startDrawing(e);
    });

    canvas.addEventListener('mousemove', (e) => {
        draw(e);
    });

    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    window.saveSignature = function() {
        var signatureInput = document.getElementById('signatureInput');
        signatureInput.value = canvas.toDataURL(); // Convert canvas to data URL and store in hidden input
        console.log(signatureInput.value); // Just for demonstration
    };
});
