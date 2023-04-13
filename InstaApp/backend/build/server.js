import slow from "slow.ts";
import formidable from "formidable";
const app = new slow();
const router = app.router;
router.route("get", "/status", (_req, res) => {
    res.send({ status: "ok" });
});
router.route("post", "/images", (req, res) => {
    const form = formidable({ multiples: true, uploadDir: "./uploads" });
    console.log(req.body);
    form.parse(req, (err, fields, files) => {
        console.log("fields", fields);
        console.log("files", files);
        res.send({ status: "ok" });
    });
});
router.route("post", "/test", (req, res) => {
    res.send(req.body);
});
app.listen(5000, () => {
    console.log("Server started on port 5000");
});
