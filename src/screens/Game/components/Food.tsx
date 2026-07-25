import React from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, View } from 'react-native'

import SettingsStore from 'stores/SettingsStore'
import c from '@constants'

type Props = {
  position?: number[]
  size?: number
}

const Food = ({ position, size }: Props) => {
  if (!position?.length || !size) {
    return null
  }

  const { theme } = SettingsStore.settings
  const colors = c.THEMES[theme]

  const x = position[0]
  const y = position[1]
  const innerSize = size * 0.62

  return (
    <View
      key={`${x}-${y}`}
      style={[
        styles.glow,
        {
          width: size,
          height: size,
          left: x * size,
          top: y * size,
          backgroundColor: colors.foodColor,
        },
      ]}
    >
      <View
        style={[
          styles.core,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: colors.lightColor,
            opacity: 0.35,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
  },
  core: {
    position: 'absolute',
  },
})

export default observer(Food)
