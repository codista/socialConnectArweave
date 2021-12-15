import app from "./app"
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT || 3000;




// Listen on http
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log('HTTP Server running on port '+port);
});


//if certificates present, listen on https
var certPath = path.join(__dirname,'cert.crt');
var keyPath = path.join(__dirname,'prv.key');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const httpsServer = https.createServer({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }, app);

  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});
}






//app.listen(port, () => {
  /* eslint-disable no-console */
  //console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
//});
