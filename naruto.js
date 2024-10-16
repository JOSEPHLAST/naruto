import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

let quiz = [];
let score = 0;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "josephlast8",
    port: 5433,
});

db.connect();

db.query("SELECT * FROM naruto", (err, res) => {
    if(err){
        console.error(`Error fetching query`, err.stack);
    } else {
        quiz = res.rows;
    }
    db.end();
});

let currentQuestion = {};

app.get("/", async (req, res) => {
    score = 0;
    console.log("Loaded");
    await nextQuestion();
    res.render("naruto.ejs", {question: currentQuestion});
});

app.post("/submit", (req, res) => {
    try{
    let answer = req.body.answer.trim();
    let isCorrect = false;
    if(currentQuestion.ninja.toLowerCase() === answer.toLowerCase()){
        score++;
        isCorrect = true;
    }
    nextQuestion();
    res.render("naruto.ejs", {totalScore: score, wasCorrect: isCorrect, question: currentQuestion});
    }
    catch(error){
        console.error(error.message);
        res.render("naruto.ejs", {error: `An error has occured.`});
    }
});

function nextQuestion() {
    const randomPower = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomPower;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
})