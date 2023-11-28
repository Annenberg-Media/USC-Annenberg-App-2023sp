import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, } from '@rneui/themed';
import News from './News'
import Weather from './Weather';

const Home = ({ navigation }) => {

  const [refresh, setRefresh] = useState(false);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const initialNum = 3;

  const fetchData = async () => {
    const response = await axios.get('https://www.uscannenbergmedia.com/arcio/rss/');
    const html = response.data;
    const $ = cheerio.load(html);
    const curNews = [];

    $('item').each(function (i, elem) {
      const title = $(elem).find('title').text();
      const link = $(elem).find('guid').text();
      const date = $(elem).find('pubDate').text();
      const description = $(elem).find('description').text();

      // const datetime = new Date(Date.parse(date));

      // const year = datetime.getFullYear();
      // const month = ('0' + (datetime.getMonth() + 1)).slice(-2); // add leading zero and ensure 2 digits
      // const day = ('0' + datetime.getDate()).slice(-2); // add leading zero and ensure 2 digits
      // const hours = ('0' + datetime.getHours()).slice(-2); // add leading zero and ensure 2 digits
      // const minutes = ('0' + datetime.getMinutes()).slice(-2); // add leading zero and ensure 2 digits

      // const formattedDatetimeString = `${year}-${month}-${day} ${hours}:${minutes}`;
      // console.log(formattedDatetimeString);

      curNews.push({
        title: title,
        link: link,
        date: date,
        description: description,
        img: null,
      });
    });
    return curNews;
  };

  const fetchImgIni = async () => {
    const data = await fetchData();
    const newData = [];
    const length = initialNum > data.length ? data.length : initialNum;
    for (let i = 0; i < length; i++) {
      // console.log(i, data[i].link)
      const curresponse = await axios.get(data[i].link);
      const curhtml = curresponse.data;
      const $ = cheerio.load(curhtml);
      let imgdom = $('#main > div > div:nth-child(2) > div > figure > div > picture > img').attr('src');
      const datetime = $('#main > div > div:nth-child(2) > div > time').text();

      newData.push({
        title: data[i].title,
        link: data[i].link,
        date: datetime,
        description: data[i].description,
        img: imgdom,
      });
    }

    setNews(newData);
    return newData;
  };

  const fetchImg = async () => {
    const data = await fetchData();
    const newData = [];
    if (initialNum > data.length) {
      return newData;
    }
    for (let i = initialNum; i < data.length; i++) {
      // console.log(i, data[i].link)
      const curresponse = await axios.get(data[i].link);
      const curhtml = curresponse.data;
      const $ = cheerio.load(curhtml);
      let imgdom = $('#main > div > div:nth-child(2) > div > figure > div > picture > img').attr('src');
      const datetime = $('#main > div > div:nth-child(2) > div > time').text();

      newData.push({
        title: data[i].title,
        link: data[i].link,
        date: datetime,
        description: data[i].description,
        img: imgdom,
      });
    }

    // setNews(newData);
    return newData;
  };

  const fetchImgInfo = async () => {
    const data1 = await fetchImgIni();
    const data2 = await fetchImg();
    const data3 = data1.concat(data2);
    setNews(data3);
    setIsLoading(false);
  }

  useEffect(() => {
    // This function will only be executed once when the component mounts
    fetchImgInfo();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    try {
      fetchImgInfo();
    } catch (error) {
      console.error(error);
    }
    setRefresh(false);
  }, []);

  return (
    <>
      <ScrollView refreshControl={
        <RefreshControl refresh={refresh} onRefresh={onRefresh} />
      }>

        <Weather />

        <View style={styles.container}>
          {news && <News news={news} />}
        </View>

        {isLoading && (
          <View style={styles.loadingHint}>
            <Text style={styles.loadingText}>Loading...</Text>
            <ActivityIndicator size="large" color="#9a0000" />
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
  },
  loadingText: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 16,
  },
});

export default Home;