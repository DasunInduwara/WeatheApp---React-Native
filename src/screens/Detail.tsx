import { RouteProp } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { icons } from '../assets/icons';
import { theme } from '../config';
import { IDetailProps } from '../navigation/MainStack';

interface IDetail extends IDetailProps {
  route: RouteProp<{ params: { forecast: ForecastDay } }, 'params'>;
}

const Detail: React.FC<IDetail> = props => {
  const { route } = props;
  const { top, bottom } = useSafeAreaInsets();

  const {
    params: { forecast },
  } = route;

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
        <View style={[styles.summarySection]}>
          <View style={styles.summaryIconContainer}>
            <Image
              source={{
                uri: `https:${forecast.day.condition.icon.replace(
                  '64x64',
                  '128x128',
                )}`,
              }}
              style={styles.summaryMainIcon}
            />
            <View style={styles.summaryLocationContainer}>
              {!!forecast.day.avgtemp_c ? (
                <>
                  <Text style={styles.summaryTextLine3}>
                    {`${forecast.day.avgtemp_c}°C`}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.bottomSection, { marginBottom: bottom }]}>
        <ScrollView>
          <View style={styles.bottomSectionCard}>
            <Image source={icons.wind} style={styles.bottomCardIcon} />
            <View style={styles.summaryCardTextContainer}>
              <Text
                style={
                  styles.summaryCardText
                }>{`Max Wind Speed - ${forecast.day.maxwind_kph}km/h`}</Text>
            </View>
          </View>
          <View style={styles.bottomSectionCard}>
            <Image source={icons.humidity} style={styles.bottomCardIcon} />
            <View style={styles.summaryCardTextContainer}>
              <Text style={styles.summaryCardText}>
                {`Humidity / Visibility\n${forecast.day.avghumidity}g.kg-1 / ${forecast.day.avgvis_km}km`}
              </Text>
            </View>
          </View>
          <View style={styles.bottomSectionCard}>
            <Image source={icons.sun} style={styles.bottomCardIcon} />
            <View style={styles.summaryCardTextContainer}>
              <Text
                style={
                  styles.summaryCardText
                }>{`Sunrise / Sunset\n${forecast.astro.sunrise} / ${forecast.astro.sunset}`}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
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

export default Detail;
