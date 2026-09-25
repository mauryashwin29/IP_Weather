package com.ipweather;

import com.ipweather.controller.WeatherController;
import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;

public class Main {

    public static void main(String[] args) {

        try {

            // Render provides the PORT environment variable.
            // Locally, use port 8080.
            int port = 8080;

            String portEnvironment =
                    System.getenv("PORT");

            if (portEnvironment != null &&
                !portEnvironment.isEmpty()) {

                port = Integer.parseInt(portEnvironment);
            }

            // Create HTTP server
            HttpServer server =
                    HttpServer.create(
                            new InetSocketAddress(
                                    "0.0.0.0",
                                    port
                            ),
                            0
                    );

            // Weather API endpoint
            server.createContext(
                    "/api/weather",
                    new WeatherController()
            );

            // Start server
            server.start();

            System.out.println(
                    "================================="
            );

            System.out.println(
                    "       IP WEATHER BACKEND"
            );

            System.out.println(
                    "================================="
            );

            System.out.println(
                    "Server started successfully!"
            );

            System.out.println(
                    "Port: " + port
            );

            System.out.println(
                    "API: http://localhost:"
                    + port
                    + "/api/weather"
            );

            System.out.println(
                    "================================="
            );

        } catch (Exception e) {

            System.out.println(
                    "Server error: "
                    + e.getMessage()
            );

            e.printStackTrace();
        }
    }
}