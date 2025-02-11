async function generateText() {
    const input = document.getElementById('input').value;
    const outputDiv = document.getElementById('output');

    if (!input) {
        outputDiv.innerText = 'Please enter some text.';
        return;
    }

    outputDiv.innerText = 'Generating...';

    try {
        const response = await fetch("http://localhost:3000/generate", { // ✅ Calls backend, NOT OpenAI
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input })
        });

        const data = await response.json();
        outputDiv.innerText = data.choices?.[0]?.message?.content || "No response.";
    } catch (error) {
        console.error(error);
        outputDiv.innerText = "Error generating text.";
    }
}

// Attach event listener
window.onload = () => {
    document.querySelector('button').onclick = generateText;
};
