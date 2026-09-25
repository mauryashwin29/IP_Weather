# Weather Information Dashboard — API Documentation

## 1. Overview

The Weather Information Dashboard uses a Java backend to provide weather information to the frontend.

The backend communicates with the Open-Meteo Geocoding API and Open-Meteo Weather API, processes the received data, and returns a simplified JSON response to the frontend.

---

## 2. Backend Server

The Java backend runs locally on:

```text
http://localhost:8080
```

The main weather endpoint is:

```text
GET /api/weather
```

---

## 3. Weather API Endpoint

### Request

```text
GET http://localhost:8080/api/weather?city=Mumbai
```

### Query Parameter

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | String | Yes | Name of the city to search |

### Example Requests

```text
/api/weather?city=Mumbai
/api/weather?city=Delhi
/api/weather?city=London
```

---

## 4. Request Flow

The request follows this sequence:

```text
Frontend
   |
   | GET /api/weather?city=Mumbai
   v
WeatherController
   |
   v
GeocodingService
   |
   | City name → Latitude + Longitude
   v
WeatherService
   |
   | Current weather data
   v
ForecastService
   |
   | 5-day forecast
   v
WeatherController
   |
   | JSON response
   v
Frontend Dashboard
```

---

## 5. Geocoding Process

The GeocodingService converts the city name into geographical coordinates.

It uses the:

```text
Open-Meteo Geocoding API
```

The service retrieves:

- City name
- Country
- Country code
- Latitude
- Longitude

These coordinates are then used by the weather services.

---

## 6. Current Weather Data

The WeatherService retrieves the current weather using the city's latitude and longitude.

The backend obtains:

- Temperature
- Feels-like temperature
- Relative humidity
- Weather code

---

## 7. Five-Day Forecast

The ForecastService retrieves a five-day daily forecast.

Each forecast entry contains:

- Date
- Maximum temperature
- Minimum temperature
- Weather code
- Weather condition

---

## 8. JSON Response

A successful request returns a JSON response similar to:

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

> The actual weather values change according to live API data.

---

## 9. Response Fields

### City Information

| Field | Type | Description |
|-------|------|-------------|
| city | String | City name |
| country | String | Country name |

### Current Weather

| Field | Type | Description |
|-------|------|-------------|
| temperatureCelsius | Number | Current temperature in Celsius |
| temperatureFahrenheit | Number | Current temperature in Fahrenheit |
| feelsLike | Number | Apparent temperature in Celsius |
| feelsLikeFahrenheit | Number | Apparent temperature in Fahrenheit |
| humidity | Integer | Relative humidity percentage |
| weatherCode | Integer | Open-Meteo weather code |
| condition | String | Human-readable weather condition |

### Forecast

| Field | Type | Description |
|-------|------|-------------|
| date | String | Forecast date |
| maxTemperature | Number | Maximum temperature in Celsius |
| minTemperature | Number | Minimum temperature in Celsius |
| maxTemperatureFahrenheit | Number | Maximum temperature in Fahrenheit |
| minTemperatureFahrenheit | Number | Minimum temperature in Fahrenheit |
| weatherCode | Integer | Weather condition code |
| condition | String | Human-readable weather condition |

---

## 10. Temperature Conversion

Temperature conversion is handled by the Java backend.

The TemperatureConverter utility provides Celsius and Fahrenheit conversion methods.

### Celsius to Fahrenheit

Formula:

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

Formula:

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

## 11. Weather Condition Mapping

The backend converts Open-Meteo numerical weather codes into readable descriptions.

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

## 12. Error Responses

### Missing City

Request:

```text
GET /api/weather
```

Response:

```json
{
  "error": "Please provide a city name."
}
```

HTTP Status:

```text
400 Bad Request
```

---

### City Not Found

If the requested city cannot be found:

```json
{
  "error": "City not found."
}
```

HTTP Status:

```text
404 Not Found
```

