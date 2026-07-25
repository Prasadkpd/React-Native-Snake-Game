import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Button from 'components/Button'

type Props = {
  primaryColor: string
  darkerPrimaryColor: string
  labelColor: string
  onMove: (direction: 'move-up' | 'move-down' | 'move-left' | 'move-right') => void
}

const DirectionPad = ({ primaryColor, darkerPrimaryColor, labelColor, onMove }: Props) => (
  <View style={styles.wrapper}>
    <View style={styles.row}>
      <PadButton color={primaryColor} shadowColor={darkerPrimaryColor} label="▲" labelColor={labelColor} onPress={() => onMove('move-up')} />
    </View>
    <View style={styles.row}>
      <PadButton color={primaryColor} shadowColor={darkerPrimaryColor} label="◀" labelColor={labelColor} onPress={() => onMove('move-left')} />
      <View style={styles.centerGap} />
      <PadButton color={primaryColor} shadowColor={darkerPrimaryColor} label="▶" labelColor={labelColor} onPress={() => onMove('move-right')} />
    </View>
    <View style={styles.row}>
      <PadButton color={primaryColor} shadowColor={darkerPrimaryColor} label="▼" labelColor={labelColor} onPress={() => onMove('move-down')} />
    </View>
  </View>
)

type PadButtonProps = {
  label: string
  color: string
  shadowColor: string
  labelColor: string
  onPress: () => void
}

const PadButton = ({ label, color, shadowColor, labelColor, onPress }: PadButtonProps) => (
  <Button onPress={onPress}>
    <View style={[styles.button, { backgroundColor: color, borderBottomColor: shadowColor }]}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </View>
  </Button>
)

const styles = StyleSheet.create({
  wrapper: {
    width: 220,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerGap: {
    width: 72,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
  },
  label: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: -2,
  },
})

export default DirectionPad
