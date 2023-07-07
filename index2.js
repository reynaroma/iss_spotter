const { nextISSTimeForMyLocation } = require('./iss_promised');

const printPassTimes = (passTimes) => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`)
  }
};

nextISSTimeForMyLocation()
  .then((passTimes) => {
    printPassTimes(passTimes);
  })
  .catch((error) => {
    printPassTimes("It didn't work:", error.message);
  });

  // fetchMyIP()
  // .then(fetchCoordsByIP)
  // .then(fetchISSFlyOverTimes)
  // .then(body => console.log(body));