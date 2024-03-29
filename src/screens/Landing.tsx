import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ROUTE_NAMES, theme } from '../config';
import { ILandingProps } from '../navigation/MainStack';

interface ILanding extends ILandingProps {}

const Landing: React.FC<ILanding> = props => {
  const { navigation } = props;

  const { width } = useWindowDimensions();

  const sv = useSharedValue<number>(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: sv.value,
    };
  });

  const navigateToNext = () => {
    setTimeout(() => {
      navigation.replace(ROUTE_NAMES.MAIN);
    }, 1500);
  };

  const handleAnimationFinish = () => {
    sv.value = withTiming(1, {}, () => {
      runOnJS(navigateToNext)();
    });
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottieAnimations/landing.json')}
        autoPlay
        loop={false}
        style={{
          aspectRatio: 1,
          width: width,
        }}
        onAnimationFinish={() => handleAnimationFinish()}
      />
      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <Text style={styles.text}>{'WeatherApp'}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.white,
    fontSize: 24,
  },
  textContainer: {
    position: 'absolute',
    opacity: 0,
  },
});

export default Landing;
