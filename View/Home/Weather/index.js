import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Image } from '@rneui/themed';
import * as Location from 'expo-location';

const Weather = () => {
  // const [locationPermission, setLocationPermission] = useState(null);

  const WEATHER_API_KEY = "9d754d6e12cc9d9de92ca7a0d6493882";
  const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";
  const IP_URL = "https://ipapi.co/json/";

  const [location, setLocation] = useState(null);

  const [iconUrl, setIconUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [currentWeatherDetails, setCurrentWeatherDetails] = useState(null);


  useEffect(() => {
    setCurrentWeather(null);

    (async () => {
      try {
        // let { status } = await Location.requestForegroundPermissionsAsync();
        // if (status != "granted") {
        //   setErrorMessage("Access is needed to get the weather info");
        //   return;
        // }
        // setLocationPermission(status);
        // const location = await Location.getCurrentPositionAsync({});
        // setLocation(location);
        // const { latitude, longitude } = location.coords;
        // const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=imperial&appid=${WEATHER_API_KEY}`;
        // const response = await fetch(weatherUrl)
        // const result = await response.json()

        const responseIP = await fetch(IP_URL)
        const resultIP = await responseIP.json()
        const ipLatitude = resultIP.latitude
        const ipLongitude = resultIP.longitude

        const weatherUrl = `${BASE_WEATHER_URL}lat=${ipLatitude}&lon=${ipLongitude}&units=imperial&appid=${WEATHER_API_KEY}`;
        const response = await fetch(weatherUrl)
        const result = await response.json()

        if (response.ok) {
          result.main.temp = Math.round(result.main.temp);
          setCurrentWeather(Math.round(result.main.temp));
          setCurrentWeatherDetails(result);
          const icon = 'https://openweathermap.org/img/wn/' + result.weather[0].icon + '@4x.png';
          setIconUrl(icon);
        }
        else {
          setErrorMessage(result.message)
        }

      } catch (error) {
        setErrorMessage(error.message)
      }
    })();

  }, []);



  return (
    <View>
      {currentWeatherDetails && (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.temperature}>{currentWeatherDetails.main.temp}°F</Text>
            <Text style={styles.location}>{currentWeatherDetails.name}</Text>
            <View style={styles.vertical}>
              <Image style={styles.icon} source={{ uri: iconUrl }} />
              <Text style={styles.description}>{currentWeatherDetails.weather[0].description}</Text>
            </View>
          </View>
        </View>
      )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
    marginLeft: 10,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 8,
    color: '#9a0000',
  },
  description: {
    fontSize: 12,
    color: 'grey',
  },
  location: {
    fontSize: 16,
    marginLeft: 10,
    width: 160, // set the width of the block
    flexWrap: 'wrap' // allow the text to wrap to the next line
  },
  vertical: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Weather;