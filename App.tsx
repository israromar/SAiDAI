/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type {PropsWithChildren} from 'react';
import {
  NativeModules,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

// Define the interface for the BatteryModule
interface IBatteryModule {
  getBatteryLevel: (callback: (level: number) => void) => void;
}

// Access the BatteryModule
const BatteryModule = NativeModules.BatteryModule as IBatteryModule;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [batteryLevel, setBatteryLevel] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  console.log('🚀 ~ App ~ deviceInfo:', deviceInfo);

  console.log('🚀 ~ App ~ NativeModules:', NativeModules);
  console.log('🚀 ~ App ~ NativeModules:', NativeModules.DeviceInfoModule);

  const getDeviceInfo = async () => {
    NativeModules.DeviceInfoModule.getDeviceInfo()
      .then((info: any) => {
        console.log('Device Info:', info);
        setDeviceInfo(info);
      })
      .catch((err: any) => {
        console.error('Error fetching device info', err);
      });
  };

  useEffect(() => {
    getDeviceInfo();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1, // Ensure View takes full screen for ScrollView content
  };

  const fetchBatteryLevel = async () => {
    if (Platform.OS === 'ios' && BatteryModule) {
      BatteryModule.getBatteryLevel((level: number) => {
        if (level === -1.0) {
          setBatteryLevel('Battery level unavailable');
        } else {
          setBatteryLevel(Math.round(level * 100) + '%');
        }
      });
    } else {
      setBatteryLevel('Not available on this platform');
    }
  };

  useEffect(() => {
    fetchBatteryLevel();
  }, []);

  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic" // Standard prop for ScrollView
        style={{backgroundColor: backgroundStyle.backgroundColor}}>
        <View style={{paddingRight: safePadding}}>
          <Header />
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding, // Original padding
            paddingBottom: safePadding, // Original padding
          }}>
          <Section title="Battery Info">
            <View style={styles.batterySection}>
              <Button
                title="Refresh Battery Level"
                onPress={fetchBatteryLevel}
              />
              <Text
                style={[
                  styles.batteryText,
                  {color: isDarkMode ? Colors.white : Colors.black},
                ]}>
                Battery Level:{' '}
                {batteryLevel !== null ? batteryLevel : 'Fetching...'}
              </Text>
            </View>
          </Section>
          <Section title="Device Info">
            <View style={styles.batterySection}>
              <Button title="Refresh Device Info" onPress={getDeviceInfo} />
              <Text
                style={[
                  styles.batteryText,
                  {color: isDarkMode ? Colors.white : Colors.black},
                ]}>
                Name: {deviceInfo?.name}
              </Text>
              <Text
                style={[
                  styles.batteryText,
                  {color: isDarkMode ? Colors.white : Colors.black},
                ]}>
                System Name: {deviceInfo?.systemName}
              </Text>
              <Text
                style={[
                  styles.batteryText,
                  {color: isDarkMode ? Colors.white : Colors.black},
                ]}>
                System Version: {deviceInfo?.systemVersion}
              </Text>

              <Text
                style={[
                  styles.batteryText,
                  {color: isDarkMode ? Colors.white : Colors.black},
                ]}>
                Localized Model: {deviceInfo?.localizedModel}
              </Text>
              <Text
                style={[
                  styles.batteryText,
                  {color: isDarkMode ? Colors.white : Colors.black},
                ]}>
                Model: {deviceInfo?.model}
              </Text>
            </View>
          </Section>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    // paddingHorizontal: 24, // Duplicated with View's paddingHorizontal, removing from here
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  batterySection: {
    marginTop: 16,
    alignItems: 'center',
  },
  batteryText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
