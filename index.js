const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/game', async (req, res) => {
    const { word, lastWord, wordHistory } = req.body;

    if (!word || word.length < 4) {
        return res.json({ message: "Word must be at least 4 letters long.", error: true });
    }

    const firstLetter = word.charAt(0).toLowerCase();
    const lastLetter = lastWord ? lastWord.slice(-1).toLowerCase() : null;

    if (lastWord && firstLetter !== lastLetter) {
        return res.json({ message: `Word must start with '${lastLetter}'.`, error: true });
    }

    if (wordHistory.includes(word.toLowerCase())) {
        return res.json({ message: "Word has already been used!", error: true });
    }

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (response.status === 200) {
            return res.json({ message: "Valid word!", word, error: false });
        } else {
            return res.json({ message: "Invalid word!", error: true });
        }
    } catch (error) {
        return res.json({ message: "Error validating word.", error: true });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
