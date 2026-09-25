package com.ipweather.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ipweather.model.City;
import com.ipweather.model.Forecast;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

public class ForecastService {

    private static final String API_URL =
            "https://api.open-meteo.com/v1/forecast";

    private final HttpClient httpClient;

    public ForecastService() {
        httpClient = HttpClient.newHttpClient();
    }

    public List<Forecast> getForecast(City city)
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
                + "&daily="
                + "weather_code,"
                + "temperature_2m_max,"
                + "temperature_2m_min"
                + "&forecast_days=5"
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
                    "Forecast API returned HTTP "
                    + response.statusCode()
            );
        }

        JsonObject root =
                JsonParser.parseString(
                        response.body()
                ).getAsJsonObject();

        if (!root.has("daily") ||
                root.get("daily").isJsonNull()) {

            throw new IOException(
                    "Forecast data is missing."
            );
        }

        JsonObject daily =
                root.getAsJsonObject("daily");

        JsonArray dates =
                daily.getAsJsonArray("time");

        JsonArray maxTemperatures =
                daily.getAsJsonArray(
                        "temperature_2m_max"
                );

        JsonArray minTemperatures =
                daily.getAsJsonArray(
                        "temperature_2m_min"
                );

        JsonArray weatherCodes =
                daily.getAsJsonArray(
                        "weather_code"
                );


        List<Forecast> forecast =
                new ArrayList<>();


        int numberOfDays =
                Math.min(
                        5,
                        dates.size()
                );


        for (int i = 0;
             i < numberOfDays;
             i++) {

            String date =
                    dates.get(i)
                            .getAsString();

            double maxTemperature =
                    maxTemperatures.get(i)
                            .getAsDouble();

            double minTemperature =
                    minTemperatures.get(i)
                            .getAsDouble();

            int weatherCode =
                    weatherCodes.get(i)
                            .getAsInt();


            Forecast day =
                    new Forecast(
                            date,
                            maxTemperature,
                            minTemperature,
                            weatherCode
                    );


            forecast.add(day);
        }


        return forecast;
    }
}