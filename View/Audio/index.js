import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import { View, ScrollView, StyleSheet, Text, RefreshControl, ActivityIndicator } from 'react-native';
import SpotifyRadio from './spotifyRadios';

const Audio = () => {

  // const embedUrl = "https://open.spotify.com/embed/episode/0JhiPH8neYIscxS8bV9FSc?utm_source=generator";
  const [radios, setRadios] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialNum = 2;

  const fetchData = async () => {
    const response = await axios.get('https://www.uscannenbergmedia.com/arn/');
    const html = response.data;
    const $ = cheerio.load(html);
    const curRadios = [];

    $('.list-item').each(function (i, elem) {
      const title = $(elem).find('.results-list--headline-container a').text();
      const halflink = $(elem).find('.results-list--headline-container > a').attr('href');
      const description = $(elem).find('.results-list--description-author-container > a > p').text();
      const author = $(elem).find('.results-list--description-author-container > div > section > span.ts-byline__names').text();
      const date = $(elem).find('.results-list--description-author-container > div > time').text();
      const datetimeString = $(elem).find('.results-list--description-author-container > div > time').attr('datetime');
      const link = 'https://www.uscannenbergmedia.com' + halflink;

      // convert date and time into local date and time
      // const datetime = new Date(datetimeString);
      // const year = datetime.getFullYear();
      // const month = ('0' + (datetime.getMonth() + 1)).slice(-2); // add leading zero and ensure 2 digits
      // const day = ('0' + datetime.getDate()).slice(-2); // add leading zero and ensure 2 digits
      // const hours = ('0' + datetime.getHours()).slice(-2); // add leading zero and ensure 2 digits
      // const minutes = ('0' + datetime.getMinutes()).slice(-2); // add leading zero and ensure 2 digits

      // const formattedDatetimeString = `${year}-${month}-${day} ${hours}:${minutes}`;

      curRadios.push({
        title: title,
        link: link,
        description: description,
        author: author,
        date: date,
        radio: null,
      });

    });

    return curRadios;
  };

  const fetchRadiosInit = async () => {
    const data = await fetchData();
    const newData = [];
    const length = initialNum > data.length ? data.length : initialNum;
    for (let i = 0; i < length; i++) {
      const curresponse = await axios.get(data[i].link);
      const curhtml = curresponse.data;
      const $ = cheerio.load(curhtml);
      const target = $('iframe').attr('src');

      newData.push({
        title: data[i].title,
        link: data[i].link,
        description: data[i].description,
        author: data[i].author,
        date: data[i].date,
        radio: target,
      });
    }

    setRadios(newData);
    return newData;
  };

  const fetchRadios = async () => {
    const data = await fetchData();
    const newData = [];
    if (initialNum > data.length) {
      return newData;
    }
    for (let i = initialNum; i < data.length; i++) {
      const curresponse = await axios.get(data[i].link);
      const curhtml = curresponse.data;
      const $ = cheerio.load(curhtml);
      const target = $('iframe').attr('src');
      // console.log(target);

      newData.push({
        title: data[i].title,
        link: data[i].link,
        description: data[i].description,
        author: data[i].author,
        date: data[i].date,
        radio: target,
      });
    }

    return newData;
  };

  const fetchRadiosInfo = async () => {
    const data1 = await fetchRadiosInit();
    const data2 = await fetchRadios();
    const data3 = data1.concat(data2);
    setRadios(data3);
    setIsLoading(false);
  }

  useEffect(() => {
    // This function will only be executed once when the component mounts
    fetchRadiosInfo();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    try {
      await fetchRadiosInfo();
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

        <View style={styles.container}>
          {radios && <SpotifyRadio radios={radios} />}
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
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
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

export default Audio;