---

### Unsupported HTTP Method

The weather endpoint accepts GET requests.

Other HTTP methods return:

```json
{
  "error": "Only GET requests are allowed."
}
```

HTTP Status:

```text
405 Method Not Allowed
```

---

### Server or API Failure

If an unexpected backend or API error occurs:

```json
{
  "error": "Unable to fetch weather data."
}
```

HTTP Status:

```text
500 Internal Server Error
```

---

## 13. CORS Support

The Java backend provides CORS headers so that the frontend can communicate with the local backend server.

Supported methods include:

```text
GET
OPTIONS
```

The backend allows requests from the frontend during local development.

---

## 14. Backend Classes

### Main.java

Starts the Java HTTP server.

### WeatherController.java

Handles frontend requests and creates the final JSON response.

Responsibilities include:

- Receiving the city name
- Calling the required services
- Processing weather information
- Performing temperature conversion
- Creating the JSON response
- Handling errors
- Providing CORS support

### GeocodingService.java

Finds geographical coordinates for a city using the Open-Meteo Geocoding API.

### WeatherService.java

Retrieves current weather information.

### ForecastService.java

Retrieves the five-day weather forecast.

### TemperatureConverter.java

Performs Celsius and Fahrenheit conversion.

### WeatherCondition.java

Converts numerical weather codes into readable weather conditions.

### Model Classes

The backend uses the following model classes:

```text
City
Weather
Forecast
```

These classes represent weather-related data.

---

## 15. Frontend Integration

The frontend communicates with the Java backend using JavaScript's Fetch API.

The backend endpoint is:

```text
http://localhost:8080/api/weather
```

Example:

```javascript
fetch(
    "http://localhost:8080/api/weather?city=Mumbai"
);
```

The returned JSON data is then processed and displayed in the dashboard.

---

## 16. External APIs

### Open-Meteo Geocoding API

Used to convert city names into geographical coordinates.

The service provides:

- City name
- Country
- Latitude
- Longitude

### Open-Meteo Weather API

Used to retrieve:

- Current weather
- Temperature
- Humidity
- Feels-like temperature
- Weather condition
- Five-day forecast

---

## 17. Complete Data Flow

```text
User searches for a city
          |
          v
Frontend JavaScript
          |
          v
Java WeatherController
          |
          v
GeocodingService
          |
          v
City coordinates
          |
          v
WeatherService
          |
          v
Current weather
          |
          v
ForecastService
          |
          v
5-day forecast
          |
          v
Temperature conversion
          |
          v
JSON response
          |
          v
Frontend Dashboard
          |
          v
Weather displayed to user
```

---

## 18. Local Development

### Start Backend

Open the terminal and run:

```bash
cd /Users/ashwin/Desktop/IP_Weather/Backend
```

Compile the project:

```bash
mvn clean compile
```

Start the backend:

```bash
mvn exec:java -Dexec.mainClass="com.ipweather.Main"
```

The backend runs on:

```text
http://localhost:8080
```

Keep the backend terminal running while using the frontend.

### Start Frontend

Open:

```text
Frontend/index.html
```

using the VS Code Live Server extension.

The frontend communicates with the Java backend running on port 8080.

---

## 19. Testing

The following scenarios were tested:

| Test Case | Expected Result |
|-----------|-----------------|
| Search valid city | Weather information displayed |
| Search another city | New weather information displayed |
| Search invalid city | Error message displayed |
| Change °C / °F | Temperature values converted |
| Add favourite | City saved |
| Refresh page | Favourites remain |
| Search multiple cities | History updated |
| Compare two cities | Comparison displayed |
| Five-day forecast | Forecast cards displayed |
| Enable auto-refresh | Weather automatically refreshes |
| Weather condition changes | Icon/background changes appropriately |

---

## 20. Backend Error Handling

The backend is designed to handle common failure situations.

These include:

