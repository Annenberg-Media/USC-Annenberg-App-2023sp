import React, { useContext } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, Card } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import { format } from 'date-fns';
import { AudioContext } from '../../../Context/audioContext';

const LikedAudio = () => {
  const { audioData, updateAudioData } = useContext(AudioContext);

  const handleAudioLike = (radio) => {
    let updatedLikedAudio;
    const index = audioData.findIndex(r => r.canonical_url === radio.canonical_url);

    if (index === -1) {
      updatedLikedAudio = [...audioData, radio];
    } else {
      updatedLikedAudio = [...audioData];
      updatedLikedAudio.splice(index, 1);
    }

    AsyncStorage.setItem('likedAudio', JSON.stringify(updatedLikedAudio)).then(() => {
      updateAudioData(updatedLikedAudio);
    });
  };

  const handlePress = (radio) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove this saved podcast?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleAudioLike(radio) }
      ]
    );
  };

  return (
    <FlatList
      data={audioData}
      renderItem={({ item: radio }) => (
        <Card key={radio._id}>
          <Card.Title>{radio.headlines.basic}</Card.Title>
          <Card.Divider/>
          <View style={styles.user}>
            <WebView
              source={{ uri: radio.spotify_embed }}
              style={styles.webView}
              allowsInlineMediaPlayback={true}
              allowsFullscreenVideo={false}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
            <Text style={styles.description}>{radio.subheadlines.basic}</Text>
            {radio.credits && (
              <Text style={styles.date}>By {radio.credits}</Text>
            )}
            {radio.display_date && (
              <Text style={styles.date}>
                {format(new Date(radio.display_date), "MMMM dd, yyyy 'at' hh:mm a")}
              </Text>
            )}
            <TouchableOpacity onPress={() => handlePress(radio)} style={styles.marker}>
              <Ionicons name={'bookmark'} size={30} color={'#9a0000'}/>
            </TouchableOpacity>
          </View>
        </Card>
      )}
      keyExtractor={radio => radio._id}
      overScrollMode="never"
      ListEmptyComponent={<Text style={styles.noLikedNewsText}>No liked radios yet.</Text>}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingVertical: 20,
    paddingHorizontal: 10,
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
