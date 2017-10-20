const express = require("express"),
    app = express(),
    path = require("path"),
    router = express.Router;

app.set("views", path.join(__dirname, "src"));
app.set('view engine', 'ejs');
app.use("/", express.static(path.join(__dirname, "src")));
app.get("*", function (req, res) {
    res.render("index", {
        path: req.url
    });
});
var server = app.listen((process.env.PORT || 8800), function () {
    console.log("Node server started at PORT:" + server.address().port);
});