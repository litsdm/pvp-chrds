import { Platform } from 'react-native';

const adData = Platform.select({
  ios: {
    unitID: 'ca-app-pub-1607117345046468/5224593058',
    lifeUnitID: 'ca-app-pub-1607117345046468/7538172229',
    deviceID: '68f2b459f373512472f6b6a1224d2cd9ea2f4b26'
  },
  android: {
    unitID: 'ca-app-pub-1607117345046468/8212900235',
    lifeUnitID: 'ca-app-pub-1607117345046468/3543086894',
    deviceID: '988a1c413145323445'
  }
});

export default adData;
