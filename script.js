let qaPipeline;
let developerContext = `The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. 
It is named after the engineer Gustave Eiffel, whose company designed and built the tower. 
Constructed from 1887 to 1889, it was initially criticized by some of France's leading artists 
and intellectuals for its design, but it has become a global cultural icon of France.`;

async function loadModel() {
  document.getElementById('loading').style.display = 'block';
  try {
    const { pipeline } = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js");
    qaPipeline = await pipeline('question-answering', 'Xenova/bert-base-uncased-squad2');
    document.getElementById('loading').style.display = 'none';
    document.getElementById('context-display').innerText = `Current Context: ${developerContext}`;
    alert("Model loaded successfully!");
  } catch (error) {
    console.error('Error loading model:', error);
    document.getElementById('loading').style.display = 'none';
    alert('Failed to load model.');
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

// Developer functions to manage context
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

window.onload = async () => {
  await loadModel();
  document.querySelector('button').onclick = answerQuestion;
};
