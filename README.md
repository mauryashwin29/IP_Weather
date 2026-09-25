# Weather Information Dashboard

A Java-based Weather Information Dashboard that provides real-time weather information for cities using public weather APIs.

The project combines a Java backend with a responsive web frontend and includes both the core assignment requirements and additional bonus features.

---

## Features

### Core Features

- Search weather information by city
- Display current temperature
- Display humidity
- Display current weather condition
- Celsius / Fahrenheit conversion
- Save favourite cities
- Maintain recently searched city history
- Handle invalid city searches and API errors

### Bonus Features

- 5-day weather forecast
- Weather-based icons
- Weather-based background themes
- Compare weather of two cities
- Automatic weather refresh
- Responsive user interface
- Loading and error states
- Local storage for favourites and history

---

## Technologies Used

### Backend

- Java
- Maven
- Java HTTP Client
- Gson
- Open-Meteo Weather API
- Open-Meteo Geocoding API

### Frontend

- HTML5
- CSS3
- JavaScript
- Local Storage
- Fetch API

---

## Project Structure

```text
IP_Weather/
│
├── apache-maven-3.9.16/
│
├── Backend/
│   ├── pom.xml
│   │
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── ipweather/
│                       ├── Main.java
│                       │
│                       ├── controller/
│                       │   └── WeatherController.java
│                       │
│                       ├── model/
│                       │   ├── City.java
│                       │   ├── Forecast.java
│                       │   └── Weather.java
│                       │
│                       ├── service/
│                       │   ├── GeocodingService.java
│                       │   ├── WeatherService.java
│                       │   └── ForecastService.java
│                       │
│                       └── utility/
│                           ├── TemperatureConverter.java
│                           └── WeatherCondition.java
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── README.md
│
└── API_DOCUMENTATION.md
```

---

## System Architecture

```text
                    USER
                      |
                      v
              FRONTEND WEBSITE
             HTML + CSS + JS
                      |
                      | HTTP Request
                      v
             JAVA BACKEND SERVER
                      |
                      v
             WeatherController
                      |
          +-----------+-----------+
          |                       |
          v                       v
   GeocodingService        WeatherService
          |                       |
          v                       |
   City Coordinates               |
                                  v
                           Current Weather
                                  |
                                  v
                         ForecastService
                                  |
                                  v
                           5-Day Forecast
                                  |
                                  v
                            JSON Response
                                  |
                                  v
                         Frontend Dashboard
```

---

## Backend Components

### Main.java

Starts the Java HTTP server and exposes the weather API endpoint.

### WeatherController.java

Handles incoming requests from the frontend.

Responsibilities include:

- Receiving the city name
- Finding city coordinates
- Fetching current weather
- Fetching the 5-day forecast
- Converting temperature values
- Creating the JSON response
- Handling errors
- Providing CORS support

### GeocodingService.java

Converts a city name into geographical coordinates using the Open-Meteo Geocoding API.

It retrieves:

- City name
- Country
- Country code
- Latitude
- Longitude

### WeatherService.java

Retrieves current weather information using latitude and longitude.

It provides:

- Current temperature
- Feels-like temperature
- Humidity
- Weather code

### ForecastService.java

Retrieves the 5-day weather forecast.

It provides:

- Date
- Maximum temperature
- Minimum temperature
- Weather code
- Weather condition

### TemperatureConverter.java

Provides Celsius and Fahrenheit conversion methods.

### WeatherCondition.java

Converts numerical weather codes into readable weather conditions.

---

## Frontend Components

### index.html

Contains the main dashboard structure and user interface.

It includes:

- Search section
- Current weather section
- Temperature display
- Humidity information
- Favourite cities
- Search history
- 5-day forecast
- City comparison
- Auto-refresh controls
- Settings panel

### style.css

Provides the visual design of the application.

It includes:

- Responsive design
- Glassmorphism styling
- Gradient backgrounds
- Weather-based themes
- Animations
- Hover effects
- Mobile support
- Loading states
- Error states
- Forecast cards
- Comparison section
- Settings panel

