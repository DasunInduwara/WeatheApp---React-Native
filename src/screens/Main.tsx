import Geolocation from '@react-native-community/geolocation';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { api } from '../api';
import { icons } from '../assets/icons';
import { theme } from '../config';
import helpers from '../helpers';
import { IMainProps } from '../navigation/MainStack';
import { storedLocation } from '../types/Types';

interface IMain extends IMainProps {}

const Main: React.FC<IMain> = props => {
  const { navigation } = props;
  const { top, bottom } = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<ApiTypes.SearchResponse>(
    [],
  );
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [forecast, setForecast] = useState<ApiTypes.ForecastResponse | null>(
    null,
  );
  const [hasPermissions, setHasPermissions] = useState(false);
  const [activity, setActivity] = useState(false);

  const handleSearchClear = () => {
    setSearchText('');
    setSearchResults([]);
  };

  const handleSearchSelection = (location: Location) => {
    if (!location) return;

    setCurrentLocation(location);
    setSearchResults([]);

    Keyboard.dismiss();
  };

  useEffect(() => {
    const getAutoComplete = async (text: string) => {
      try {
        const response = await api.get<ApiTypes.SearchResponse>('search.json', {
          params: {
            q: text,
          },
        });

        setSearchResults(response.data);
      } catch (error) {
        setSearchResults([]);
      }
    };

    const loadLocation = async () => {
      const location = await helpers.storageHelper.getLocation();
      if (location) {
        setCurrentLocation(location);
      } else {
        /**
         * sets the location to New York on the first run
         */
        const defaultLocation: Location = {
          id: 2618724,
          name: 'New York',
          region: 'New York',
          country: 'United States of America',
          lat: 40.71,
          lon: -74.01,
          url: 'new-york-new-york-united-states-of-america',
        };
        setCurrentLocation(defaultLocation);
        await helpers.storageHelper.storeLocation(defaultLocation);
      }
    };

    if (searchText) {
      getAutoComplete(searchText);
    }

    if (currentLocation === null) {
      loadLocation();
    }
  }, [searchText]);

  const getForecast = async (location: Location | storedLocation) => {
    try {
      setActivity(true);
      const response = await api.get<ApiTypes.ForecastResponse>(
        'forecast.json',
        {
          params: {
            q: `${location.lat},${location.lon}`,
            days: 5,
          },
        },
      );

      setForecast(response.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load new forecast',
      });
    } finally {
      setActivity(false);
    }
  };

  useEffect(() => {
    if (currentLocation) {
      getForecast(currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      enableBackgroundLocationUpdates: false,
      locationProvider: 'auto',
    });

    Geolocation.requestAuthorization(
      () => {
        setHasPermissions(true);
      },
      error => {
        setHasPermissions(false);
      },
    );
  }, []);

  const handleGetCurrentLocation = () => {
    if (hasPermissions) {
      Geolocation.getCurrentPosition(
        position => {
          getForecast({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        error => {
          Toast.show({
            type: 'error',
            text1: 'Please grant permission to use your location',
          });
        },
      );
    } else {
      Toast.show({
        type: 'error',
        text1: 'Please grant permission to use your location',
      });
      Geolocation.requestAuthorization(
        () => {
          setHasPermissions(true);
        },
        error => {
          setHasPermissions(false);
        },
      );
    }
  };

  const handleDetailView = (forecast: ForecastDay) => {
    navigation.navigate('Detail', { forecast });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.select({
            ios: top,
            android: top + 8,
          }),
        },
        styles.margin,
      ]}>
      <View>
        <View style={styles.searchContainer}>
          <View style={styles.searchLeftContainer}>
            <Image source={icons.search} style={styles.searchIcon} />
            <TextInput
              placeholder={'Search'}
              style={styles.searchInput}
              placeholderTextColor={theme.placeholder}
              onChangeText={value => setSearchText(value)}
              value={searchText}
            />
          </View>
          <Pressable style={styles.flexRow} onPress={handleSearchClear}>
            {searchText.length > 0 ? (
              <Image source={icons.close} style={styles.closeIcon} />
            ) : null}
          </Pressable>
        </View>
        <View
          style={[
            styles.resultsContainer,
            {
              display: searchResults.length > 0 ? 'flex' : 'none',
            },
          ]}>
          {searchResults.map((result, index, array) => {
            return (
              <Pressable
                key={result.id.toString()}
                onPress={() => handleSearchSelection(result)}>
                <View style={styles.resultItem}>
                  <Text
                    style={
                      styles.resultText
                    }>{`${result.name}, ${result.region}, ${result.country}`}</Text>
                </View>
                {array.length !== index + 1 ? (
                  <View style={styles.divider} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={{ zIndex: -4 }}>
        <View style={[styles.summarySection]}>
          {!activity ? (
            <View style={styles.summaryIconContainer}>
              <Image
                source={{
                  uri: `https:${forecast?.current.condition.icon.replace(
                    '64x64',
                    '128x128',
                  )}`,
                }}
                style={styles.summaryMainIcon}
              />
              <View style={styles.summaryLocationContainer}>
                {!!forecast?.current.temp_c ? (
                  <>
                    <Text style={styles.summaryTextLine1}>
                      {forecast?.location.name}
                    </Text>
                    <Text style={styles.summaryTextLine2}>
                      {forecast?.location.country}
                    </Text>
                    <Text style={styles.summaryTextLine3}>
                      {`${forecast?.current.temp_c}°C`}
                    </Text>
                  </>
                ) : null}
                <Pressable onPress={handleGetCurrentLocation}>
                  <View style={styles.currentLocationButton}>
                    <Image source={icons.near} style={styles.locationIcon} />
                    <Text style={styles.currentLocationText}>
                      {'Current Location'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.summaryIconContainer}>
              <LottieView
                source={require('../assets/lottieAnimations/loading.json')}
                autoPlay
                loop
                style={{
                  aspectRatio: 1,
                  width: 128,
                }}
              />
            </View>
          )}
        </View>
      </View>
      {!activity ? (
        <View style={styles.summaryCardsSection}>
          <ScrollView horizontal>
            {forecast?.forecast.forecastday.map((forecast, index) => {
              if (index === 0) return null;

              return (
                <TouchableOpacity
                  key={forecast.date_epoch}
                  onPress={() => handleDetailView(forecast)}>
                  <View style={styles.summaryCard}>
                    <Text style={styles.cardText}>
                      {helpers.dateHelper.getDateLabel(forecast.date_epoch)}
                    </Text>
                    <Image
                      source={{
                        uri: `https:${forecast.day.condition.icon.replace(
                          '64x64',
                          '128x128',
                        )}`,
                      }}
                      style={styles.summaryCardIcon}
                    />
                    <Text
                      style={
                        styles.cardText
                      }>{`${forecast.day.avgtemp_c}°C`}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
      {!activity ? (
        <View
          style={[
            styles.bottomSection,
            { marginBottom: Platform.OS === 'ios' ? bottom : bottom + 10 },
          ]}>
          <Text style={styles.summaryTitleText}>{"Today's Summary"}</Text>
          <ScrollView>
            <View style={styles.bottomSectionCard}>
              <Image source={icons.wind} style={styles.bottomCardIcon} />
              <View style={styles.summaryCardTextContainer}>
                <Text
                  style={
                    styles.summaryCardText
                  }>{`Wind Speed - ${forecast?.current.wind_kph}km/h`}</Text>
              </View>
            </View>
            <View style={styles.bottomSectionCard}>
              <Image source={icons.humidity} style={styles.bottomCardIcon} />
              <View style={styles.summaryCardTextContainer}>
                <Text style={styles.summaryCardText}>
                  {`Humidity / Pressure\n${forecast?.current.humidity}g.kg-1 / ${forecast?.current.pressure_in}inHg`}
                </Text>
              </View>
            </View>
            <View style={styles.bottomSectionCard}>
              <Image source={icons.sun} style={styles.bottomCardIcon} />
              <View style={styles.summaryCardTextContainer}>
                <Text
                  style={
                    styles.summaryCardText
                  }>{`Sunrise / Sunset\n${forecast?.forecast.forecastday[0].astro.sunrise} / ${forecast?.forecast.forecastday[0].astro.sunset}`}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.secondary,
    flex: 1,
  },
  text: {
    fontSize: 24,
    color: theme.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.white,
    borderRadius: 8,
    borderColor: theme.placeholder,
    borderWidth: 1,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
  },
  searchLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    width: 20,
    aspectRatio: 1,
    marginRight: 4,
    tintColor: theme.placeholder,
  },
  closeIcon: {
    width: 16,
    aspectRatio: 1,
    marginRight: 4,
    tintColor: theme.placeholder,
  },
  searchInput: {
    color: theme.black,
    fontSize: 14,
    minHeight: 40,
    lineHeight: 18,
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  resultsContainer: {
    position: 'absolute',
    top: 45,
    borderRadius: 8,
    borderColor: theme.placeholder,
    borderWidth: 1,
    paddingHorizontal: 4,
    backgroundColor: theme.placeholder,
    width: '100%',
    zIndex: 999,
  },
  resultItem: {
    minHeight: 40,
    justifyContent: 'center',
  },
  resultText: {
    color: theme.white,
    fontSize: 14,
  },
  margin: {
    paddingHorizontal: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.white,
  },
  summarySection: {},
  summaryIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  summaryMainIcon: {
    width: 128,
    aspectRatio: 1,
  },
  summaryLocationContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  summaryTextLine1: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: theme.primary,
  },
  summaryTextLine2: {
    fontSize: 14,
    fontWeight: '300',
    marginBottom: 20,
    color: theme.primary,
  },
  summaryTextLine3: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 12,
    color: theme.primary,
  },
  currentLocationButton: {
    padding: 8,
    backgroundColor: theme.placeholder,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationText: {
    fontSize: 12,
    fontWeight: '400',
    color: theme.white,
  },
  locationIcon: {
    tintColor: theme.white,
    width: 12,
    aspectRatio: 1,
    marginRight: 10,
  },
  summaryCardsSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  summaryCardIcon: {
    width: 64,
    aspectRatio: 1,
  },
  summaryCard: {
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.placeholder,
    padding: 8,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.primary,
    marginTop: 4,
  },
  bottomSection: {
    // backgroundColor: 'blue',
    flex: 1,
  },
  bottomSectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  bottomCardIcon: {
    width: 64,
    aspectRatio: 1,
    tintColor: theme.primary,
  },
  summaryTitleText: {
    fontSize: 14,
    fontWeight: '300',
    color: theme.primary,
    marginBottom: 10,
  },
  summaryCardText: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.primary,
  },
  summaryCardTextContainer: {
    flex: 1,
    paddingLeft: 40,
  },
});

export default Main;
