const fs = require('fs'); 
const https = require('https');
const cors = require('cors');
const app = require('./app');


const port  = process.env.PORT || 3001;
/*const server = http.createServer(app);
server.listen(port);*/

app.use(cors());

https.createServer({
	cert: fs.readFileSync('ssl/certificate.crt'),
    key: fs.readFileSync('ssl/private.key'),    
}, app).listen(port);







