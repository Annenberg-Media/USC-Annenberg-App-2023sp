import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, } from '@rneui/themed';
import News from './News'
import Weather from './Weather';

const Home = ({ navigation }) => {

  const BASE_ARC_API = 'https://arc-api.uscannenbergmedia.workers.dev?';

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
    fetchNews(20, 0).then((news) => {
      setNews(news);
      setIsLoading(false);
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    try {
      fetchNews(20, 0).then((news) => {
        setNews(news);
      });
    } catch (error) {
      console.error(error);
    }
    setRefresh(false);
  }, []);

  return (
    <>
      <ScrollView refreshControl={
        <RefreshControl refresh={refresh} onRefresh={onRefresh}/>
      }>

        <Weather />

        <View style={styles.container}>
          {news && <News news={news} />}
        </View>

        {isLoading && (
          <View style={styles.loadingHint}>
            <Text style={styles.loadingText}>Loading...</Text>
            <ActivityIndicator size="large" color="#990000" />
          </View>
        )}

      </ScrollView>
    </>
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
    color: "#990000",
  },
  loadingText: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 16,
  },
});

export default Home;