let generator;

async function loadModel() {
  document.getElementById('loading').style.display = 'block';

  try {
    // Dynamically import the pipeline function from the CDN
    const { pipeline } = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.4.0/dist/transformers.min.js");
    generator = await pipeline('text-generation', 'Xenova/gpt2');
    document.getElementById('loading').style.display = 'none';
    alert("Model loaded successfully!");
  } catch (error) {
    console.error('Error loading model:', error);
    document.getElementById('loading').style.display = 'none';
    alert('Failed to load model.');
  }
}

async function generateText() {
  try {
    const input = document.getElementById('input').value;
    const outputDiv = document.getElementById('output');
    outputDiv.innerText = 'Generating...';

    // Load model if not already loaded
    if (!generator) {
      await loadModel();
    }

    // Generate text using the loaded model
    const result = await generator(input);
    outputDiv.innerText = result[0].generated_text;
    document.getElementById('loading').style.display = 'none';
  } catch (error) {
    console.error(error);
    outputDiv.innerText = 'Error generating text.';
  }
}

// Make sure the generateText function is accessible globally
window.generateText = generateText;

// Optional: Preload model when page loads
window.onload = async () => {
  await loadModel();
};
