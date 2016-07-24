/**
 * Created by Vladyslav_Mykhailenk on 1/6/2015.
 */
define([
    'vendor',
    'components/search/search-view',
    './city-weather',
    './weather-data-collection',
    'geoservice',
    'forecastioservice'
], function (Vendor, SearchView, CityWeather, WeatherDataCollection, GoogleGeoService, ForecastIOService) {
    'use strict';

    var $ = Vendor.$,
        _ = Vendor._,
        modernizr = Vendor.Modernizr,
        emitter = Vendor.util.EventEmitter,
        Class = Vendor.util.Class,
        SearchController;

    SearchController = Class.extend({
        defaultOptions: {

        },
        constructor: function (options) {
            this.options = _.extend({}, this.defaultOptions, options);
            //this.tpl = _.template(searchTemplate);
            this.initialize();
            //this.render();
        },
        initialize: function () {
            this.searchView = new SearchView({ rootHolder: '#wrapper', rootSearchResultHolder: '.cities' });
            this.weatherDataCollection = new WeatherDataCollection();

            emitter.on('searchStateHasChanged', _.debounce(this.getPlacesPredictions, 500), this);
            emitter.on('addCityToCollection', this.addCity, this);
            emitter.on('addCityData', this.saveToLocalStorage, this);
            emitter.on('transformDegrees', this.changeTypeOfDegrees, this);
            emitter.on('updateSlides', this.updateWeatherData, this);

            if (modernizr.localstorage && localStorage['citiesNames']) {
                this.restoreCollectionFromLocalStorage();
            } else {
                this.getDataFromGeolocation();
            }
        },
        getDataFromGeolocation: function () {
            var self = this;

            if (modernizr.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) { self.showPosition(position, self); });
            }
        },
        showPosition: function(position, self) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var geocoderDeferred = GoogleGeoService.getAddressForGeolocationRequest(latLng);
            //console.log(position.coords.latitude);
            //console.log(position.coords.longitude);
            var forecastDeferred = ForecastIOService.getForecastIOResponse(position.coords.latitude, position.coords.longitude);

            $.when(geocoderDeferred, forecastDeferred).then(function(cityName, data) {
                data.cityName = cityName;
                var cityElement = self.weatherDataCollection.filterData(new CityWeather(data))/*new CityWeather(data)*/;
                self.weatherDataCollection.addCityData(cityElement, false);
                self.searchView.renderSearchResult(cityElement, false, self.getTypeOfDegrees());
                self.saveToLocalStorage(self.weatherDataCollection);
            });
        },
        getTypeOfDegrees: function() {
            return $('.degrees.active').data('identifier');
        },
        changeTypeOfDegrees: function() {
            var typeOfDegrees = $('.degrees.active').data('identifier');

            $('.sidebar .cities .city-temperature').each(function(index, element) {
                $(this).text($(this).data(typeOfDegrees));
            });
        },
        getPlacesPredictions: function() {

            var self = this,
                promises = [],
                $input = $('input[name=cityname]');

            $('.add-btn').switchClass("icon-add", "icon-check");
            if (!$input.val()) {
                $('.cities').empty();
                $('.add-btn').switchClass("icon-check", "icon-add");
                _(this.weatherDataCollection.weatherDataArray).forEach(function(cityData) {
                    self.searchView.renderSearchResult(cityData, false, self.getTypeOfDegrees());
                });
            }
            var predictionsDeferred = GoogleGeoService.getCitiesPredictions($input.val());
            predictionsDeferred.then(function(data) {
                $('.cities').empty();

                if ( !data ) {
                    return;
                }

                data.forEach(function (obj) {
                    var cityElement;
                    var isChecked = false;
                    var cityName = obj.terms[0].value;

                    _(self.weatherDataCollection.weatherDataArray).forEach(function (cityData) {
                        if (cityData.cityName === cityName) {
                            isChecked = true;
                        }
                    });



                    var forecastDeferred = GoogleGeoService.getCoordinatesForAutocompleteService(cityName).then(function(LtdLng) {
                        return ForecastIOService.getForecastIOResponse(LtdLng.lat(), LtdLng.lng(), cityName);
                    });
                    promises.push(forecastDeferred);



                    //cityElement = new CityWeather({cityName: cityName}, data);
                    //self.searchView.renderSearchResult(cityElement, isChecked);
                });

                $.when.apply(undefined, promises).then(function(data) {

                    var citiesData = Array.from(arguments);

                    //if ( citiesData.length === 0 ) {
                    //    return;
                    //}

                    //debugger;
                    //console.log(arguments);
                    if (promises.length === 1) {
                        citiesData = [citiesData];
                    }

                    self.weatherDataCollection.setSearchResultWeatherData(citiesData.map(function (cityData) {
                        cityData[1].cityName = cityData[0];
                        return self.weatherDataCollection.filterData(new CityWeather(cityData[1]));
                    }));

                    _(self.weatherDataCollection.getSearchResultWeatherData()).forEach(function (cityData) {
                        self.searchView.renderSearchResult(cityData, false, self.getTypeOfDegrees());
                    });
                });
            });

        },
        addCity: function() {

            $('.add-btn').switchClass("icon-check", "icon-add");

            var promises = [],
                self = this;

            $('.cities input[type=checkbox]').each(function(obj) {

                if ($(this).is(':checked')) {
                    var cityName = $(this).parent().find('.city-text').text();
                    //console.log(cityName);
                    var geocoderDeferred = GoogleGeoService.getCoordinatesForAutocompleteService(cityName);

                    var forecastDeferred = geocoderDeferred.then(function(LtdLng) {
                        //console.log(LtdLng);
                        //console.log(LtdLng.A);
                        //console.log(LtdLng.F);
                        return ForecastIOService.getForecastIOResponse(LtdLng.lat(), LtdLng.lng(), cityName);
                    });
                    promises.push(forecastDeferred);
                }
            });

            $.when.apply(undefined, promises).then(function() {

                //var citiesData = Array.prototype.slice.call(arguments);
                var citiesData = Array.from(arguments);

                if (promises.length === 1) {
                    citiesData = [citiesData];
                }

                //if (promises.length > 1) {
                    _(citiesData).forEach(function (cityData) {
                        cityData[1].cityName = cityData[0];
                        var cityElement = self.weatherDataCollection.filterData(new CityWeather(cityData[1]));
                        self.weatherDataCollection.addCityData(cityElement, false);
                    });
                //} else {
                //    citiesData[1].cityName = citiesData[0];
                //    var cityElement = self.weatherDataCollection.filterData(new CityWeather(citiesData[1]));
                //    self.weatherDataCollection.addCityData(cityElement/*new CityWeather(citiesData[1])*/);
                //}

                _(self.weatherDataCollection.weatherDataArray).forEach(function (cityData) {
                    self.searchView.renderSearchResult(cityData, false, self.getTypeOfDegrees());
                });

                self.saveToLocalStorage(self.weatherDataCollection);
            });

            $('input[name=cityname]').val('');
            $('.cities').empty();

        },


        updateWeatherData: function(citiesNames) {

            var promises = [],
                self = this;
                //citiesNames = Array.from(arguments);

            citiesNames.forEach(function(cityName) {

                var geocoderDeferred = GoogleGeoService.getCoordinatesForAutocompleteService(cityName);

                var forecastDeferred = geocoderDeferred.then(function(LtdLng) {
                    return ForecastIOService.getForecastIOResponse(LtdLng.lat(), LtdLng.lng(), cityName);
                });
                promises.push(forecastDeferred);
            });

            $.when.apply(undefined, promises).then(function() {

                var citiesData = Array.from(arguments);

                if (promises.length === 1) {
                    citiesData = [citiesData];
                }

                self.weatherDataCollection.updateCollection(citiesData);

                self.searchView.clearSearchResult();
                _(self.weatherDataCollection.weatherDataArray).forEach(function (cityData) {
                    self.searchView.renderSearchResult(cityData, false, self.getTypeOfDegrees());
                });

                self.saveToLocalStorage(self.weatherDataCollection);
            });
        },


        saveToLocalStorage: function() {
            if (modernizr.localstorage && this.weatherDataCollection.size()) {
                //console.log("Modernizr is working!!!");

                var citiesNames = [];
                this.weatherDataCollection.weatherDataArray.forEach(function(cityData) {
                    citiesNames.push(cityData.cityName);
                });
                //var str = JSON.stringify(this.weatherDataCollection);
                localStorage['citiesNames'] = JSON.stringify(citiesNames);
                if (!localStorage['typeOfDegrees']) {
                    localStorage['typeOfDegrees'] = $('.degrees.active').data('identifier');
                }
            }/* else {
                alert("Sorry, your browser does not support local storage.");
            }*/
        },
        restoreCollectionFromLocalStorage: function() {
            //var self = this;
            if (modernizr.localstorage && localStorage['citiesNames']) {
                var citiesNames = JSON.parse(localStorage['citiesNames']);
                this.updateWeatherData(citiesNames);

                //citiesNames.forEach(function(element) {




                    //var cityElement = new CityWeather(element);
                    //self.weatherDataCollection.addCityData(cityElement);
                    //self.searchView.renderSearchResult(cityElement, /*true*/false, localStorage['typeOfDegrees'] ? localStorage['typeOfDegrees'] : self.getTypeOfDegrees());
                    //$('.cities input[type=checkbox]').prop('checked', false);
                //});
                //emitter.trigger('updateSlides');
            }
        }
    });

    return SearchController;
});