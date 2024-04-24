import React, {useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, ActivityIndicator, TouchableOpacity,} from 'react-native';
import {Text, Card, Image} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NewsContext} from '../../Context/newsContext';
import {format} from "date-fns";

const News = ({story}) => {

  const BASE_AM_URL = 'https://uscannenbergmedia.com';

  const {newsData, updateNewsData} = useContext(NewsContext);

  const handleLike = (item) => {
    let updatedLikedNews;
    const index = newsData.findIndex(news => news.canonical_url === item.canonical_url);

    if (index === -1) {
      // If news is not in likedNews, add it
      updatedLikedNews = [...newsData, item];
    } else {
      // If news is already in likedNews, remove it
      updatedLikedNews = [...newsData];
      updatedLikedNews.splice(index, 1);
    }

    // Save updated likedNews to AsyncStorage
    AsyncStorage.setItem('likedNews', JSON.stringify(updatedLikedNews)).then(() => {
      updateNewsData(updatedLikedNews);
    });
  };

  // used for redirecting detail news
  const navigation = useNavigation();

  const isLiked = newsData.findIndex(news => news.canonical_url === story.canonical_url) !== -1;

  return (
    <TouchableOpacity
      key={story.canonical_url}
      onPress={() => navigation.navigate('NewsDetail', {link: BASE_AM_URL + story.canonical_url})}
    >
      <Card>
        <Card.Title style={styles.title}>{story.headlines.basic}</Card.Title>
        <Card.Divider/>
        <View style={styles.user}>
          {story.promo_items.basic.additional_properties !== undefined && <Image
            source={{uri: BASE_AM_URL + story.promo_items.basic.additional_properties.resizeUrl}}
            containerStyle={styles.item}
            PlaceholderContent={<ActivityIndicator/>}
          />}
          {story.promo_items.basic.additional_properties === undefined && <Image
            source={{uri: 'https://www.uscannenbergmedia.com/pf/resources/uscamlogo.png?d=51'}}
            containerStyle={styles.undefinedItem}
            PlaceholderContent={<ActivityIndicator/>}
          />}
          <Text style={styles.description}>{story.subheadlines.basic}</Text>
          {story.credits && (
            <Text style={styles.credits}>By {story.credits}</Text>
          )}
          {story.display_date !== undefined &&
            <Text
              style={styles.date}>{format(new Date(story.display_date), "MMMM dd, yyyy 'at' hh:mm a")}</Text>
          }
          <TouchableOpacity onPress={() => handleLike(story)} style={styles.marker}>
            <Ionicons name={isLiked ? 'bookmark' : 'bookmark-outline'} size={30}
                      color={isLiked ? '#990000' : '#990000'}/>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>

  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
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
  undefinedItem: {
    height: 40,
    resizeMode: 'contain',
  },
  marker: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
});

