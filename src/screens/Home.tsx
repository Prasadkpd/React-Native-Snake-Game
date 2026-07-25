import React from 'react'
import { observer } from 'mobx-react'
import RNExitApp from 'react-native-exit-app'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, StatusBar, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Button from 'components/Button'

import SettingsStore from 'stores/SettingsStore'

import { AppStackRoutes } from 'navigator/stacks/AppStack/routes'
import { AppStackParamsList } from 'navigator/stacks/AppStack/types'

import c from '@constants'

type Props = StackScreenProps<AppStackParamsList, AppStackRoutes.Home>

class Home extends React.Component<Props> {
  private startNewGame = () => {
    const { navigation } = this.props

    navigation.navigate(AppStackRoutes.Game)
  }

  private goToSettings = () => {
    const { navigation } = this.props

    navigation.navigate(AppStackRoutes.Settings)
  }

  render() {
    const { theme } = SettingsStore.settings
    const colors = c.THEMES[theme]

    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.secondaryColor }]} edges={['top', 'bottom']}>
        <StatusBar translucent={false} backgroundColor={colors.secondaryColor} barStyle="light-content" />

        <View style={styles.hero}>
          <View style={[styles.logoBadge, { backgroundColor: colors.boardColor, borderColor: colors.primaryColor }]}>
            <Text style={[styles.logoEmoji, { color: colors.primaryColor }]}>🐍</Text>
          </View>
          <Text style={[styles.title, { color: colors.lightColor }]}>Snake</Text>
          <Text style={[styles.subtitle, { color: colors.mutedColor }]}>Classic arcade. Modern controls.</Text>
        </View>

        <View style={styles.menuWrapper}>
          <MenuButton label="New Game" colors={colors} filled onPress={this.startNewGame} />
          <MenuButton label="Settings" colors={colors} onPress={this.goToSettings} />
          <MenuButton label="Exit" colors={colors} onPress={RNExitApp.exitApp} />
        </View>
      </SafeAreaView>
    )
  }
}

type MenuButtonProps = {
  label: string
  filled?: boolean
  colors: (typeof c.THEMES)[keyof typeof c.THEMES]
  onPress: () => void
}

const MenuButton = ({ label, filled = false, colors, onPress }: MenuButtonProps) => (
  <Button onPress={onPress}>
    <View
      style={[
        styles.btnContainer,
        filled
          ? { backgroundColor: colors.primaryColor, borderBottomColor: colors.darkerPrimaryColor }
          : { backgroundColor: colors.boardColor, borderBottomColor: colors.gridColor, borderWidth: 1, borderColor: colors.gridColor },
      ]}
    >
      <Text style={[styles.btnText, { color: filled ? colors.secondaryColor : colors.lightColor }]}>{label}</Text>
    </View>
  </Button>
)

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 52,
    fontFamily: c.FONTS.JOYSTIX,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: c.FONTS.JOYSTIX,
    marginTop: 10,
    textAlign: 'center',
  },
  menuWrapper: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    gap: 12,
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    borderBottomWidth: 4,
  },
  btnText: {
    fontSize: 18,
    fontFamily: c.FONTS.JOYSTIX,
  },
})

export default observer(Home)
