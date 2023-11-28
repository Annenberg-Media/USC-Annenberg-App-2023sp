import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LikedNews from './LikedNews';
import LikedAudio from './LikedAudio';
import LikedVideo from './LikedVideo';

const Favorites = () => {

  const Tab = createMaterialTopTabNavigator();

  return (
    <View style={styles.container}>
      <Text style={styles.likedThingText}>Favorites</Text>
      <Tab.Navigator
        screenOptions={{
          "tabBarActiveTintColor": "#9a0000",
          "tabBarInactiveTintColor": "#b3b3b3",
          "tabBarIndicatorStyle": {
            "backgroundColor": "#9a0000"
          }
        }}>
        <Tab.Screen name="News" component={LikedNews} />
        <Tab.Screen name="Radios" component={LikedAudio} />
        <Tab.Screen name="Videos" component={LikedVideo} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  likedThingText: {
    fontFamily: 'Arial',
    color: '#9a0000',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'center',
    textTransform: 'uppercase',
    padding: 24,
  },
});

export default Favorites;
