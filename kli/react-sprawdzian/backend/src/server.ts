import slow from "slow.ts";
import express from "express";

interface Row {
  id: number;
  desc: number;
  postTime: number;
  postPrice: number;
  buyer: number;
}

let opinions = [
  {
    id: 0,
    desc: 1,
    postTime: 1,
    postPrice: 1,
    buyer: 1,
  },
] as Row[];

const app = express();

app.use(express.json());
// const router = app.router!;

app.get("/", (_req, res) => {
  res.json(opinions);
});

app.post("/add", (_req, res) => {
  opinions.push({
    id: opinions[opinions.length - 1]!.id + 1 ?? 0,
    desc: 3,
    postTime: 3,
    postPrice: 3,
    buyer: 3,
  });
  res.send("ok");
});

app.post("/edit", (req, res) => {
  for (let i = 0; i < opinions.length; i++) {
    if (opinions[i]!.id == req.body.id) {
      opinions[i][req.body.key] = req.body.value;
    }
  }
  res.send("ok");
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  opinions = opinions.filter((opinion) => opinion.id !== id);
  res.send("ok");
});

app.listen(5000);
