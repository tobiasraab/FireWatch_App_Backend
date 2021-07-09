//-------------------------------------------------------------------------------------environment variables
if (process.env.NODE_ENV == 'production') {
    require('dotenv').config({
        path: './../.env'
    });
}

// DB_URI => Mongo DB Database Uri
const dbUri = process.env.DB_URI



//-------------------------------------------------------------------------------------modules
// mongodb
const MongoClient = require('mongodb').MongoClient
const uri = dbUri
let db
const dbclient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
let ObjectId = require('mongodb').ObjectId

// express
const express = require('express')
const app = express()
const port = process.env.DATA_SERVICE_PORT
const portUser = process.env.USER_SERVICE_PORT


const serverAddress = process.env.SERVER_ADDRESS
// uuid
const {
    v4: uuidv4
} = require('uuid')
// cors
const cors = require('cors')
const corsSettings = {
    cors: {
        origin: serverAddress + '8080',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
}
//axios
const axios = require('axios')



//--------------------------------------------------------------------------------------------------------------------------------------------------------------------main
// ------------------------------------------------------------------------------------------------------------------------------------API Endpoints
//conect to database
let userData
let forestData
let weatherData
let sensorData


dbclient.connect(err => {
    console.log("Database Service connected to Database: FireWatch")
    db = dbclient.db("FireWatch")
    userData = db.collection("userData")
    forestData = db.collection("forests")
    weatherData = db.collection("weather")
    sensorData = db.collection("sensorData")
})

//init API
app.use(express.json())
app.use(cors(corsSettings))
app.use(express.urlencoded({
    extended: true
}))
app.listen(port, () => {
    console.log(`sensor data service live @ ${serverAddress}${port}`)
})

// weather Endpoint
app.post('/api/weather', (req, weatherRes) => {
    userData.findOne({
            email: req.body.email
        })
        .then((dbres) => {
            if (req.body.token && dbres) {

                //check token
                const uri = serverAddress + portUser + '/api/checkSession'
                let checkSessionData = {
                    token: req.body.token,
                    userId: dbres._id.toString()
                }
                axios.post(uri, checkSessionData)
                    .then((checkRes) => {
                        if (checkRes.data.checkSession) {
                            let id = new ObjectId(req.body.forestId)
                            weatherData.findOne({
                                    forest_id: id
                                })
                                .then((wdbres) => {
                                    weatherRes.status(200).send({
                                        action: "get weather data",
                                        weatherData: wdbres,
                                        success: true,
                                    })
                                })
                        }
                    })
                    .catch((err) => {
                        console.log("ERROR_CHECK_SESSION: ", err)
                    })
            }
        })
        .catch((err) => {
            console.log("ERROR_CHECK_SESSION: ", err)
        })
})



// sensorData Endpoint
app.post('/api/sensorData', (req, sensorRes) => {
    userData.findOne({
            email: req.body.email
        })
        .then((dbres) => {
            if (req.body.token && dbres) {
                //check token

                const uri = serverAddress + portUser + '/api/checkSession'
                let checkSessionData = {
                    token: req.body.token,
                    userId: dbres._id.toString()
                }
                axios.post(uri, checkSessionData)
                    .then((checkRes) => {
                        if (checkRes.data.checkSession) {
                            let id = new ObjectId(req.body.forestId)
                            sensorData.find({
                                    forest_id: id
                                })
                                .toArray()
                                .then(sdbres => {
                                    sensorRes.status(200).send({
                                        action: "get sensor data",
                                        sensorData: sdbres,
                                        success: true,
                                    })
                                })
                        }
                    })
                    .catch((err) => {
                        console.log("ERROR_CHECK_SESSION: ", err)
                    })
            }
        })
})



// forestData Endpoint
app.post('/api/forestData', (req, forestRes) => {
    userData.findOne({
            email: req.body.email
        })
        .then((dbres) => {
            if (req.body.token && dbres) {
                //check token

                const uri = serverAddress + portUser + '/api/checkSession'

                let checkSessionData = {
                    token: req.body.token,
                    userId: dbres._id.toString()
                }
                axios.post(uri, checkSessionData)
                    .then((checkRes) => {
                        if (checkRes.data.checkSession) {
                            let id = new ObjectId(req.body.forestId)
                            forestData.findOne({
                                    _id: id
                                })
                                .then((fbres) => {
                                    forestRes.status(200).send({
                                        action: "get forest data",
                                        forestData: fbres,
                                        success: true,
                                    })
                                })
                        }
                    })
                    .catch((err) => {
                        console.log("ERROR_CHECK_SESSION: ", err)
                    })
            }
        })
})