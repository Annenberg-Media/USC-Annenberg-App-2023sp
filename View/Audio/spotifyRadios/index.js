import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, TouchableOpacity,} from 'react-native';
import {Text, Card} from '@rneui/themed';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AudioContext} from '../../Context/audioContext';
import {format} from "date-fns";

const SpotifyRadio = ({radio}) => {

  const BASE_AM_URL = 'https://uscannenbergmedia.com';

  const {audioData, updateAudioData} = useContext(AudioContext);

  const handleLike = (item) => {
    let updatedLikedAudio;
    const index = audioData.findIndex(radio => radio.canonical_url === item.canonical_url);

    if (index === -1) {
      // If audio is not in likedAudio, add it
      updatedLikedAudio = [...audioData, item];
    } else {
      // If audio is already in likedAudio, remove it
      updatedLikedAudio = [...audioData];
      updatedLikedAudio.splice(index, 1);
    }

    // Save updated likedAudio to AsyncStorage
    AsyncStorage.setItem('likedAudio', JSON.stringify(updatedLikedAudio)).then(() => {
      updateAudioData(updatedLikedAudio);
    });
  };

  // used for redirecting detail news
  const navigation = useNavigation();

  const isLiked = audioData.findIndex(item => item.canonical_url === radio.canonical_url) !== -1;

  return (
    <TouchableOpacity
      key={radio.canonical_url}
      onPress={() => navigation.navigate('NewsDetail', {link: BASE_AM_URL + radio.canonical_url})}
    >
      <Card key={radio.canonical_url}>
        <Card.Title style={styles.title}>{radio.headlines.basic}</Card.Title>
        <Card.Divider/>
        <View style={styles.user}>
          <WebView
            source={{uri: radio.spotify_embed}}
            onShouldStartLoadWithRequest={(request) => {
              // Only allow navigating within this website
              return request.url.startsWith(radio.spotify_embed);
            }}
            style={styles.webView}
            allowsInlineMediaPlayback={true}
            allowsFullscreenVideo={false}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          <Text style={styles.description}>{radio.subheadlines.basic}</Text>
          {radio.credits && (
            <Text style={styles.credits}>By {radio.credits}</Text>
          )}
          {radio.display_date !== undefined &&
            <Text
              style={styles.date}>{format(new Date(radio.display_date), "MMMM dd, yyyy 'at' hh:mm a")}</Text>
          }
          <TouchableOpacity onPress={() => handleLike(radio)} style={styles.marker}>
            <Ionicons name={isLiked ? 'bookmark' : 'bookmark-outline'} size={30}
                      color={isLiked ? '#990000' : '#990000'}/>
          </TouchableOpacity>
        </View>
      </Card>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'column',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  credits: {
    fontSize: 14,
    marginTop: 5,
    color: "grey",
  },
  description: {
    fontSize: 16,
    marginTop: 5,
  },
  date: {
    fontSize: 11,
    marginTop: 5,
    color: "grey",
  },
  item: {
    aspectRatio: 1,
    width: '100%',
    flex: 1,
  },
  webView: {
    width: '100%',
    height: 360,
    top: 0,
    left: 0,
    zIndex: 1,
  },
  marker: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default SpotifyRadio;
