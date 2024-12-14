const express = require("express");
const Rootrouter = require("./Routes/index")

const app = express();
app.use("/api/v1", Rootrouter)  //all request which are coming here go to Rootrouter.