### script.js

Handles the frontend application logic.

It includes:

- API requests
- Weather data display
- Celsius/Fahrenheit conversion
- Favourite cities
- Search history
- City comparison
- Auto-refresh
- Weather icons
- Dynamic weather themes
- Settings
- Loading states
- Error handling
- Local Storage

---

## API Endpoint

The Java backend runs locally on:

```text
http://localhost:8080
```

The main weather endpoint is:

```text
GET /api/weather
```

Example:

```text
http://localhost:8080/api/weather?city=Mumbai
```

The `city` query parameter contains the city that the user wants to search.

Example requests:

```text
/api/weather?city=Mumbai
/api/weather?city=Delhi
/api/weather?city=London
```

---

## API Response

The backend returns a simplified JSON response containing current weather and forecast information.

Example:

```json
{
  "city": "Mumbai",
  "country": "India",
  "temperatureCelsius": 28.5,
  "temperatureFahrenheit": 83.3,
  "feelsLike": 31.2,
  "feelsLikeFahrenheit": 88.2,
  "humidity": 78,
  "weatherCode": 2,
  "condition": "Partly Cloudy",
  "forecast": [
    {
      "date": "2026-09-25",
      "maxTemperature": 29.1,
      "minTemperature": 25.4,
      "maxTemperatureFahrenheit": 84.4,
      "minTemperatureFahrenheit": 77.7,
      "weatherCode": 2,
      "condition": "Partly Cloudy"
    }
  ]
}
```

The actual weather values change according to live API data.

---

## Temperature Conversion

The Java backend performs Celsius/Fahrenheit conversion.

### Celsius to Fahrenheit

```text
°F = (°C × 9 / 5) + 32
```

Java implementation:

```java
public static double celsiusToFahrenheit(double celsius) {
    return (celsius * 9 / 5) + 32;
}
```

### Fahrenheit to Celsius

```text
°C = (°F - 32) × 5 / 9
```

Java implementation:

```java
public static double fahrenheitToCelsius(double fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}
```

---

## Weather Condition Mapping

The application converts Open-Meteo weather codes into readable descriptions.

| Weather Code | Condition |
|--------------|-----------|
| 0 | Clear Sky |
| 1 | Mainly Clear |
| 2 | Partly Cloudy |
| 3 | Overcast |
| 45, 48 | Fog |
| 51, 53, 55 | Drizzle |
| 56, 57 | Freezing Drizzle |
| 61, 63, 65 | Rain |
| 66, 67 | Freezing Rain |
| 71, 73, 75 | Snowfall |
| 77 | Snow Grains |
| 80, 81, 82 | Rain Showers |
| 85, 86 | Snow Showers |
| 95 | Thunderstorm |
| 96, 99 | Thunderstorm with Hail |

---

## External APIs

### Open-Meteo Geocoding API

Used to convert city names into geographical coordinates.

It provides:

- City name
- Country
- Country code
- Latitude
- Longitude

### Open-Meteo Weather API

Used to retrieve:

- Current weather
- Temperature
- Feels-like temperature
- Humidity
- Weather condition
- 5-day forecast

---

## Request Flow

```text
User searches for a city
          |
          v
Frontend JavaScript
          |
          v
WeatherController
          |
          v
GeocodingService
          |
          v
Latitude + Longitude
          |
          v
WeatherService
          |
          v
Current Weather
          |
          v
ForecastService
          |
          v
5-Day Forecast
          |
          v
Temperature Conversion
          |
          v
JSON Response
          |
          v
Frontend Dashboard
```

---

## Error Handling

The application handles common errors such as:

- Empty city name
- Invalid city
- City not found
- Weather API failure
- Geocoding API failure
- Missing weather data
- Invalid HTTP method
- Network/API errors

Example error:

```json
{
  "error": "City not found."
}
```

