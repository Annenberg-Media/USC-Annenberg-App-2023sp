import React, {useEffect, useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity,} from 'react-native';
import {Text, Card, Image} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NewsContext} from '../../Context/newsContext';

const News = ({news}) => {

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

  return (
    <>
      <ScrollView>
        <View>
          {
            news.map((n) => {
              const isLiked = newsData.findIndex(news => news.canonical_url === n.canonical_url) !== -1;
              return (
                <TouchableOpacity
                  key={n.canonical_url}
                  onPress={() => navigation.navigate('NewsDetail', {link: BASE_AM_URL + n.canonical_url})}
                >
                  <Card>
                    <Card.Title style={styles.title}>{n.headlines.basic}</Card.Title>
                    <Card.Divider/>
                    <View style={styles.user}>
                      {n.promo_items.basic.additional_properties.resizeUrl !== undefined && <Image
                        source={{uri: BASE_AM_URL + n.promo_items.basic.additional_properties.resizeUrl}}
                        containerStyle={styles.item}
                        PlaceholderContent={<ActivityIndicator/>}
                      />}
                      {n.promo_items.basic.additional_properties.resizeUrl === undefined && <Image
                        source={{uri: 'https://www.uscannenbergmedia.com/pf/resources/uscamlogo.png?d=51'}}
                        containerStyle={styles.undefinedItem}
                        PlaceholderContent={<ActivityIndicator/>}
                      />}
                      <Text style={styles.description}>{n.subheadlines.basic}</Text>
                      <View style={{flexDirection: 'row'}}>
                        {n.date !== undefined &&
                          <Text style={styles.date}>{n.display_date}</Text>
                        }
                      </View>
                      <TouchableOpacity onPress={() => handleLike(n)} style={styles.marker}>
                        <Ionicons name={isLiked ? 'star' : 'star-outline'} size={30}
                                  color={isLiked ? '#990000' : '#990000'}/>
                      </TouchableOpacity>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
        </View>
      </ScrollView>
    </>
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

