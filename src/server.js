//-----------------------REQUIRE & IMPORTS-----------------------//
import express from 'express'; //<---Express
import { Server as HttpServer } from 'http' //<---Server http
import { Server as IOServer }  from "socket.io"; //<---Socket

import session from 'express-session'//<---Session
import sfs from 'session-file-store' //<---FileStore
const FileStore = sfs(session) //<---FileStore

import  configMySql from './config/configMySql.js';//<---MySQL Config
import SQL from './handlers/productClass.js' //<---Product class using MySQL
import MongoClass from './handlers/messageMongoClass.js';//<---Message class using Mongoose

import fakerRouter from './router/fakerRouter.js'//<---Router random products with Faker

import { normalize,schema } from "normalizr";//<---Normalizer,used on socket
import util from 'util'//<---Util, console log on detail

import mongoose from 'mongoose';
const esquema = mongoose.Schema;
const messageSchema = new esquema({
    author:{
        id:  String,
        name: String,
        lastname: String,
        age: Number,
        alias: String,
        avatar: String,
    },
    text: String
})
//----------CLASSES----------//
const messages = new MongoClass('messages', messageSchema)
const products = new SQL(configMySql,'products')

//-----------------------SERVER-----------------------//
const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//-----------------------MIDDLEWARES-----------------------//

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    store: new FileStore({ path: './sessions', ttl: 300, retries: 0 }),
    secret:'a',
    resave:false,
    saveUninitialized:false,
    cookie: {
        // Session expires after 1 min of inactivity.
        expires: 60000
    }
}))

//----------ROUTER----------//
app.use('/api/products', fakerRouter)

let contador = 0

app.get('/con-session', (req, res) => {

    if (req.session.contador) {
        req.session.contador++
        res.send(`Ud ha visitado el sitio ${req.session.contador} veces.`)
      } else {
        req.session.contador = 1
        res.send('Bienvenido!')

      }
})
  
  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (!err){
        console.log('Logged out')
        res.redirect('/')
      } 
      else res.send({ status: 'Logout ERROR', body: err })
    })
  })
//-----------------------WEBSOCKET-----------------------//

    io.on('connection', async(socket)=>{

        socket.on('logIn', user=>{
            console.log(user)
            socket.emit('logged', user)
        })

        //-------------PRODUCTS-----------------//  
        const productListed = await products.getAll();
       
        socket.emit('showProducts', productListed)
    
        socket.on('newProduct', product =>{
            products.add(product)
            socket.emit('showProducts', productListed)
        })
    
        //-------------MESSAGES-----------------//
        const messagesListed = await messages.getAll();
    
        const authorSchema = new schema.Entity('authors')
    
        const messageSchema = new schema.Entity('messages', {
            author: authorSchema,
        }, {idAttribute:'_id'})
    
        // const chatSchema = new schema.Entity('chats', {
        //     messages: [messageSchema]
        // })    
    
        const normalizedMessages = normalize(messagesListed, [messageSchema])
        // const normalizedMessages = normalize({ id: '1', messages: messagesListed }, chatSchema)
    
        // console.log(util.inspect(normalizedMessages, false, 12, true))
    
        socket.emit('showMessages', normalizedMessages)
        socket.on('newMessage', message =>{
            messages.add(message)
            socket.emit('showMessages',messagesListed)
        })
    })


//-----------------------SERVER CONFIG-----------------------//

const server = httpServer.listen(8080, ()=>{
    console.log(`Server hosted on http://localhost:${server.address().port}/`)
})
server.on('error', (error) => console.log(`Server error: ${error}`));