import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import MainStack from './src/navigation/MainStack';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  useEffect(() => {
    const hideBootSplash = async () => {
      await BootSplash.hide();
    };

    hideBootSplash();
  }, []);

  return (
    <>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
