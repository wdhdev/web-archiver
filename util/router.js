const { Router } = require("express");

const router = Router();
const routes = require("./routes");

router.get("/", async (req, res) => {
    routes.index(req, res);
})

router.post("/api/archive", async (req, res) => {
    routes.api.archive(req, res);
})

router.get("/api/archives", async (req, res) => {
    routes.api.archives(req, res);
})

router.get("/archives", async (req, res) => {
    routes.archives(req, res);
})

module.exports = router;