import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
  FlatList
} from 'react-native';
import SpotifyRadio from './spotifyRadios';

const Audio = () => {

  const BASE_ARC_API = 'https://radios.uscannenbergmedia.workers.dev?';

  const [radios, setRadios] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFrom, setCurrentFrom] = useState(0);

  const fetchRadios = async (size, from) => {
    const response = await axios.get(BASE_ARC_API, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      params: {
        website: 'uscannenberg',
        q: 'taxonomy.primary_site.path="/listen/from-where-we-are"',
        size: size.toString(),
        sort: 'display_date:desc',
        _sourceInclude: 'headlines.basic,subheadlines.basic,display_date,canonical_url,credits',
        from: from.toString(),
      }
    })
    return (response.data);
  }

  useEffect(() => {
    fetchRadios(30, 0).then((newRadios) => {
      setRadios(newRadios);
      setIsLoading(false);
      setCurrentFrom(30);
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    try {
      fetchRadios(30, 0).then((newRadios) => {
        setRadios(newRadios);
        setCurrentFrom(30);
      });
    } catch (error) {
      console.error(error);
    }
    setRefresh(false);
  }, []);

  const onScrollEnd = useCallback(async () => {
    setIsLoading(true);
    try {
      fetchRadios(20, currentFrom).then((nextRadios) => {
        setRadios([...radios, ...nextRadios]);
        setCurrentFrom(currentFrom + 20);
      });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [radios, currentFrom]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        overScrollMode={'never'}
        refreshing={refresh}
        onRefresh={onRefresh}
        data={radios}
        renderItem={({item}) => item && <SpotifyRadio radio={item}/>}
        keyExtractor={item => item._id}
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