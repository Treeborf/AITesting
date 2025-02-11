require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;

app.post('/generate', async (req, res) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: req.body.input }],
                max_tokens: 100
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch response." });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));

async function generateText() {
    const input = document.getElementById('input').value;
    const outputDiv = document.getElementById('output');

    if (!input) {
        outputDiv.innerText = 'Please enter some text.';
        return;
    }

    outputDiv.innerText = 'Generating...';

    try {
        const response = await fetch("http://localhost:3000/generate", {
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
