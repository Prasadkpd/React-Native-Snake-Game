import React from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'

import Button from 'components/Button'
import c from '@constants'

type Props = {
  visible: boolean
  score: number
  primaryColor: string
  secondaryColor: string
  lightColor: string
  onMenu: () => void
  onRestart: () => void
}

const GameOverModal = ({ visible, score, primaryColor, secondaryColor, lightColor, onMenu, onRestart }: Props) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: secondaryColor }]}>
        <Text style={[styles.title, { color: lightColor }]}>Game Over</Text>
        <Text style={[styles.scoreLabel, { color: primaryColor }]}>Score</Text>
        <Text style={[styles.scoreValue, { color: lightColor }]}>{score}</Text>
        <View style={styles.actions}>
          <Button onPress={onRestart}>
            <View style={[styles.button, { backgroundColor: primaryColor }]}>
              <Text style={[styles.buttonText, { color: secondaryColor }]}>Play Again</Text>
            </View>
          </Button>
          <Button onPress={onMenu}>
            <View style={[styles.button, styles.secondaryButton, { borderColor: primaryColor }]}>
              <Text style={[styles.buttonText, { color: lightColor }]}>Main Menu</Text>
            </View>
          </Button>
        </View>
      </View>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
  },
  title: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 28,
    marginBottom: 8,
  },
  scoreLabel: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  scoreValue: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 48,
    marginBottom: 24,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 16,
  },
})

export default GameOverModal
