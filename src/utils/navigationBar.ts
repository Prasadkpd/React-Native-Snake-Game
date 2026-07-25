import { Platform } from 'react-native'
import SystemNavigationBar from 'react-native-system-navigation-bar'

export const setNavigationBarColor = (color: string) => {
  if (Platform.OS === 'android') {
    SystemNavigationBar.setNavigationColor(color, 'light')
  }
}
