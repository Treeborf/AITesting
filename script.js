

async function loadModel() {
  document.getElementById('loading').style.display = 'block';
  
  // Directly use the global `pipeline` function from the CDN
  try {
    // Initialize the model outside the function to cache it
    const generator = await pipeline('text-generation', 'Xenova/gpt2');
    document.getElementById('loading').style.display = 'none';
    alert("Model loaded successfully!"); // Add this line
    return model;
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
    if (!pipeline) {
      pipeline = await loadModel();
    }

    // Generate text
    const result = await pipeline(input, {
      max_new_tokens: 50,  // Limit output length
    });

    outputDiv.innerText = result[0].generated_text;
    document.getElementById('loading').style.display = 'none';
  } catch (error) {
    console.error(error);
    outputDiv.innerText = 'Error generating text.';
  }
}

// Optional: Preload model when page loads
window.onload = async () => {
  pipeline = await loadModel();
};
