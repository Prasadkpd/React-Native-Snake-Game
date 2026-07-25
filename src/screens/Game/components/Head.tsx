import React from 'react'
import { observer } from 'mobx-react'
import { StyleSheet, View } from 'react-native'

import c from '@constants'
import SettingsStore from 'stores/SettingsStore'

type Props = {
  position?: number[]
  size?: number
  xspeed?: number
  yspeed?: number
}

const Head = ({ position, size, xspeed = 1, yspeed = 0 }: Props) => {
  if (!position?.length || !size) {
    return null
  }

  const { theme } = SettingsStore.settings
  const colors = c.THEMES[theme]

  const x = position[0]
  const y = position[1]
  const eyeSize = Math.max(size * 0.18, 3)
  const eyeOffset = size * 0.22

  const eyes =
    xspeed !== 0
      ? [
          { left: xspeed > 0 ? size - eyeOffset - eyeSize : eyeOffset, top: eyeOffset },
          { left: xspeed > 0 ? size - eyeOffset - eyeSize : eyeOffset, top: size - eyeOffset - eyeSize },
        ]
      : [
          { left: eyeOffset, top: yspeed > 0 ? size - eyeOffset - eyeSize : eyeOffset },
          { left: size - eyeOffset - eyeSize, top: yspeed > 0 ? size - eyeOffset - eyeSize : eyeOffset },
        ]

  return (
    <View
      style={[
        styles.head,
        {
          width: size,
          height: size,
          left: x * size,
          top: y * size,
          backgroundColor: colors.snakeHeadColor,
          borderColor: colors.primaryColor,
        },
      ]}
    >
      {eyes.map((eye, index) => (
        <View
          key={index}
          style={[
            styles.eye,
            {
              width: eyeSize,
              height: eyeSize,
              left: eye.left,
              top: eye.top,
              backgroundColor: colors.secondaryColor,
            },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  head: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 1,
  },
  eye: {
    position: 'absolute',
    borderRadius: 999,
  },
})

export default observer(Head)
