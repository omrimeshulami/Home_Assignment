import Express from "express";
import { getBestRatesForAll, updateRates } from "./utils.js";
import moment from "moment";
//SETTING
const PORT = 3000;
const INTERVAL_TIME = 10000;

const app = Express();

//note: if the initial data doesnt have all the combination of the rates this function will feel the missing rates
getBestRatesForAll();

app.get("/", (req, res) => {
  const rates = getBestRatesForAll();
  res.send(rates);
});

app.listen(PORT, () => console.log("Listening on port: " + PORT));

//updating all every 10 seconds and saving in the mok
setInterval(function () {
  updateRates();
  console.log(`LAST RATES UPDATE: ${moment().format("MMM Do YYYY, h:mm:ss a")}`);
}, INTERVAL_TIME);
