/* global SESSION */
const APPID = '';

/* Openweathermap API KEY */
/* https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY} */
/* exclude param can be a csv of current,minutely,hourly,daily */
/* https://api.openweathermap.org/data/2.5/onecall?lat=45.61&lon=-122.44&exclude=hourly,minutely&appid=${APPID} */
/* Icons: http://openweathermap.org/img/wn/10d@2x.png */
const WEATHER_LOC = 'https://api.openweathermap.org/data/2.5/onecall';
const WEATHER_IMG_LOC = 'http://openweathermap.org/img/wn';
const DEMO_MODE = APPID.length === 0 ? true : false;

var MM = (function () {
    var init,
        _getLatLong,
        _convertKTemp,
        _retrieveWeatherData,
        _renderWeatherData,
        _weatherDataError;

    /* Use browser's geolocation capabilities to get latitude and longitude: */
    _getLatLong = (callBack) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            callBack(lat.toFixed(2), long.toFixed(2));
        });
    };

    _retrieveWeatherData = () => {
        let url = WEATHER_LOC + `?lat=${SESSION.lat}&lon=${SESSION.long}&exclude=hourly,minutely&appid=${APPID}`;
        if (!DEMO_MODE) {
            return $.ajax({
                url: url,
                type: 'GET'
            });
            //callBack(JSON.parse('{"lat":45.61,"lon":-122.44,"timezone":"America/Los_Angeles","timezone_offset":-25200,"current":{"dt":1593117638,"sunrise":1593087714,"sunset":1593144181,"temp":297.12,"feels_like":297.18,"pressure":1017,"humidity":60,"dew_point":288.88,"uvi":8.64,"clouds":40,"visibility":16093,"wind_speed":2.6,"wind_deg":230,"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}]},"daily":[{"dt":1593115200,"sunrise":1593087714,"sunset":1593144181,"temp":{"day":298.79,"min":287.89,"max":301.23,"night":287.89,"eve":297.49,"morn":297.12},"feels_like":{"day":298.58,"night":287.83,"eve":297.37,"morn":297.75},"pressure":1016,"humidity":51,"dew_point":287.91,"wind_speed":2.47,"wind_deg":297,"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":20,"uvi":8.64},{"dt":1593201600,"sunrise":1593174137,"sunset":1593230581,"temp":{"day":300.67,"min":287.56,"max":301.08,"night":287.56,"eve":295.25,"morn":290.25},"feels_like":{"day":299.67,"night":286.55,"eve":294.16,"morn":289.98},"pressure":1015,"humidity":40,"dew_point":286.03,"wind_speed":2.62,"wind_deg":305,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":0,"uvi":9.31},{"dt":1593288000,"sunrise":1593260563,"sunset":1593316978,"temp":{"day":293.37,"min":284.66,"max":293.37,"night":284.66,"eve":288.23,"morn":287.61},"feels_like":{"day":289.96,"night":283.03,"eve":284.7,"morn":285.81},"pressure":1013,"humidity":45,"dew_point":281.11,"wind_speed":4.17,"wind_deg":310,"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":100,"uvi":7.89},{"dt":1593374400,"sunrise":1593346991,"sunset":1593403374,"temp":{"day":291.88,"min":284.54,"max":293.6,"night":284.54,"eve":291.39,"morn":285.21},"feels_like":{"day":290.82,"night":283.99,"eve":288.95,"morn":283.97},"pressure":1008,"humidity":57,"dew_point":283.4,"wind_speed":1.59,"wind_deg":269,"weather":[{"id":501,"main":"Rain","description":"moderate rain","icon":"10d"}],"clouds":66,"rain":3.85,"uvi":6.85},{"dt":1593460800,"sunrise":1593433420,"sunset":1593489767,"temp":{"day":296.7,"min":285.68,"max":297.89,"night":285.68,"eve":294.44,"morn":287.29},"feels_like":{"day":296.01,"night":285.74,"eve":294.74,"morn":286.45},"pressure":1014,"humidity":46,"dew_point":284.49,"wind_speed":1.55,"wind_deg":215,"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":48,"uvi":6.96},{"dt":1593547200,"sunrise":1593519852,"sunset":1593576157,"temp":{"day":291.17,"min":285.95,"max":291.69,"night":285.95,"eve":288.82,"morn":286.51},"feels_like":{"day":290.34,"night":284.19,"eve":285.92,"morn":285.6},"pressure":1016,"humidity":63,"dew_point":284.13,"wind_speed":1.59,"wind_deg":269,"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":100,"rain":0.58,"uvi":7.11},{"dt":1593633600,"sunrise":1593606285,"sunset":1593662545,"temp":{"day":289.8,"min":283.13,"max":291.06,"night":283.13,"eve":288.53,"morn":286.14},"feels_like":{"day":288.56,"night":281.76,"eve":286.29,"morn":284.36},"pressure":1016,"humidity":69,"dew_point":284.15,"wind_speed":2.21,"wind_deg":253,"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":100,"rain":1.02,"uvi":7.1},{"dt":1593720000,"sunrise":1593692721,"sunset":1593748931,"temp":{"day":292.22,"min":283.63,"max":294.95,"night":283.63,"eve":292.01,"morn":284.98},"feels_like":{"day":290.13,"night":282.69,"eve":290.56,"morn":283.98},"pressure":1017,"humidity":47,"dew_point":280.69,"wind_speed":2.15,"wind_deg":318,"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":78,"uvi":7.59}]}'));
        }
    };

    _renderWeatherData = (wData) => {
        let $forecast = $('#forecast');
        SESSION.wData = wData;
        /* Today's Date */
        $('#app-date').html(moment().format("dddd, MMMM Do YYYY"));
        /* Weather Image */
        $('#main-img-today').attr({src: `${WEATHER_IMG_LOC}/${wData.current.weather[0].icon}@2x.png`});
        /* Min Description */
        $('#main-description').html(wData.current.weather[0].description);
        /* Main Temperature */
        $('#main-temp').html(`${_convertKTemp(wData.current.temp, 'F')}&deg;F`);
        /* Day starts */
        $('#main-sunrise').html(moment.unix(wData.current.sunrise).format('h:mm A'));
        /* Day Ends */
        $('#main-sunset').html(moment.unix(wData.current.sunset).format('h:mm A'));
        /* Cloud Cover */
        $('#main-cloud-cover').html(`${wData.current.clouds}%`);
        /* Humidity */
        $('#main-humidity').html(`${wData.current.humidity}%`);
        /* Wind Speed */
        $('#main-wind-speed').html(`${wData.current.wind_speed} Mph`);
        /* Clear Forecast */
        $forecast.empty();
        wData.daily.splice(3);
        wData.daily.forEach((day, idx) => {
            let template = `
            <div class="d-flex py-2">
                <div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
                </div>
                <div>
                    <div class="d-flex flex-column">
                        <div><h6>${moment.unix(day.dt).format('dddd')} (${moment.unix(day.dt).to(moment.unix(day.dt).add(idx, 'day'))})</h6></div>
                        <div>${moment.unix(day.dt).format('ll')}</div>
                        <div><strong class="capitalize">${day.weather[0].description}</strong></div>
                        <div>
                            Temperatures
                            ${_convertKTemp(day.temp.min, 'F')}&deg;F
                            (min)
                            &nbsp;
                            ${_convertKTemp(day.temp.max, 'F')}&deg;F
                            (max)
                        </div>
                    </div>
                </div>
            </div>`;
            $(template).appendTo($forecast);
            console.log(day);
        });
    };

    _weatherDataError = (err, request) => {
        console.log('ERROR Retrieving Weather Data.');
        console.log(err);
        console.log(request||'No Request');
    };

    _convertKTemp = (kelvin, to) => {
        let result = kelvin;
        if (to === 'F') {
            /* Kelvin to Fahrenheit */
            result = (kelvin - 273.15) * (9 / 5);
        } else if (to === 'C') {
            /* Kelvin to Celsius */
            result = kelvin - 273.15;
        }
        return result.toFixed(1);
    };

    init = () => {
        if (DEMO_MODE) {
            alert('No APPID found, please request an APPID ' +
            'from openweatermap.com and add it to this project, ' +
            'see README for more information\n\nThe system will now be in DEMO mode.');
        }
        _getLatLong((lat, long) => {
            SESSION.lat = lat;
            SESSION.long = long;
            _retrieveWeatherData().then(_renderWeatherData).fail(_weatherDataError);
        });
    };

    return {
        init: init
    };
}());