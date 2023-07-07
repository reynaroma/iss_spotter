/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = (callback) => {
  const url = 'https://api.ipify.org/?format=json';
  // use request to fetch IP address from JSON API
  request(url, (error, response, body) => {
    const ip = JSON.parse(body).ip;

    if (error) {
      callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    callback(null, ip);
  });
};
/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchCoordsByIP = (ip, callback) => {
  const url = `https://ipwho.is/${ip}`;

  request(url, (error, response, body) => {
    const geoLoc = JSON.parse(body);
    const { latitude, longitude } = geoLoc;

    if (error) {
      callback(error, null);
    }
    // error-handling
    if (!geoLoc.success) {
      const message = `Success status was ${geoLoc.success}. Server message says: ${geoLoc.message} when fetching for IP ${geoLoc.ip}`;
      callback(Error(message), null);
      return;
    }

    callback(null, { latitude, longitude });
  });
};
/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coords, callback) => {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    const parsedBody = JSON.parse(body).response;

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const message = `Status Code ${response.statusCode} when fetching the ISS pass times: ${body}`;
      return;
    }

    callback(null, parsedBody);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimeForMyLocation = (callback) => {

  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null)
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, passTimes);
      });
    });
  }); 
};

module.exports = { nextISSTimeForMyLocation };