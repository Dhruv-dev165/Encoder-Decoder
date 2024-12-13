let selectedImage = null;

document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            selectedImage = new Image();
            selectedImage.src = e.target.result;
            selectedImage.onload = function () {
                document.getElementById('imagePreview').style.display = 'block';
                document.getElementById('imagePreview').src = selectedImage.src;
            };
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('encodeButton').addEventListener('click', function () {
    if (!selectedImage) {
        alert("Please select an image first.");
        return;
    }

    const text = document.getElementById('hiddenText').value;
    if (!text) {
        alert("Please enter text to hide.");
        return;
    }

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = selectedImage.width;
    canvas.height = selectedImage.height;

    // Draw the image on the canvas
    ctx.drawImage(selectedImage, 0, 0);

    // Encode the text as Base64
    const encodedText = btoa(text);

    // Embed the text into the image pixels
    for (let i = 0; i < encodedText.length; i++) {
        const charCode = encodedText.charCodeAt(i);
        ctx.fillStyle = `rgb(${charCode},0,0)`;
        ctx.fillRect(i, 0, 1, 1);
    }

    // Update the image preview with the modified image
    document.getElementById('imagePreview').src = canvas.toDataURL();
    document.getElementById('output').style.display = 'block';
    document.getElementById('output').textContent = "Text successfully encoded into the image!";
});

document.getElementById('decodeButton').addEventListener('click', function () {
    if (!selectedImage) {
        alert("Please select an image first.");
        return;
    }

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = selectedImage.width;
    canvas.height = selectedImage.height;

    // Draw the image on the canvas
    ctx.drawImage(selectedImage, 0, 0);

    // Retrieve the hidden text from the image
    let encodedText = '';
    for (let i = 0; i < canvas.width; i++) {
        const pixelData = ctx.getImageData(i, 0, 1, 1).data;
        if (pixelData[0] === 0) break; // Stop if no more data
        encodedText += String.fromCharCode(pixelData[0]);
    }

    try {
        const decodedText = atob(encodedText); // Decode Base64
        document.getElementById('output').style.display = 'block';
        document.getElementById('output').textContent = "Decoded Text: " + decodedText;
    } catch (e) {
        alert("No valid hidden text found in the image.");
    }
});
