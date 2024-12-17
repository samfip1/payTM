const express = require("express");
const Rootrouter = require("./Routes/index")
app.use(cors())
app.use(express.json());        // a body parser

const app = express();
app.use("/api/v1", Rootrouter)  //all request which are coming here go to Rootrouter


const cors = require("cors")

app.listen(3000)
