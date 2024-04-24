import React, { useContext } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Text, Card, Image } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NewsContext } from '../../../Context/newsContext';
import { useNavigation } from '@react-navigation/native';
import { format } from "date-fns";

const LikedNews = () => {
  const BASE_AM_URL = 'https://uscannenbergmedia.com';
  const { newsData, updateNewsData } = useContext(NewsContext);
  const navigation = useNavigation();

  const handleNewsLike = (story) => {
    const index = newsData.findIndex(n => n.canonical_url === story.canonical_url);
    let updatedLikedNews = [...newsData];

    if (index === -1) {
      updatedLikedNews.push(story);
    } else {
      updatedLikedNews.splice(index, 1);
    }

    AsyncStorage.setItem('likedNews', JSON.stringify(updatedLikedNews)).then(() => {
      updateNewsData(updatedLikedNews);
    });
  };

  const handlePress = (story) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove this saved article?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleNewsLike(story) }
      ]
    );
  };

  return (
    <FlatList
      data={newsData}
      renderItem={({ item: story }) => (
        <TouchableOpacity
          key={story._id}
          onPress={() => navigation.navigate('NewsDetail', { link: BASE_AM_URL + story.canonical_url })}
        >
          <Card>
            <Card.Title>{story.headlines.basic}</Card.Title>
            <Card.Divider/>
            <View style={styles.user}>
              {story.promo_items.basic.additional_properties !== undefined && (
                <Image
                  source={{ uri: BASE_AM_URL + story.promo_items.basic.additional_properties.resizeUrl }}
                  containerStyle={styles.item}
                  PlaceholderContent={<ActivityIndicator/>}
                />
              )}
              {story.promo_items.basic.additional_properties === undefined && (
                <Image
                  source={{ uri: 'https://www.uscannenbergmedia.com/pf/resources/uscamlogo.png?d=51' }}
                  containerStyle={styles.undefinedItem}
                  PlaceholderContent={<ActivityIndicator/>}
                />
              )}
              <Text style={styles.description}>{story.subheadlines.basic}</Text>
              <View style={{ flexDirection: 'row' }}>
                {story.display_date !== undefined &&
                  <Text style={styles.date}>
                    {format(new Date(story.display_date), "MMMM dd, yyyy 'at' hh:mm a")}
                  </Text>
                }
              </View>
              <TouchableOpacity onPress={() => handlePress(story)} style={styles.marker}>
                <Ionicons name={'bookmark'} size={30} color={'#990000'}/>
              </TouchableOpacity>
            </View>
          </Card>
        </TouchableOpacity>
      )}
      keyExtractor={story => story._id}
      ListEmptyComponent={<Text style={styles.noLikedNewsText}>No liked news yet.</Text>}
      contentContainerStyle={newsData.length === 0 ? { flexGrow: 1 } : null}
      overScrollMode="never"
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
    marginTop: 5,
  },
  item: {
    aspectRatio: 1,
    width: '100%',
    flex: 1,
  },
  undefinedItem: {
    height: 40,
    resizeMode: 'contain',
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
});

export default LikedNews;
