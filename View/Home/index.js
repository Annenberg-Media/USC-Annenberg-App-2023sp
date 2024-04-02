import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, SafeAreaView} from 'react-native';
import {Text,} from '@rneui/themed';
import News from './News'
import Weather from './Weather';

const Home = ({navigation}) => {

  const BASE_ARC_API = 'https://news.uscannenbergmedia.workers.dev?';

  const [refresh, setRefresh] = useState(false);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const fetchNews = async (size, from) => {
    const response = await axios.get(BASE_ARC_API, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      params: {
        website: 'uscannenberg',
        q: 'type:story',
        size: size.toString(),
        sort: 'display_date:desc',
        _sourceInclude: 'headlines.basic,subheadlines.basic,display_date,canonical_url,promo_items.basic.additional_properties.resizeUrl',
        from: from.toString(),
      }
    })
    return (response.data);
  }

  useEffect(() => {
    fetchNews(30, 0).then((newNews) => {
      setNews(newNews);
      setIsLoading(false);
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    try {
      fetchNews(30, 0).then((newNews) => {
        setNews(newNews);
      });
    } catch (error) {
      console.error(error);
    }
    setRefresh(false);
  }, []);

  const onScrollEnd = useCallback(async () => {
    setIsLoading(true);
    let currentNews = news;
    try {
      fetchNews(20, currentNews.length).then((nextNews) => {
        currentNews = currentNews.concat(nextNews);
        setNews(currentNews);
      });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [news]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        overScrollMode={'never'}
        refreshing={refresh}
        onRefresh={onRefresh}
        ListHeaderComponent={<Weather/>}
        data={news}
        renderItem={({item}) => item && <News story={item}/>}
        keyExtractor={item => item.canonical_url}
        ListFooterComponent={isLoading && (
          <View style={styles.loadingHint}>
            <Text style={styles.loadingText}>Loading...</Text>
            <ActivityIndicator size="large" color="#990000"/>
          </View>
        )}
        onEndReached={onScrollEnd}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    height: 50,
    marginLeft: 5,
    marginRight: 5,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  loadingHint: {
    height: 80,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 16,
  },
});

export default Home;