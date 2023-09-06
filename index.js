const express = require("express");
const app = express();

require("dotenv").config();
const port = 80;

const Sentry = require("@sentry/node");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

Sentry.init({
    dsn: process.env.sentry_dsn,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()
    ],
    tracesSampleRate: 1.0
})

const router = require("./util/router");

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

if(!fs.existsSync(`${__dirname}/archives`)) fs.mkdirSync(`${__dirname}/archives`);
if(!fs.existsSync(`${__dirname}/archive-data`)) fs.mkdirSync(`${__dirname}/archive-data`);

// Host archives
app.use("/archive", express.static(__dirname + "/archives"));

app.use("/", router);

app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
})
