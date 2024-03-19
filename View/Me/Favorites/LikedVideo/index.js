import React, {useContext} from 'react';
import {Alert, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Text, Card,} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import {VideoContext} from '../../../Context/videoContext';

const LikedVideo = () => {
  const {videoData, updateVideoData} = useContext(VideoContext);

  const handleVideoLike = (item) => {
    let updatedLikedVideo;
    const index = videoData.findIndex(videos => videos.videoId === item.videoId);

    if (index === -1) {
      // If video is not in likedVideo, add it
      updatedLikedVideo = [...videoData, item];
    } else {
      // If video is already in likedVideo, remove it
      updatedLikedVideo = [...videoData];
      updatedLikedVideo.splice(index, 1);
    }

    // Save updated likedVideo to AsyncStorage
    AsyncStorage.setItem('likedVideo', JSON.stringify(updatedLikedVideo)).then(() => {
      updateVideoData(updatedLikedVideo);
    });
  };

  const handlePress = (item) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove this saved video?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {text: "OK", onPress: () => handleVideoLike(item)}
      ]
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {videoData.length > 0 ? (
          <View>
            {videoData.map(v => {
              return (
                <Card key={v.videoId}>
                  <Card.Title style={styles.title}>{v.title}</Card.Title>
                  <Card.Divider/>
                  <View style={styles.title}>
                    <WebView
                      source={{uri: v.videoId}}
                      allowsInlineMediaPlayback={true}
                      allowsFullscreenVideo={false}
                      mediaPlaybackRequiresUserAction={false}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                      style={styles.webView}
                    />
                    <ScrollView style={styles.desView}>
                      <View style={styles.cardContent}>
                        <Text style={styles.videoDescription}>{v.description}</Text>
                        <Text style={styles.date}>{v.date}</Text>
                      </View>
                    </ScrollView>
                    <TouchableOpacity onPress={() => handlePress(v)} style={styles.marker}>
                      <Ionicons name={'bookmark'} size={30} color={'#9a0000'}/>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noLikedNewsText}>No liked videos yet.</Text>
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noLikedNewsText: {
    alignSelf: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  marker: {
    position: 'absolute',
    bottom: -8, // adjust the value to change the distance from the bottom
    right: 5, // adjust the value to change the distance from the right
    padding: 3, // adjust the padding as needed
    borderRadius: 5, // adjust the border radius as needed
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
  desView: {
    height: 200,
  },
  videoDescription: {
    fontSize: 14,
  },
});

export default LikedVideo;
