package com.ipweather.model;

public class Weather {

    private String city;
    private String country;

    private double temperature;
    private double feelsLike;

    private int humidity;
    private int weatherCode;


    public Weather() {
    }


    public Weather(
            String city,
            String country,
            double temperature,
            double feelsLike,
            int humidity,
            int weatherCode
    ) {

        this.city = city;
        this.country = country;
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.humidity = humidity;
        this.weatherCode = weatherCode;
    }


    public String getCity() {
        return city;
    }


    public void setCity(String city) {
        this.city = city;
    }


    public String getCountry() {
        return country;
    }


    public void setCountry(String country) {
        this.country = country;
    }


    public double getTemperature() {
        return temperature;
    }


    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }


    public double getFeelsLike() {
        return feelsLike;
    }


    public void setFeelsLike(double feelsLike) {
        this.feelsLike = feelsLike;
    }


    public int getHumidity() {
        return humidity;
    }


    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }


    public int getWeatherCode() {
        return weatherCode;
    }


    public void setWeatherCode(int weatherCode) {
        this.weatherCode = weatherCode;
    }


    @Override
    public String toString() {

        return "Weather{" +
                "city='" + city + '\'' +
                ", country='" + country + '\'' +
                ", temperature=" + temperature +
                ", feelsLike=" + feelsLike +
                ", humidity=" + humidity +
                ", weatherCode=" + weatherCode +
                '}';
    }
}