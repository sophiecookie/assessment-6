const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const Rollbar = require('rollbar');


const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

const rollbar = new Rollbar({
  accessToken: 'd0447772a89e4dda995a548a3ed1cb48',
  captureUncaught: true,
  captureUnhandledRejections: true,
});


app.use(express.json());
app.use(express.static(__dirname + '/public'))
app.use(rollbar.errorHandler());

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {

    // Log an informational event
    rollbar.info('GET /api/robots endpoint accessed');
    
    res.status(200).send(botsArr);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);

    // Log an error event
    rollbar.error(error);

    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {

    // Log a warning event
    rollbar.warning('GET /api/robots/shuffled endpoint accessed')

    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);

    // Log an error event
    rollbar.error(error);

    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);

    // Log an error event
    rollbar.error(error);

    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);

    // Log an error event
    rollbar.error(error);

    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);

  // Log an informational event
  rollbar.info('Server started and listening on port 8000');

});
