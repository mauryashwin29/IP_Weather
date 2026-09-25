package com.ipweather.controller;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.ipweather.model.City;
import com.ipweather.model.Forecast;
import com.ipweather.model.Weather;
import com.ipweather.service.ForecastService;
import com.ipweather.service.GeocodingService;
import com.ipweather.service.WeatherService;
import com.ipweather.utility.TemperatureConverter;
import com.ipweather.utility.WeatherCondition;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class WeatherController implements HttpHandler {

    private final GeocodingService geocodingService;
    private final WeatherService weatherService;
    private final ForecastService forecastService;

    public WeatherController() {

        geocodingService =
                new GeocodingService();

        weatherService =
                new WeatherService();

        forecastService =
                new ForecastService();
    }

    @Override
    public void handle(HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        /*
         * Handle browser CORS preflight request.
         */
        if ("OPTIONS".equalsIgnoreCase(
                exchange.getRequestMethod())) {

            exchange.sendResponseHeaders(
                    204,
                    -1
            );

            exchange.close();

            return;
        }

        /*
         * Only GET requests are required.
         */
        if (!"GET".equalsIgnoreCase(
                exchange.getRequestMethod())) {

            sendError(
                    exchange,
                    405,
                    "Only GET requests are allowed."
            );

            return;
        }

        try {

            String query =
                    exchange.getRequestURI()
                            .getQuery();

            String cityName =
                    getQueryParameter(
                            query,
                            "city"
                    );


            if (
                    cityName == null ||
                    cityName.isBlank()
            ) {

                sendError(
                        exchange,
                        400,
                        "Please provide a city name."
                );

                return;
            }


            /*
             * STEP 1
             * Convert city name into coordinates.
             */
            City city =
                    geocodingService
                            .findCity(cityName);


            if (city == null) {

                sendError(
                        exchange,
                        404,
                        "City not found."
                );

                return;
            }


            /*
             * STEP 2
             * Get current weather.
             */
            Weather weather =
                    weatherService
                            .getCurrentWeather(city);


            /*
             * STEP 3
             * Get 5-day forecast.
             */
            List<Forecast> forecast =
                    forecastService
                            .getForecast(city);


            /*
             * STEP 4
             * Build simplified response.
             */
            JsonObject response =
                    new JsonObject();


            response.addProperty(
                    "city",
                    city.getName()
            );

            response.addProperty(
                    "country",
                    city.getCountry()
            );


            /*
             * Current temperature
             */
            response.addProperty(
                    "temperatureCelsius",
                    weather.getTemperature()
            );

            response.addProperty(
                    "temperatureFahrenheit",
                    TemperatureConverter
                            .celsiusToFahrenheit(
                                    weather.getTemperature()
                            )
            );


            /*
             * Feels-like temperature
             */
            response.addProperty(
                    "feelsLike",
                    weather.getFeelsLike()
            );

            response.addProperty(
                    "feelsLikeFahrenheit",
                    TemperatureConverter
                            .celsiusToFahrenheit(
                                    weather.getFeelsLike()
                            )
            );


            /*
             * Required humidity
             */
            response.addProperty(
                    "humidity",
                    weather.getHumidity()
            );


            /*
             * Weather condition
             */
            response.addProperty(
                    "weatherCode",
                    weather.getWeatherCode()
            );

            response.addProperty(
                    "condition",
                    WeatherCondition.getDescription(
                            weather.getWeatherCode()
                    )
            );


            /*
             * 5-day forecast
             */
            JsonArray forecastArray =
                    new JsonArray();


            for (Forecast day : forecast) {

                JsonObject forecastObject =
                        new JsonObject();


                forecastObject.addProperty(
                        "date",
                        day.getDate()
                );


                forecastObject.addProperty(
                        "maxTemperature",
                        day.getMaxTemperature()
                );


                forecastObject.addProperty(
                        "minTemperature",
                        day.getMinTemperature()
                );


                forecastObject.addProperty(
                        "maxTemperatureFahrenheit",
                        TemperatureConverter
                                .celsiusToFahrenheit(
                                        day.getMaxTemperature()
                                )
                );


                forecastObject.addProperty(
                        "minTemperatureFahrenheit",
                        TemperatureConverter
                                .celsiusToFahrenheit(
                                        day.getMinTemperature()
                                )
                );


                forecastObject.addProperty(
                        "weatherCode",
                        day.getWeatherCode()
                );


                forecastObject.addProperty(
                        "condition",
                        WeatherCondition.getDescription(
                                day.getWeatherCode()
                        )
                );


                forecastArray.add(
                        forecastObject
                );
            }


            response.add(
                    "forecast",
                    forecastArray
            );


            /*
             * Send JSON response.
             */
            sendJson(
                    exchange,
                    200,
                    response.toString()
            );

        } catch (Exception exception) {

            exception.printStackTrace();

            sendError(
                    exchange,
                    500,
                    "Unable to fetch weather data."
            );
        }
    }


    /*
     * =====================================================
     * QUERY PARAMETER
     * =====================================================
     */

    private String getQueryParameter(
            String query,
            String parameter
    ) {

        if (query == null) {
            return null;
        }


        String[] parameters =
                query.split("&");


        for (String item : parameters) {

            String[] pair =
                    item.split("=", 2);


            if (
                    pair.length == 2 &&
                    pair[0].equals(parameter)
            ) {

                return decodeUrl(
                        pair[1]
                );
            }
        }


        return null;
    }


    /*
     * =====================================================
     * URL DECODING
     * =====================================================
     */

    private String decodeUrl(
            String value
    ) {

        try {

            return java.net.URLDecoder
                    .decode(
                            value,
                            StandardCharsets.UTF_8
                    );

        } catch (Exception exception) {

            return value;
        }
    }


    /*
     * =====================================================
     * CORS
     * =====================================================
     */

    private void addCorsHeaders(
            HttpExchange exchange
    ) {

        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Origin",
                        "*"
                );

        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Methods",
                        "GET, OPTIONS"
                );

        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Headers",
                        "Content-Type"
                );
    }


    /*
     * =====================================================
     * SEND JSON
     * =====================================================
     */

    private void sendJson(
            HttpExchange exchange,
            int statusCode,
            String json
    ) throws IOException {

        byte[] data =
                json.getBytes(
                        StandardCharsets.UTF_8
                );


        exchange.getResponseHeaders()
                .set(
                        "Content-Type",
                        "application/json; charset=UTF-8"
                );


        exchange.sendResponseHeaders(
                statusCode,
                data.length
        );


        try (OutputStream output =
                     exchange.getResponseBody()) {

            output.write(data);
        }
    }


    /*
     * =====================================================
     * SEND ERROR
     * =====================================================
     */

    private void sendError(
            HttpExchange exchange,
            int statusCode,
            String message
    ) throws IOException {

        JsonObject error =
                new JsonObject();

        error.addProperty(
                "error",
                message
        );


        sendJson(
                exchange,
                statusCode,
                error.toString()
        );
    }
}