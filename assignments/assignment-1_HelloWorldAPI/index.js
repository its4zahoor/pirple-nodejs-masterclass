//Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

//Instantiate the server
const server = http.createServer((req, res) => {
  //Get the parsedURL from the request
  const parsedURL = url.parse(req.url, true);
  //Get the path from the parsedURL
  const path = parsedURL.pathname;
  //Get the route from the path
  const route = path.replace(/^\/+|\/+$/g, "");
  //Get the params from query string
  const params = parsedURL.query;
  //Get the method of request
  const method = req.method.toLowerCase();
  //Get the headers of request
  const headers = req.headers;

  //Get the payload
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", data => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    //Determine the handlers for the route or default to Not Found
    const requestHandler = routes[route] || handlers.notFound;

    //Make the data object containing message and other information
    const data = {
      message: "Welcome to Hello World API",
      buffer,
      method,
      params,
      headers
    };

    //Call the handler, pass it data and a callback
    requestHandler(data, (statusCode, payload) => {
      //Use the statusCode or default to 200
      statusCode = statusCode || 200;
      //Use the payload or default to empty object
      payload = payload || {};

      //Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(JSON.stringify(payload));
    });
  });
});

//Start the server, to listen at port 3333
server.listen(3333, () => {
  console.log("listening on port 3333");
});

//Define handlers
const handlers = {};
//the /hello route handler
handlers.hello = (data, callBack) => {
  callBack(200, data);
};
//the Not Found handler
handlers.notFound = (data, callBack) => {
  callBack(404);
};

//Define the routes
const routes = {
  hello: handlers.hello
};
