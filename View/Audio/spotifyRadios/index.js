import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity,} from 'react-native';
import {Text, Card} from '@rneui/themed';
import WebView from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AudioContext} from '../../Context/audioContext';

const SpotifyRadio = ({radios}) => {

  const {audioData, updateAudioData} = useContext(AudioContext);

  const handleLike = (item) => {
    let updatedLikedAudio;
    const index = audioData.findIndex(radios => radios.link === item.link);

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

  return (
    <>
      <ScrollView overScrollMode={"never"}>
        <View style={styles.container}>
          {radios.map((r, i) => {
            const isLiked = audioData.findIndex(audios => audios.link === r.link) !== -1;

            return (
              <Card key={r.link}>
                <Card.Title style={styles.title}>{r.title}</Card.Title>
                <Card.Divider/>
                <View style={styles.user}>
                  <WebView
                    source={{uri: r.radio}}
                    onShouldStartLoadWithRequest={(request) => {
                      // Only allow navigating within this website
                      return request.url.startsWith(r.radio);
                    }}
                    style={styles.webView}
                    allowsInlineMediaPlayback={true}
                    allowsFullscreenVideo={false}
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                  />
                  <Text style={styles.description}>{r.description}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'column'}}>
                      <Text style={styles.date}>By{r.author}</Text>
                      <Text style={styles.date}>- {r.date}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleLike(r)} style={styles.marker}>
                    <Ionicons name={isLiked ? 'bookmark' : 'bookmark-outline'} size={30}
                              color={isLiked ? '#990000' : '#990000'}/>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </>
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
