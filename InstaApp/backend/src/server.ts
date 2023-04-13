import slow from "slow.ts";

const app = new slow();
const router = app.router!;

router.route("get", "/status", (_req, res) => {
  res.send({ status: "ok" });
});

app.listen(5000);
