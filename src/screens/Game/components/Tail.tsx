import React from 'react'
import { observer } from 'mobx-react'
import { View } from 'react-native'

import c from '@constants'
import SettingsStore from 'stores/SettingsStore'

type Props = {
  elements?: number[][]
  size?: number
}

const Tail = ({ elements, size }: Props) => {
  if (!elements?.length || !size) {
    return null
  }

  const { boardSize, theme } = SettingsStore.settings
  const colors = c.THEMES[theme]

  const gridSize = parseInt(boardSize.slice(0, 2), 10)

  const tailList = elements.map((el, index) => {
    const fade = 1 - Math.min(index / Math.max(elements.length, 1), 1) * 0.35

    return (
      <View
        key={`${el[0]}-${el[1]}-${index}`}
        style={{
          width: size - 2,
          height: size - 2,
          position: 'absolute',
          left: el[0] * size + 1,
          top: el[1] * size + 1,
          backgroundColor: colors.snakeColor,
          opacity: fade,
          borderRadius: 4,
        }}
      />
    )
  })

  return <View style={{ width: gridSize * size, height: gridSize * size }}>{tailList}</View>
}

export default observer(Tail)
