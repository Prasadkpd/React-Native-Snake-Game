import React, { useState, useLayoutEffect, useRef } from 'react'
import { observer } from 'mobx-react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, StatusBar, View, Text, Animated } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

import FlexContainer from 'components/Layout/FlexContainer'

import SettingsStore from 'stores/SettingsStore'

import { useInterval } from 'hooks'

import c from '@constants'
import { setNavigationBarColor } from 'utils/navigationBar'
import { LoadingStackRoutes } from 'navigator/stacks/LoadingStack/routes'
import { LoadingStackParamsList } from 'navigator/stacks/LoadingStack/types'

const loadingTick = 3
const loadingDuration = c.LOADING_DURATION / (100 / loadingTick)

type Props = StackScreenProps<LoadingStackParamsList, LoadingStackRoutes.Loading>

const Loading = () => {
  const { theme } = SettingsStore.settings
  const colors = c.THEMES[theme]

  const [progress, setProgress] = useState(0)
  const [isIntervalRunning, setIsIntervalRunning] = useState(false)
  const animation = useRef(new Animated.Value(0))

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  })

  useLayoutEffect(() => {
    setNavigationBarColor(colors.secondaryColor)
    setIsIntervalRunning(true)
  }, [colors.secondaryColor])

  useLayoutEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      duration: loadingDuration,
      useNativeDriver: false,
    }).start()
  }, [progress])

  useInterval(
    () => {
      if (progress + loadingTick > 100) {
        setIsIntervalRunning(false)
        setProgress(100)
      } else {
        setProgress(current => current + loadingTick)
      }
    },
    isIntervalRunning ? loadingDuration : 0
  )

  return (
    <FlexContainer style={{ backgroundColor: colors.secondaryColor }}>
      <StatusBar translucent={false} backgroundColor={colors.secondaryColor} barStyle="light-content" />
      <View style={styles.wrapper}>
        <View style={[styles.logoBadge, { backgroundColor: colors.boardColor, borderColor: colors.primaryColor }]}>
          <Text style={styles.logoEmoji}>🐍</Text>
        </View>
        <Text style={[styles.title, { color: colors.lightColor }]}>Snake</Text>
        <Text style={[styles.subtitle, { color: colors.mutedColor }]}>Warming up the arcade...</Text>

        <View style={[styles.track, { backgroundColor: colors.boardColor }]}>
          <Animated.View style={[styles.progressBar, { width, backgroundColor: colors.primaryColor }]} />
        </View>
        <Text style={[styles.percent, { color: colors.primaryColor }]}>{progress}%</Text>
      </View>
    </FlexContainer>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: wp('80%'),
    gap: 12,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 34,
  },
  title: {
    fontSize: hp('4.5%'),
    fontFamily: c.FONTS.JOYSTIX,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: c.FONTS.JOYSTIX,
    marginBottom: 8,
  },
  track: {
    width: '100%',
    height: hp('1.8%'),
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
  },
  percent: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 14,
    marginTop: 4,
  },
})

export default observer(Loading)
