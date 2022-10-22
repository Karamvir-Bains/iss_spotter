const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    let day = new Date(pass.risetime);
    day = day.toUTCString();
    const duration = pass.duration;
    console.log(`Next pass at ${day} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) return console.log("It didn't work!", error);
  printPassTimes(passTimes);
});