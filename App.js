import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import * as Location from "expo-location";
import { Alert } from "react-native";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "1d9b1f306da5bf7299871338be75b327";

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [nowWeather, setNowWeather] = useState(null);
  const getWeather = async () => {
    try {
      const { status } = await Location.requestPermissionsAsync();
      if (status) {
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();
        const { data: nowData } = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        setWeather(data);
        setNowWeather(nowData);
        if (nowData && data) {
          setIsLoading(false);
        }
      } else {
        Alert.alert("We need location permission");
      }
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };

  useEffect(() => {
    getWeather();
    setInterval(getWeather, 30000);
  }, []);

  return isLoading ? <Loader /> : <Weather {...nowWeather} {...weather} />;
};
