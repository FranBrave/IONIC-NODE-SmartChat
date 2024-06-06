import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello World'
    });
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        if (typeof prompt !== 'string' || !prompt.trim()) {
            res.status(400).send({
                error: "Invalid request: 'prompt' must be a non-empty string."
            });
            return;
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.choices[0].message.content
        });

    } catch (error) {
        console.error("Error while processing request:", error);
        res.status(500).send({
            error: error.message,
            stack: error.stack
        });
    }
});

app.listen(3000, () => console.log('Server is running on port http://localhost:3000'));
