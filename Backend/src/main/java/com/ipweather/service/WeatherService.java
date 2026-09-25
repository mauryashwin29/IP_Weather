package com.ipweather.service;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ipweather.model.City;
import com.ipweather.model.Weather;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class WeatherService {

    private static final String API_URL =
            "https://api.open-meteo.com/v1/forecast";

    private final HttpClient httpClient;

    public WeatherService() {
        httpClient = HttpClient.newHttpClient();
    }

    public Weather getCurrentWeather(City city)
            throws IOException, InterruptedException {

        if (city == null) {
            throw new IllegalArgumentException(
                    "City cannot be null."
            );
        }

        String url =
                API_URL
                + "?latitude=" + city.getLatitude()
                + "&longitude=" + city.getLongitude()
                + "&current="
                + "temperature_2m,"
                + "relative_humidity_2m,"
                + "apparent_temperature,"
                + "weather_code"
                + "&timezone=auto";

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .GET()
                        .build();

        HttpResponse<String> response =
                httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

        if (response.statusCode() != 200) {

            throw new IOException(
                    "Weather API returned HTTP "
                    + response.statusCode()
            );
        }

        JsonObject root =
                JsonParser.parseString(
                        response.body()
                ).getAsJsonObject();

        if (!root.has("current") ||
                root.get("current").isJsonNull()) {

            throw new IOException(
                    "Current weather data is missing."
            );
        }

        JsonObject current =
                root.getAsJsonObject("current");


        double temperature =
                current
                        .get("temperature_2m")
                        .getAsDouble();


        int humidity =
                current
                        .get("relative_humidity_2m")
                        .getAsInt();


        double feelsLike =
                current
                        .get("apparent_temperature")
                        .getAsDouble();


        int weatherCode =
                current
                        .get("weather_code")
                        .getAsInt();


        return new Weather(
                city.getName(),
                city.getCountry(),
                temperature,
                feelsLike,
                humidity,
                weatherCode
        );
    }
}