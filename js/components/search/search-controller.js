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
            this.initialize();
        },
        initialize: function () {
            this.searchView = new SearchView({ rootHolder: '#wrapper', rootSearchResultHolder: '.cities' });
            this.weatherDataCollection = new WeatherDataCollection();
            this.isSearching = false;

            emitter.on('searchStateHasChanged', _.debounce(this.getPlacesPredictions, 500), this);
            emitter.on('addCityToCollection', this.addCity, this);
            emitter.on('addCityData', this.saveToLocalStorage, this);
            emitter.on('transformDegrees', this.changeTypeOfDegrees, this);
            emitter.on('updateSlides', this.updateWeatherData, this);

            var self = this;
            $('.delete-btn').click(function() {
                $('.cities input[type=checkbox]').each(function() {
                    if ($(this).is(':checked')) {
                        var cityName = $(this).parent().find('.city-text').text();
                        self.weatherDataCollection.removeCityData(cityName);
                        self.saveToLocalStorage();
                    }
                });
                $('.cities').empty();

                _(self.weatherDataCollection.weatherDataArray).forEach(function (cityData) {
                    self.searchView.renderSearchResult(cityData, false, $('.degrees.active').data('identifier'));
                });
            });

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
                this.isSearching = false;
                return;
            }
            this.isSearching = true;
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
                });

                $.when.apply(undefined, promises).then(function(data) {

                    var citiesData = Array.from(arguments);

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
                    var geocoderDeferred = GoogleGeoService.getCoordinatesForAutocompleteService(cityName);

                    var forecastDeferred = geocoderDeferred.then(function(LtdLng) {
                        return ForecastIOService.getForecastIOResponse(LtdLng.lat(), LtdLng.lng(), cityName);
                    });
                    promises.push(forecastDeferred);
                }
            });

            $.when.apply(undefined, promises).then(function() {

                var citiesData = Array.from(arguments);

                if (promises.length === 1) {
                    citiesData = [citiesData];
                }

                _(citiesData).forEach(function (cityData) {
                    cityData[1].cityName = cityData[0];
                    var cityElement = self.weatherDataCollection.filterData(new CityWeather(cityData[1]));
                    self.weatherDataCollection.addCityData(cityElement, false);
                });

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
                self.saveToLocalStorage(self.weatherDataCollection);

                if (self.isSearching) return;

                self.searchView.clearSearchResult();

                _(self.weatherDataCollection.weatherDataArray).forEach(function (cityData) {
                    self.searchView.renderSearchResult(cityData, false, self.getTypeOfDegrees());
                });
            });
        },


        saveToLocalStorage: function() {
            if (modernizr.localstorage && this.weatherDataCollection.size()) {

                var citiesNames = [];
                this.weatherDataCollection.weatherDataArray.forEach(function(cityData) {
                    citiesNames.push(cityData.cityName);
                });
                localStorage['citiesNames'] = JSON.stringify(citiesNames);
                if (!localStorage['typeOfDegrees']) {
                    localStorage['typeOfDegrees'] = $('.degrees.active').data('identifier');
                }
            }
        },
        restoreCollectionFromLocalStorage: function() {
            if (modernizr.localstorage && localStorage['citiesNames']) {
                var citiesNames = JSON.parse(localStorage['citiesNames']);
                this.updateWeatherData(citiesNames);
            }
        }
    });

    return SearchController;
});