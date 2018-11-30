const express = require("express"),
    app = express(),
    path = require("path"),
    router = express.Router;

let pluginVersion = require("./package.json").version;

app.set("views", path.join(__dirname, "dist"));
app.set('view engine', 'ejs');
app.use("/", express.static(path.join(__dirname, "dist")));
app.get("*", function (req, res) {
    res.render("index", {
        path: req.url,
        version: pluginVersion
    });
});
var server = app.listen((process.env.PORT || 8800), function () {
    console.log("Node server started at PORT:" + server.address().port);
});