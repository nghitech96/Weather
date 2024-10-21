const request = require("request-promise");

const getWeather = async (location) => {
    const access_key = "beccf78c052947cc91e103909242605";
    const url = `https://api.weatherapi.com/v1/current.json?key=${access_key}&q=${location}`;
    try {
        const res = await request(url);
        const data = JSON.parse(res);
        const weather = {
            region: data.location.region,
            country: data.location.country,
            temp_c: data.current.temp_c,
            wind_mph: data.current.wind_mph,
            precip_mm: data.current.precip_mm,
            cloud: data.current.cloud,
        };
        console.log(weather);
        return weather;
    } catch (error) {
        return {
            isSuccess: false,
            error,
        };
    }
};

const express = require('express');
const app = express();
const path = require('path');
const hbs = require('express-handlebars');
const pathPublic = path.join(__dirname, './public');
app.use(express.static(pathPublic));

// https://localhost:7000/
app.get("/", async (req, res) => {
    const params = req.query;
    console.log(params);
    const location = params.address;

    const weather = await getWeather(location);
    console.log(weather);
    if (location){
        res.render("weather", {
            status: true,
            region: weather.region,
            country: weather.country,
            temp_c: weather.temp_c,
            wind_mph: weather.wind_mph,
            precip_mm: weather.precip_mm,
            cloud: weather.cloud
        });
    } else {
        res.render("weather", {
            status: false,
        });
    }   
});
app.set('view engine', 'hbs');

const port = 7000;
app.listen(port, () => {
    console.log(`app run on port 7000`);
});
