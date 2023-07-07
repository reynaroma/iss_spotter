const { nextISSTimeForMyLocation } = require('./iss');

nextISSTimeForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't worked!", error);
  }
  printPassTimes(passTimes);
});

const printPassTimes = (passTimes) => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`)
  }
};

// const coords = { latitude: '50.3915811', longitude: '-105.5348562' };

// fetchISSFlyOverTimes(coords, (error, data) => {
//   if (error) {
//     console.log('It didn\' worked!', error);
//     return;
//   }
//   console.log('Output:', data);
// });

// const ip = '204.83.201.198';

// fetchCoordsByIP(ip, (error, data) => {
//   if (error) {
//     console.log("It didn't worked!", error);
//     return;
//   }
//   console.log('It worked!', data);
// });

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("it didn't work!", error);
//     return;
//   }

//   console.log("It worked! Returned IP:", ip);
// });