# Fire Watch Application Backend

## About Fire Watch

Fire Watch is an open source product to help prevent forest fires in different climatic zones.
Our sensor stations will track the environmental conditions in your forest to give you all the information you need to prevent a fire.


## Installation

### 1) customize Dockerfile
```
LABEL traefik.http.routers.<PROJECT_NAME>.rule="Host(`<PROJECT_NAME>.<YOUR_SERVER_ADRESS>`)"
```
### 2) create Docker Container
1. create Docker image
2. create Container out of the image
     
### 3) define environmental variables
DB_USER: <YOUR_DATABASE_USER><br>
DB_PWD:  <YOUR_DATABASE_PWD>




## Usage

1) contact us to buy our Service and we will install our sensors in your forest
2) register Forest via your individual forest Code
3) track your sensor data to prevent forest fires
4) feel free to share your Fire Watch data with other Fire Watch Users

## Communication Technologie
### HTTP
Framework:<br>
express https://expressjs.com/


## Software Architecture

### Frontend Application
https://github.com/MalteOp/fire_watch_frontend

### Backend Application
https://github.com/tobiasraab/FireWatch_ApplicationBackend
#### User Service
##### Register new user in database (collection: userData)
API Endpoint:
```
'/api/register'
```
Post Request Needs:
* username
* email
* password
<br>

##### Login existing user (object: sessions[token])
// userService.js
API Endpoint:
```
'/api/login'
```
Post Request Needs:
* email
* password
<br>

##### Register new forest for user database (collection: userData)
API Endpoint:
```
'/api/registerForest'
```
Post Request Needs:
* email
* token for session
* forestCode
<br>

##### Call presence of user (object: sessions[token])
API Endpoint:
```
'/api/callPresence'
```
Post Request Needs:
* email
* token for session
<br>

##### Close user session (delete object: sessions[token])
API Endpoint:
```
'/api/closeSession'
```
Post Request Needs:
* email
* token for session
<br><br><br><br><br><br><br>



#### Database Service
// databaseService.js
##### Get SensorData from database (collection: sensorData)
API Endpoint:
```
'/api/sensorData'
```
Post Request Needs:
* email
* token for session
* forestId
<br>

##### Get forestData from database (collection: forests)
API Endpoint:
```
'/api/forestData'
```
Post Request Needs:
* email
* token for session
* forestId
<br>


##### Get Weather from OpenWeather APi
API Endpoint:
```
'/api/weather'
```
Post Request Needs:
* email
* token for session
* forestId
<br><br><br><br><br><br><br>



#### Weather Service
// weather.js
1) OpenWeather API call:
   ```
      'https://api.openweathermap.org/data/2.5/weather?lat=<latitude>&lon=<longitude>6&units=metric&appid=2f824ee8874eba3b2235a537340b9a22'
   ```
   (OpenWeather https://openweathermap.org/)
2) save API response in database collection 'weather'
3) delete old weather data in collection 'weather'
<br><br><br><br><br><br><br>








### Sensor Backend
https://github.com/tobiasraab/FireWatch_SensorBackend


### MongoDB Database
https://www.mongodb.com/
#### Collection forests:<br>
* 0.2kB per forest
#### Collection sensorDatas:<br>
* 0.45kB per Sensor
#### Collection userData:<br>
* 0.5kB per user
#### Collection weather:<br>
* 0.8kB per forest


### Sensor Backend
https://github.com/tobiasraab/FireWatch_SensorBackend







## Future Work
