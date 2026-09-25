package com.ipweather.model;

public class Forecast {

    private String date;
    private double maxTemperature;
    private double minTemperature;
    private int weatherCode;


    public Forecast() {
    }


    public Forecast(
            String date,
            double maxTemperature,
            double minTemperature,
            int weatherCode
    ) {

        this.date = date;
        this.maxTemperature = maxTemperature;
        this.minTemperature = minTemperature;
        this.weatherCode = weatherCode;
    }


    public String getDate() {
        return date;
    }


    public void setDate(String date) {
        this.date = date;
    }


    public double getMaxTemperature() {
        return maxTemperature;
    }


    public void setMaxTemperature(
            double maxTemperature
    ) {

        this.maxTemperature = maxTemperature;
    }


    public double getMinTemperature() {
        return minTemperature;
    }


    public void setMinTemperature(
            double minTemperature
    ) {

        this.minTemperature = minTemperature;
    }


    public int getWeatherCode() {
        return weatherCode;
    }


    public void setWeatherCode(
            int weatherCode
    ) {

        this.weatherCode = weatherCode;
    }


    @Override
    public String toString() {

        return "Forecast{" +
                "date='" + date + '\'' +
                ", maxTemperature=" +
                maxTemperature +
                ", minTemperature=" +
                minTemperature +
                ", weatherCode=" +
                weatherCode +
                '}';
    }
}