The backend uses appropriate HTTP status codes for different errors.

---

## CORS Support

The backend provides CORS headers so that the frontend can communicate with the Java backend during local development.

Supported methods include:

```text
GET
OPTIONS
```

---

## OOP Concepts Used

### Encapsulation

Weather-related data is stored inside model classes using private fields and public getters and setters.

Examples:

```text
City
Weather
Forecast
```

### Abstraction

Different responsibilities are separated into service classes.

Examples:

```text
GeocodingService
WeatherService
ForecastService
```

### Separation of Responsibilities

Each class performs a specific task instead of placing all application logic into one class.

### Classes and Objects

The application uses objects representing:

- Cities
- Current weather
- Forecast information

---

## Data Storage

The frontend uses browser Local Storage for:

- Favourite cities
- Recently searched cities
- User settings

This allows saved information to remain available after refreshing the page.

---

## How to Run the Project

### Requirements

Before running the project, make sure the following are installed:

- Java 17 or later
- Maven
- Visual Studio Code
- Modern web browser
- Live Server extension for VS Code

---

## Step 1 — Open the Project

Open the following folder in VS Code:

```text
IP_Weather
```

---

## Step 2 — Open Backend Terminal

Open the integrated terminal in VS Code.

Navigate to the Backend folder:

```bash
cd /Users/ashwin/Desktop/IP_Weather/Backend
```

---

## Step 3 — Compile the Backend

Run:

```bash
mvn clean compile
```

A successful compilation should finish with:

```text
BUILD SUCCESS
```

---

## Step 4 — Start the Backend

Run:

```bash
mvn exec:java -Dexec.mainClass="com.ipweather.Main"
```

The Java server should start on:

```text
http://localhost:8080
```

Keep this terminal running while using the frontend.

---

## Step 5 — Start the Frontend

Open:

```text
Frontend/index.html
```

Use the VS Code Live Server extension to launch the frontend.

The frontend will communicate with the Java backend.

---

## Step 6 — Search for a City

Enter a city name in the search box.

For example:

```text
Mumbai
```

The application will fetch and display:

- Current temperature
- Feels-like temperature
- Humidity
- Weather condition
- High/low temperature
- 5-day forecast

---

## Step 7 — Test Celsius/Fahrenheit

Use the temperature unit control to switch between:

```text
°C
```

and:

```text
°F
```

The dashboard updates the displayed temperature values.

---

## Step 8 — Test Favourite Cities

Search for a city and use the favourite button.

The city is stored in Local Storage and appears in the Favourite Cities section.

---

## Step 9 — Test Search History

Search multiple cities.

Recently searched cities appear in the Search History section.

The history is stored using Local Storage.

---

## Step 10 — Test City Comparison

Enter two cities in the comparison section.

Select:

```text
Compare
```

The dashboard displays weather information for both cities.

---

## Step 11 — Test Auto Refresh

Open the settings panel.

Enable automatic refresh and select the required refresh interval.

The application periodically requests updated weather information from the backend.

---

## Testing

The following scenarios should be tested:

| Test Case | Expected Result |
|-----------|-----------------|
| Search valid city | Weather information displayed |
| Search another city | New weather information displayed |
| Search invalid city | Error message displayed |
| Empty city search | Validation/error message displayed |
| Change °C / °F | Temperature values converted |
| Add favourite | City saved |
| Remove favourite | City removed |
| Refresh page | Saved favourites remain |
| Search multiple cities | History updated |
| Clear history | Search history removed |
| Compare two cities | Comparison displayed |
| Five-day forecast | Forecast cards displayed |
| Enable auto-refresh | Weather automatically refreshes |
| Weather condition changes | Icon/background changes appropriately |
| Backend unavailable | Frontend displays an error state |

---

## Project Architecture

The project follows a simple layered architecture:

```text
Frontend
   |
   v
Controller
   |
   v
Services
   |
   v
Models / Utilities
   |
   v
External APIs
```

### Frontend Layer

