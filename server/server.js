import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


app.post("/api/ask", async(req, res)=>{
    const {question} = req.body;
    try{

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents:[{ parts:[{text:question}] }]
            }
        );

        console.log("Full API response:\n", JSON.stringify(response.data, null, 2));

        const aiText = response.data.candidates[0].content.parts[0].text;

        res.json({ reply:aiText });
    }catch(error){
            console.error(error.response?.data || error);
    res.status(500).json({ reply: "AI request failed" })
    }
});

app.listen(5000, ()=>console.log("Server is runing on port 5000"));