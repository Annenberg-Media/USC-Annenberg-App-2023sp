import React, {useContext} from 'react';
import {Alert, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Text, Card,} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import {AudioContext} from '../../../Context/audioContext';

const LikedAudio = () => {
  const {audioData, updateAudioData} = useContext(AudioContext);

  const handleAudioLike = (item) => {
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

  const handlePress = (item) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove this saved podcast?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {text: "OK", onPress: () => handleAudioLike(item)}
      ]
    );
  };

  return (
    <ScrollView overScrollMode={"never"}>
      <View style={styles.container}>
        {audioData.length > 0 ? (
          <View>
            {audioData.map(r => {
              return (
                <Card key={r.link}>
                  <Card.Title>{r.title}</Card.Title>
                  <Card.Divider/>
                  <View style={styles.user}>
                    <WebView
                      source={{uri: r.radio}}
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
                    <TouchableOpacity onPress={() => handlePress(r)} style={styles.marker}>
                      <Ionicons name={'bookmark'} size={30} color={'#9a0000'}/>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noLikedNewsText}>No liked radios yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  likedThingText: {
    fontFamily: 'Chalkboard SE',
    color: '#9a0000',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  noLikedNewsText: {
    alignSelf: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  marker: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
  webView: {
    width: '100%',
    height: 360,
    top: 0,
    left: 0,
    zIndex: 1,
  },
});

export default LikedAudio;
