// Initialize the model outside the function to cache it
let pipeline;

async function loadModel() {
  document.getElementById('loading').style.display = 'block';
  const { pipeline } = await import('@xenova/transformers');
  const model = await pipeline('text-generation', 'Xenova/gpt2');
  document.getElementById('loading').style.display = 'none';
  alert("Model loaded successfully!"); // Add this line
  return model;
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
