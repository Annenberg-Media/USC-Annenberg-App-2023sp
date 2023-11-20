import React, { useEffect, useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, } from 'react-native';
import { Text, Card, Image } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NewsContext } from '../../Context/newsContext';

const News = ({ news }) => {

  const { newsData, updateNewsData } = useContext(NewsContext);

  const handleLike = (item) => {
    let updatedLikedNews;
    const index = newsData.findIndex(news => news.link === item.link);

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
          {news.map((n, i) => {
            const isLiked = newsData.findIndex(news => news.link === n.link) !== -1;

            // Function to extract https URL from a string
            const extractHttpsUrl = (text) => {
              const urlRegex = /https:\/\/[^\s"]+/g; // Regex to find https URL
              const match = text && text.match(urlRegex);
              return match ? match[0] : null;
            };

            // Extract the https URL if present
            const imgSrc = extractHttpsUrl(n.img);

            return (
              <TouchableOpacity
                key={n.link}
                onPress={() => navigation.navigate('NewsDetail', { link: n.link })}
              >
                <Card>
                  <Card.Title style={styles.title}>{n.title}</Card.Title>
                  <Card.Divider />
                  <View style={styles.user}>
                    {n.img !== undefined && <Image
                      source={{ uri: imgSrc }}
                      containerStyle={styles.item}
                      PlaceholderContent={<ActivityIndicator />}
                    />}
                    {n.img === undefined && <Image
                      source={{ uri: 'https://www.uscannenbergmedia.com/pf/resources/uscamlogo.png?d=51' }}
                      containerStyle={styles.undefinedItem}
                      PlaceholderContent={<ActivityIndicator />}
                    />}
                    <Text style={styles.description}>{n.description}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      {n.date !== undefined &&
                        <Text style={styles.date}>{n.date}</Text>
                      }
                      <TouchableOpacity onPress={() => handleLike(n)} style={styles.marker}>
                        <Ionicons name={isLiked ? 'star' : 'star-outline'} size={30} color={isLiked ? '#9a0000' : '#9a0000'} />
                      </TouchableOpacity>
                    </View>
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
    position: 'absolute',
    bottom: -8, // adjust the value to change the distance from the bottom
    right: 5, // adjust the value to change the distance from the right
    padding: 3, // adjust the padding as needed
    borderRadius: 5, // adjust the border radius as needed
  },
});

