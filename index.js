const express = require('express')
const database = require('./config/database.js')
var path = require('path');
const bodyParser = require("body-parser") 
const flash = require("express-flash") 
const cookieParser = require("cookie-parser") 
const session = require("express-session") 
var methodOverride = require('method-override') 

const moment = require("moment") 

require("dotenv").config() 

const route = require('./routes/client/index.route') 
const routeAdmin = require('./routes/admin/index.route.js')

database.connect() 

const app = express()
const port = process.env.PORT

const settingGeneral = require("./model/settings-general.model");
(async()=>{
  const settingsGeneral = await settingGeneral.findOne({});
  app.locals.settingsGeneral = settingsGeneral;
})(); 

app.use(express.static(`${__dirname}/public`))  

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.locals.prefixAdmin = require("./config/system.js").prefixAdmin 
app.locals.moment = moment

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')

app.use(methodOverride('_method'))

app.use(cookieParser('Tung cookie'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());


const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const server = createServer(app);
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('A user connected');
});
global._io = io; 


const dwhAction = require("./DWH/dwh.js");
dwhAction();

route(app) 
routeAdmin(app)
const clientApiRoute = require("./routes/client/api/index.route.api");
clientApiRoute(app);

app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})