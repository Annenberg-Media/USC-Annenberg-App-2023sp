import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import { View, ScrollView, StyleSheet, Image, Text, RefreshControl, ActivityIndicator } from 'react-native';
import Videos from './videos'

const Popular = () => {

  const [videos, setVideos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const response = await axios.get('https://www.youtube.com/feeds/videos.xml?channel_id=UCRhQCjsEqWvA6Iq_WKD1CoA');
    const html = response.data;
    const $ = cheerio.load(html);
    const curVideos = [];

    $('entry').each(function (i, elem) {
      const videoId = $(elem).find('yt\\:videoId').text();
      const title = $(elem).find('title').text();
      const date = $(elem).find('published').text();
      const description = $(elem).find('media\\:description').text();
      const fullVideoId = 'https://www.youtube.com/embed/' + videoId + '?modestbranding=1';

      const datePT = new Date(date);
      // Format the date string in the desired format
      const formattedDateString = datePT.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }) + ' at ' + datePT.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short',
        timeZone: 'America/Los_Angeles',
      });

      // Output the formatted date string
      // console.log(formattedDateString); // March 23, 2023 at 11:14 am PST


      curVideos.push({
        videoId: fullVideoId,
        title: title,
        date: formattedDateString,
        description: description,
      });
    });

    setVideos(curVideos);
    setIsLoading(false);
  }

  useEffect(() => {
    // This function will only be executed once when the component mounts
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    try {
      fetchData();
    } catch (error) {
      console.error(error);
    }
    setRefresh(false);
  }, []);

  return (
    <>
      <View style={styles.container}>

        <ScrollView refreshControl={
          <RefreshControl refresh={refresh} onRefresh={onRefresh} />
        }>
          <View style={styles.container}>
            {videos && <Videos videos={videos} />}
          </View>
        </ScrollView>

        {isLoading && (
          <View style={styles.loadingHint}>
            <Text style={styles.loadingText}>Loading...</Text>
            <ActivityIndicator size="large" color="#9a0000" />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 5,
    resizeMode: 'contain',
  },
  imageView: {
    width: '95%',
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

export default Popular;