import React from 'react';
import { View, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const Medias = () => {
  const handleFacebook = () => {
    Linking.openURL('https://bit.ly/AM_on_FB');
  };

  const handleTwitter = () => {
    Linking.openURL('https://twitter.com/AnnenbergMedia');
  };

  const handleSports = () => {
    Linking.openURL('https://twitter.com/AnnMediaSports');
  };

  const handleInstagram = () => {
    Linking.openURL('https://www.instagram.com/annenbergmedia/');
  };

  const handleTiktoks = () => {
    Linking.openURL('https://www.tiktok.com/@annenbergmedia?lang=en');
  };

  const handleYoutube = () => {
    Linking.openURL('https://www.youtube.com/@AnnenbergMedia');
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleFacebook}>
        <Icon name="facebook-square" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleTwitter}>
        <Icon name="twitter" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSports}>
        <MaterialIcons name="sports-football" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleInstagram}>
        <Icon name="instagram" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleTiktoks}>
        <FontAwesome5 name="tiktok" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleYoutube}>
        <Icon name="youtube-play" size={30} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    padding: 16,
  },
  card: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    padding: 12,
    margin: 2,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  icon: {
    color: '#8d8d8d',
    marginHorizontal: 10,
  }
});

export default Medias;