- Empty city name
- Invalid city
- City not found
- Weather API failure
- Geocoding API failure
- Missing weather data
- Invalid HTTP method
- Network/API errors

The backend returns appropriate HTTP status codes and JSON error messages.

---

## 21. Frontend Features Connected to the API

The frontend uses the API response to provide:

- Current weather display
- Temperature conversion
- Weather condition display
- Humidity information
- Five-day forecast
- Weather icons
- Weather-based backgrounds
- Favourite cities
- Search history
- City comparison
- Automatic refresh
- Loading states
- Error messages

Favourite cities and search history are stored using browser Local Storage.

---

## 22. OOP Concepts Demonstrated

The backend demonstrates important Java Object-Oriented Programming concepts.

### Encapsulation

Weather-related data is stored inside model classes with private fields and public getters/setters.

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

Each class performs a specific task instead of placing the complete application logic into one class.

### Objects and Classes

The application creates objects representing:

- Cities
- Current weather
- Forecast information

---

## 23. API Testing Example

To directly test the backend, open a browser while the backend is running.

Enter:

```text
http://localhost:8080/api/weather?city=Mumbai
```

A successful response should return JSON containing:

```text
City
Country
Temperature
Feels-like temperature
Humidity
Weather condition
Five-day forecast
```

The exact weather values may change because the application uses live weather data.

---

## 24. Project Architecture

The project follows a simple layered architecture:

```text
Frontend Layer
      |
      v
Controller Layer
      |
      v
Service Layer
      |
      v
Model / Utility Layer
      |
      v
External Weather APIs
```

### Frontend Layer

Responsible for:

- User interface
- User interaction
- Displaying weather information
- Local storage
- Calling the backend API

### Controller Layer

Responsible for:

- Receiving HTTP requests
- Validating requests
- Calling backend services
- Creating JSON responses

### Service Layer

Responsible for:

- Geocoding
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

## 25. Advantages of the Backend Architecture

The architecture provides:

- Clear separation of responsibilities
- Reusable service classes
- Easier debugging
- Easier testing
- Cleaner code organization
- Better maintainability
- Simple frontend/backend communication

---

## 26. Final Project Structure

The final project should look like:

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

## 27. Step 16 Completion Checklist

Before considering the API documentation complete, verify:

- [ ] API_DOCUMENTATION.md exists in the project root
- [ ] It is a file, not a folder
- [ ] Backend server information is documented
- [ ] API endpoint is documented
- [ ] Request format is documented
- [ ] Response structure is documented
- [ ] Current weather fields are documented
- [ ] Forecast fields are documented
- [ ] Temperature conversion is documented
- [ ] Weather condition mapping is documented
- [ ] Error responses are documented
- [ ] CORS support is documented
- [ ] Backend classes are documented
- [ ] Frontend integration is documented
- [ ] External APIs are documented
- [ ] Complete data flow is documented
- [ ] Local development instructions are documented
- [ ] Testing information is documented
- [ ] OOP concepts are documented
- [ ] Final project structure is documented
- [ ] File is saved successfully

---

## 28. Final Save

After pasting all the content into API_DOCUMENTATION.md:

1. Press:

```text
⌘ + S
```

2. Confirm the file remains:

```text
API_DOCUMENTATION.md
```

3. Confirm it appears alongside README.md.

The final root directory should contain:

```text
IP_Weather/
├── Backend/
├── Frontend/
├── README.md
└── API_DOCUMENTATION.md
```

---

## 29. Conclusion

The API Documentation provides a complete technical explanation of the Weather Information Dashboard backend and its communication with the frontend.

It documents:

- API endpoint
- Request and response structure
- Weather services
- Forecast services
- Geocoding
- Temperature conversion
- Weather condition mapping
- Error handling
- CORS
- OOP concepts
- Frontend integration
- External APIs
- Testing
- Project architecture
- Local development
- Final project structure

This documentation can also be used during project submission, demonstration, and viva.