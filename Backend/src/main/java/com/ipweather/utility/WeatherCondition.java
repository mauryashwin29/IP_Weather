package com.ipweather.utility;

public class WeatherCondition {

    public static String getDescription(
            int code
    ) {

        return switch (code) {

            case 0 ->
                    "Clear Sky";

            case 1 ->
                    "Mainly Clear";

            case 2 ->
                    "Partly Cloudy";

            case 3 ->
                    "Overcast";

            case 45, 48 ->
                    "Fog";

            case 51, 53, 55 ->
                    "Drizzle";

            case 56, 57 ->
                    "Freezing Drizzle";

            case 61, 63, 65 ->
                    "Rain";

            case 66, 67 ->
                    "Freezing Rain";

            case 71, 73, 75 ->
                    "Snowfall";

            case 77 ->
                    "Snow Grains";

            case 80, 81, 82 ->
                    "Rain Showers";

            case 85, 86 ->
                    "Snow Showers";

            case 95 ->
                    "Thunderstorm";

            case 96, 99 ->
                    "Thunderstorm with Hail";

            default ->
                    "Unknown Weather";
        };
    }
}