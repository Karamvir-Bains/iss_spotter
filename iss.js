const request = require("request");

const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    let parseBody = null;
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    parseBody = JSON.parse(body);
    return callback(error, parseBody["ip"]);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) return callback(error, null);
    const parseBody = JSON.parse(body);
    if (!parseBody.success) {
      const message = `Success status was ${parseBody.success}. Server message says: ${parseBody.message} when fetching for IP ${parseBody.ip}`;
      callback(Error(message), null);
      return;
    }
    const { latitude, longitude } = parseBody;
    return callback(error, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coordinates, callback) {
  const { latitude, longitude } = coordinates;
  request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const message = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(Error(message), null);
      return;
    }
    const parseBody = JSON.parse(body);
    return callback(error, parseBody["response"]);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) return callback(error, null);
      fetchISSFlyOverTimes(coordinates, (error, nextPasses) => {
        if (error) return callback(error, null);
        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };