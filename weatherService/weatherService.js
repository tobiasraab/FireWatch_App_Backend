//-------------------------------------------------------------------------------------environment variables
if (process.env.NODE_ENV == 'production') {
    require('dotenv').config({ path: './../.env' });
}

// DB_URI => Mongo DB Database Uri
const dbUri = process.env.DB_URI

// OW_APIKEY => get free API Key from https://openweathermap.org/price
const apiKey = process.env.OW_APIKEY



//-------------------------------------------------------------------------------------modules
// axios
const axios = require('axios')

//Mongo DB
const MongoClient = require('mongodb').MongoClient
const uri = dbUri
const dbclient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
let db
let weatherData



//----------------------------------------------------------------------------------------funcions
function getForest(){
    forestData.find().forEach((dbres) => {

        let latitude
        let longitude
        
        latitude = dbres.location.latitude.toString()
        longitude = dbres.location.longitude.toString()
        setInterval(()=>{
            apiWeatherCall(dbres, latitude, longitude)
        },10000)
    })
}

function weatherInsert(lastWeatherCall){
    weatherData.insertOne(lastWeatherCall)
        .then((result) => { 
            console.log(`Successfully inserted item with _id: ${result.insertedId}`)
            weatherData.deleteMany({ timestamp: { $ne : lastWeatherCall.timestamp}, coord: lastWeatherCall.coord})
                .then(result => console.log(`Deleted ${result.deletedCount} item.`))
                .catch(err => console.error(`Delete failed with error: ${err}`))
        })
        .catch(err => console.error(`Failed to insert item: ${err}`))
}

function apiWeatherCall(dbres, lat, lon){
    let lastWeatherCall
    const uri = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '6&units=metric&appid=' + apiKey
    axios.get(uri)
        .then(response => {
            lastWeatherCall = response.data
            lastWeatherCall.timestamp = new Date()
            lastWeatherCall.forest_id = dbres._id
            
            weatherInsert(lastWeatherCall)
        })
       .catch(error => {
            if(error){
                console.log("OpenWeatherApi Error: ", error)
            }
      })
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------main
dbclient.connect(err => {
    console.log("Connected to Database FireWatch - Collection: 'weather'")
    db = dbclient.db("FireWatch")
    weatherData = db.collection("weather")
    forestData = db.collection("forests")
    getForest()
})