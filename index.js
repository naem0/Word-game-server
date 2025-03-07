const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let wordHistory = []; // Initialize word history array

app.post("/game", async (req, res) => {
    const { word, lastWord } = req.body;

    if (!word || word.length < 3) {
        return res.json({ message: "Word is not valid", error: true });
    }

    const firstLetter = word.charAt(0).toLowerCase();
    const lastLetter = lastWord ? lastWord.slice(-1).toLowerCase() : '';

    if (lastWord && firstLetter !== lastLetter) {
        return res.json({ message: "Word must start with last letter of previous word", error: true });
    }

    if (wordHistory.includes(word.toLowerCase())) {
        return res.json({ message: "Word already used", error: true });
    }

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (response.status === 200) {
            wordHistory.push(word.toLowerCase()); // Add word to history
            return res.json({ message: "Valid word", word: word, code: 200, error: false });
        } else {
            return res.json({ message: "Not a valid word", error: true });
        }
    } catch (error) {
        console.error(error);
        return res.json({ message: "Error validating word", error: true });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
