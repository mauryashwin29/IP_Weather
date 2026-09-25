package com.ipweather.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ipweather.model.City;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class GeocodingService {

    private static final String API_URL =
            "https://geocoding-api.open-meteo.com/v1/search";

    private final HttpClient httpClient;

    public GeocodingService() {
        httpClient = HttpClient.newHttpClient();
    }

    public City findCity(String cityName)
            throws IOException, InterruptedException {

        if (cityName == null ||
                cityName.isBlank()) {

            throw new IllegalArgumentException(
                    "City name cannot be empty."
            );
        }

        String encodedCity =
                URLEncoder.encode(
                        cityName.trim(),
                        StandardCharsets.UTF_8
                );

        String url =
                API_URL
                + "?name=" + encodedCity
                + "&count=1"
                + "&language=en"
                + "&format=json";

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
                    "Geocoding API returned HTTP "
                    + response.statusCode()
            );
        }

        JsonObject root =
                JsonParser.parseString(
                        response.body()
                ).getAsJsonObject();

        if (!root.has("results") ||
                root.get("results").isJsonNull()) {

            return null;
        }

        JsonArray results =
                root.getAsJsonArray("results");

        if (results.isEmpty()) {
            return null;
        }

        JsonObject result =
                results.get(0)
                        .getAsJsonObject();


        String name =
                getString(
                        result,
                        "name",
                        cityName
                );

        String country =
                getString(
                        result,
                        "country",
                        ""
                );

        String countryCode =
                getString(
                        result,
                        "country_code",
                        ""
                );

        double latitude =
                result.has("latitude")
                        ? result
                            .get("latitude")
                            .getAsDouble()
                        : 0.0;

        double longitude =
                result.has("longitude")
                        ? result
                            .get("longitude")
                            .getAsDouble()
                        : 0.0;


        return new City(
                name,
                country,
                countryCode,
                latitude,
                longitude
        );
    }


    private String getString(
            JsonObject object,
            String property,
            String defaultValue
    ) {

        if (!object.has(property) ||
                object.get(property).isJsonNull()) {

            return defaultValue;
        }

        return object
                .get(property)
                .getAsString();
    }
}