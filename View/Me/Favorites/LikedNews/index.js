import React, { useContext, useState } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, } from 'react-native';
import { Text, Card, Image, } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NewsContext } from '../../../Context/newsContext';
import { useNavigation } from '@react-navigation/native';

const LikedNews = () => {
  const BASE_AM_URL = 'https://uscannenbergmedia.com';

  const { newsData, updateNewsData } = useContext(NewsContext);

  // used for redirecting detail news
  const navigation = useNavigation();

  const handleNewsLike = (item) => {
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

  const handlePress = (item) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove this saved article?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleNewsLike(item) }
      ]
    );
  };


  return (
    <ScrollView>
      <View style={styles.container}>
        {newsData.length > 0 ? (
          <View>
            {newsData.map(n => {
              return (
                <TouchableOpacity
                  key={n.canonical_url}
                  onPress={() => navigation.navigate('NewsDetail', { link: BASE_AM_URL + n.canonical_url })}
                >
                  <Card>
                    <Card.Title>{n.headlines.basic}</Card.Title>
                    <Card.Divider />
                    <View style={styles.user}>
                      {n.promo_items.basic.additional_properties.resizeUrl !== undefined && <Image
                        source={{ uri: BASE_AM_URL + n.promo_items.basic.additional_properties.resizeUrl }}
                        containerStyle={styles.item}
                        PlaceholderContent={<ActivityIndicator />}
                      />}
                      {n.promo_items.basic.additional_properties.resizeUrl === undefined && <Image
                        source={{ uri: 'https://www.uscannenbergmedia.com/pf/resources/uscamlogo.png?d=51' }}
                        containerStyle={styles.undefinedItem}
                        PlaceholderContent={<ActivityIndicator />}
                      />}
                      <Text style={styles.description}>{n.subheadlines.basic}</Text>
                      <View style={{ flexDirection: 'row' }}>
                        {n.display_date !== undefined &&
                          <Text style={styles.date}>{n.display_date}</Text>
                        }
                      </View>
                        <TouchableOpacity onPress={() => handlePress(n)} style={styles.marker}>
                          <Ionicons name={'star'} size={30} color={'#990000'} />
                        </TouchableOpacity>
                    </View>
                  </Card>

                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noLikedNewsText}>No liked news yet.</Text>
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