Responsible for:

- User interface
- User interaction
- Weather display
- Local Storage
- API communication

### Controller Layer

Responsible for:

- Receiving HTTP requests
- Validating requests
- Calling services
- Creating JSON responses
- Error handling

### Service Layer

Responsible for:

- City geocoding
- Current weather retrieval
- Forecast retrieval

### Model Layer

Responsible for representing:

- City
- Weather
- Forecast

### Utility Layer

Responsible for:

- Temperature conversion
- Weather condition mapping

---

## Team Roles

### Member 1 — Backend & OOP Architect

Responsibilities:

- Java backend development
- API integration
- Weather data processing
- JSON parsing
- Temperature conversion
- Backend architecture
- OOP implementation

### Member 2 — Frontend Developer

Responsibilities:

- Dashboard UI
- Search interface
- Weather cards
- Favourite cities
- Search history
- Forecast interface
- Responsive design
- Weather themes

### Member 3 — Integration, Git & QA Lead

Responsibilities:

- Frontend/backend integration
- Testing
- Error handling
- Git repository management
- API testing
- Final quality assurance

---

## Bonus Features Implemented

The project includes the following additional features:

- 5-day weather forecast
- Weather-based icons
- Weather-based background themes
- Comparison of two cities
- Automatic weather refresh
- Responsive interface
- Loading states
- Error states
- Local Storage
- Favourite cities
- Search history

---

## Project Status

### Completed

- City search
- Current weather
- Temperature display
- Celsius/Fahrenheit conversion
- Humidity display
- Weather condition display
- Favourite cities
- Search history
- 5-day forecast
- Weather icons
- Weather backgrounds
- City comparison
- Auto-refresh
- Responsive UI
- Loading states
- Error handling
- Java backend
- Frontend/backend integration
- API documentation

---

## Future Improvements

Possible future enhancements include:

- User authentication
- Weather alerts
- Location-based weather
- Interactive weather maps
- Advanced weather charts
- Database storage
- Cloud deployment
- Progressive Web App support
- More detailed weather analytics

---

## Conclusion

The Weather Information Dashboard provides a simple and interactive way to view current and forecast weather information for different cities.

The project demonstrates:

- Java programming
- Object-Oriented Programming
- Maven project management
- HTTP client communication
- REST-style API integration
- JSON processing
- Frontend development
- JavaScript Fetch API
- Local Storage
- Responsive UI design
- Error handling
- Frontend/backend integration

The application combines a Java backend with a responsive frontend to provide a complete weather information system.

---

## Documentation

Additional API documentation is available in:

```text
API_DOCUMENTATION.md
```

The API documentation contains details about:

- Backend API
- Request format
- Response format
- API fields
- Weather services
- Forecast services
- Temperature conversion
- Error handling
- CORS
- Architecture
- Testing
- API integration

---

## Final Project Structure

```text
IP_Weather/
│
├── apache-maven-3.9.16/
│
├── Backend/
│   ├── pom.xml
│   │
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── ipweather/
│                       ├── Main.java
│                       │
│                       ├── controller/
│                       │   └── WeatherController.java
│                       │
│                       ├── model/
│                       │   ├── City.java
│                       │   ├── Forecast.java
│                       │   └── Weather.java
│                       │
│                       ├── service/
│                       │   ├── GeocodingService.java
│                       │   ├── WeatherService.java
│                       │   └── ForecastService.java
│                       │
│                       └── utility/
│                           ├── TemperatureConverter.java
│                           └── WeatherCondition.java
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── README.md
│
└── API_DOCUMENTATION.md
```

---

## Author / Project Information

### Project

Weather Information Dashboard

### Backend

Java + Maven

### Frontend

HTML + CSS + JavaScript

### Weather Service

Open-Meteo API

### Project Type

Java Web-Based Weather Information System

### Purpose

Developed as an academic project demonstrating Java backend development, Object-Oriented Programming, API integration, frontend development, and software engineering practices.