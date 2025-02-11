let pipeline;

async function loadModel() {
  document.getElementById('loading').style.display = 'block';
  
  // Directly use the global `pipeline` function from the CDN
  try {
    // Initialize the model outside the function to cache it
    pipeline = await pipeline('text-generation', 'Xenova/gpt2');
    document.getElementById('loading').style.display = 'none';
    alert("Model loaded successfully!"); // Add this line
    return model;
  } catch (error) {
    console.log(window.pipeline);  // This should log the pipeline function if it's available
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
    if (!pipeline) {
      await loadModel();
    }

    // Generate text (default parameters)
    const result = await pipelin(input);
    outputDiv.innerText = result[0].generated_text;
    document.getElementById('loading').style.display = 'none';
  } catch (error) {
    console.error(error);
    outputDiv.innerText = 'Error generating text.';
  }
}

// Optional: Preload model when page loads
window.onload = async () => {
  await loadModel();
};
