const express = require("express");
//http request api
const https = require("https");
// taking input from the user through the server
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs')
//parsing through the body of the post request 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html");

})

app.get("/result", function (req, res) {
    res.sendFile(__dirname + "/views/result.ejs");
    res.render("result", {
        data: description, temp: temprature, hum: humidity, wind: windSpeed, image: imageUrl,
        city: query
    });

})

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/views/404.ejs");
    res.render("404", { title: "404 page" });
})




let description = "";
let temprature = "";
let humidity = "";
let windSpeed = "";
let iconw = 0;
let imageUrl = "";
let query = "";

app.post("/", function (req, res) {


    query = req.body.cityName;
    const apiId = "fcdb729266b11a0e1b99e8cb2c53ac00";
    const unit = "metric";
    //getting the data through api id.
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiId + "&units=" + unit;
    https.get(url, function (response) {
        //it will give the status code
        console.log(response.statusCode);
        //organising our data  in javascript objects JSON.parse is to converting hexadecimal to javascript object
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);

            // console.log(weatherData);

            // //taking the data and storing it into variables



            // writing the data
            // res.write("<h1>The temperature in " + query + " is " + temprature + " degree celcius</h1>");
            // res.write("<p>The Weather is currently " + description + "<p>");
            // res.write("<img src=" + imageUrl + ">");
            //and lastly sending the data over the server

            if (response.statusCode == 200) {
                temprature = weatherData.main.temp;
                description = weatherData.weather[0].description;
                humidity = weatherData.main.humidity;
                windSpeed = weatherData.wind.speed
                iconw = weatherData.weather[0].icon;
                imageUrl = "http://openweathermap.org/img/wn/" + iconw + "@2x.png";
                return res.redirect("/result")
            }

            else
                return res.redirect("*");





        })

    })

})


app.listen(4000, function () {
    console.log("Server is running on port 4000");
})


