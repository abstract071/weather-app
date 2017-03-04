define([
    'vendor',
    './city-weather'
], function (Vendor, CityWeather) {
    'use strict';

    var _ = Vendor._,
        emitter = Vendor.util.EventEmitter,
        Class = Vendor.util.Class,
        WeatherDataCollection;

    WeatherDataCollection = Class.extend({
        defaultOptions: {
        },
        constructor: function (/*options*/) {
            this.weatherDataArray = [];
            this.searchResultWeatherData = [];
            this.initialize();
        },
        initialize: function () {},
        getCityData: function (cityName) {
            return _.find(this.weatherDataArray, { cityName: cityName });
        },
        getSearchResultWeatherData: function () {
            return this.searchResultWeatherData;
        },
        setSearchResultWeatherData: function (citiesData) {
            this.searchResultWeatherData = citiesData;
        },
        addCityData: function (weather, isUpdate) {
            try {
                this.weatherDataArray.push(weather);
                emitter.trigger('addCityData', weather);
            } catch (error) {
                console.error("Wrong type of an object");
            }
        },
        removeCityData: function (cityName) {
            _.remove(this.weatherDataArray, function(cityData) { return cityData.cityName === cityName; });
            emitter.trigger('removeSlides', cityName);
        },
        clearCollection: function () {
            this.weatherDataArray = [];
            emitter.trigger('clearCitiesData');
        },
        updateCollection: function (citiesData) {

            this.clearCollection();

            var self = this;
            _(citiesData).forEach(function (cityData) {
                cityData[1].cityName = cityData[0];
                var cityElement = self.filterData(new CityWeather(cityData[1]));
                self.addCityData(cityElement, true);
            });
        },
        filterData: function(weatherData) {
            return _.assign({}, _.pick(weatherData, 'cityName', 'latitude', 'longitude', 'temperature', 'convertToCelsius'),
                _.pick(weatherData.currently, 'icon', 'summary', 'temperature', 'humidity', 'windSpeed'),
                { 'daily': _.reduce(_.initial(weatherData.daily.data, 1), function(resultObj, day, index) {
                    resultObj[index] = _.pick(day, 'icon', 'temperatureMin', 'temperatureMax', 'sunriseTime', 'sunsetTime');
                    return resultObj;
                }, []) },
                { 'hourly': _.reduce(_.initial(weatherData.hourly.data, 25), function(resultObj, hour, index) {
                    resultObj[index] = _.pick(hour, 'icon', 'temperature', 'time');
                    return resultObj;
                }, []) });
        },
        size: function () {
            return this.weatherDataArray.length;
        },
        toJSON: function() {
            return this.weatherDataArray;
        }

    });

    var singletonCollection = (function () {
        var instance;
        function createInstance() {
            return new WeatherDataCollection();
        }
        return {
            getInstance: function() {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            }
        };
    })();

    return singletonCollection.getInstance;
});