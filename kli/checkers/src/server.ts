import express from "express";

interface PlayerInterface {
  username: string;
  color: "black" | "white";
}

const players: PlayerInterface[] = [];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("./static/dist"));

app.post("/status", (req, res) => {
  res.send({ status: "Api active" });
});

app.listen(5000, () => {});
