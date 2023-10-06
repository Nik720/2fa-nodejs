import express from "express";

const app = express();

app.get('/', (req, res) => {
	res.json({status: 200, message: "App is running "})
})

app.listen(3000, () => {
    console.log("Server is Successfully Running, and App is listening on port "+ 3000)
});


