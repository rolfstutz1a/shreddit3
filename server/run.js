/**
 * This code starts up the server.
 * It listens to the port 8640
 */
var app = require("../app");

app.set("port", process.env.PORT || 8640);

var server = app.listen(app.get("port"), function() {
  console.log("express server listening on port " + server.address().port);
});
