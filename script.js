let qaPipeline;
let developerContext = `The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France.`;

async function loadModel() {
  document.getElementById('loading').style.display = 'block';
  try {
    const { pipeline } = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js");
    // Use a model with proper CDN configuration
    qaPipeline = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
    document.getElementById('loading').style.display = 'none';
    document.getElementById('context-display').innerText = `Current Context: ${developerContext}`;
  } catch (error) {
    console.error('Error loading model:', error);
    document.getElementById('loading').style.display = 'none';
    alert('Failed to load model. Check console for details.');
  }
}

async function answerQuestion() {
  try {
    const question = document.getElementById('question').value;
    const outputDiv = document.getElementById('output');
    outputDiv.innerText = 'Analyzing...';

    if (!qaPipeline) await loadModel();

    const result = await qaPipeline({
      question: question,
      context: developerContext
    });

    outputDiv.innerText = result.answer || "No answer found in context";
  } catch (error) {
    console.error(error);
    outputDiv.innerText = 'Error processing question.';
  }
}

// Developer context functions
function setContext(newContext) {
  developerContext = newContext;
  document.getElementById('context-display').innerText = `Current Context: ${newContext}`;
}

function getContext() {
  return developerContext;
}

window.answerQuestion = answerQuestion;
window.setContext = setContext;
window.getContext = getContext;

window.onload = loadModel;
