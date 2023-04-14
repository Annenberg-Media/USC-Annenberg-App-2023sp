import React from 'react';
import { View, StyleSheet, } from 'react-native';
import { Text, } from '@rneui/themed';
import Medias from './Medias';
import Favorites from './Favorites';

const Me = () => {
return (
  <>
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>Find Us Here:</Text>
        <Medias/>
        <Favorites/>
      </View>
    </View>
  </>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    // fontFamily: 'Arial',
    // fontSize: 16,
    // fontWeight: '400',
    // color: '#333',
    // lineHeight: 24,
    // letterSpacing: 0.5,
    // marginLeft: 10,
    fontFamily: 'Arial',
    color: 'grey',
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'italic',
    // textAlign: 'center',
    textTransform: 'uppercase',
    padding: 8,
  },
});

export default Me;