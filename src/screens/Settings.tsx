import React from 'react'
import { observer } from 'mobx-react'
import { StackScreenProps } from '@react-navigation/stack'
import { setNavigationBarColor } from 'utils/navigationBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, StatusBar, View, Text, ScrollView } from 'react-native'

import Icon from 'components/Icon'
import Header from 'components/Header'
import Button from 'components/Button'

import SettingsStore from 'stores/SettingsStore'

import { AppStackRoutes } from 'navigator/stacks/AppStack/routes'
import { AppStackParamsList } from 'navigator/stacks/AppStack/types'

import c, { ColorThemes, Difficulties } from '@constants'

type Props = StackScreenProps<AppStackParamsList, AppStackRoutes.Settings>

const DIFFICULTY_LABELS: Record<Difficulties, string> = {
  low: 'Easy',
  medium: 'Normal',
  high: 'Hard',
}

const Settings = ({ navigation }: Props) => {
  const { settings, updateBoardSize, updateDifficulty, updateTheme, updateUseSwipes, updateTeleport } =
    SettingsStore
  const { boardSize, difficulty: selectedDifficulty, theme: selectedTheme, useSwipes, useTeleport } = settings
  const colors = c.THEMES[selectedTheme]

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: colors.secondaryColor }]}>
      <StatusBar translucent={false} backgroundColor={colors.secondaryColor} barStyle="light-content" />
      <Header
        title="Settings"
        leftView={{
          node: <Icon name="backIcon" style={{ tintColor: colors.lightColor, width: 18, height: 18 }} />,
          onPress: () => navigation.goBack(),
        }}
        style={{ backgroundColor: colors.secondaryColor }}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SettingsSection title="Gameplay" colors={colors}>
          <SettingRow label="Board size" colors={colors}>
            {c.SETTINGS.BOARD_SIZES.map(size => (
              <OptionChip
                key={size}
                label={size.replace('x', ' × ')}
                selected={boardSize === size}
                colors={colors}
                onPress={() => updateBoardSize(size)}
              />
            ))}
          </SettingRow>
          <SettingRow label="Difficulty" colors={colors}>
            {c.SETTINGS.DIFFICULTIES.map(difficulty => (
              <OptionChip
                key={difficulty}
                label={DIFFICULTY_LABELS[difficulty]}
                selected={selectedDifficulty === difficulty}
                colors={colors}
                onPress={() => updateDifficulty(difficulty)}
              />
            ))}
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Controls" colors={colors}>
          <SettingRow label="Steering" colors={colors}>
            <OptionChip label="D-Pad" selected={!useSwipes} colors={colors} onPress={() => updateUseSwipes(false)} />
            <OptionChip label="Swipes" selected={useSwipes} colors={colors} onPress={() => updateUseSwipes(true)} />
          </SettingRow>
          <SettingRow label="Wall behavior" colors={colors}>
            <OptionChip label="Game Over" selected={!useTeleport} colors={colors} onPress={() => updateTeleport(false)} />
            <OptionChip label="Teleport" selected={useTeleport} colors={colors} onPress={() => updateTeleport(true)} />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Theme" colors={colors}>
          <SettingRow label="Color palette" colors={colors}>
            {c.SETTINGS.THEMES.map(themeOption => (
              <ThemeChip
                key={themeOption}
                theme={themeOption}
                selected={selectedTheme === themeOption}
                onPress={() => {
                  updateTheme(themeOption)
                  setNavigationBarColor(c.THEMES[themeOption].secondaryColor)
                }}
              />
            ))}
          </SettingRow>
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  )
}

type ThemeColors = (typeof c.THEMES)[ColorThemes]

const SettingsSection = ({
  title,
  colors,
  children,
}: {
  title: string
  colors: ThemeColors
  children: React.ReactNode
}) => (
  <View style={[styles.section, { backgroundColor: colors.boardColor }]}>
    <Text style={[styles.sectionTitle, { color: colors.primaryColor }]}>{title}</Text>
    {children}
  </View>
)

const SettingRow = ({
  label,
  colors,
  children,
}: {
  label: string
  colors: ThemeColors
  children: React.ReactNode
}) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, { color: colors.lightColor }]}>{label}</Text>
    <View style={styles.chipRow}>{children}</View>
  </View>
)

const OptionChip = ({
  label,
  selected,
  colors,
  onPress,
}: {
  label: string
  selected: boolean
  colors: ThemeColors
  onPress: () => void
}) => (
  <Button onPress={onPress}>
    <View
      style={[
        styles.chip,
        selected
          ? { backgroundColor: colors.primaryColor, borderColor: colors.primaryColor }
          : { backgroundColor: colors.secondaryColor, borderColor: colors.gridColor },
      ]}
    >
      <Text style={[styles.chipText, { color: selected ? colors.secondaryColor : colors.lightColor }]}>{label}</Text>
    </View>
  </Button>
)

const ThemeChip = ({
  theme,
  selected,
  onPress,
}: {
  theme: ColorThemes
  selected: boolean
  onPress: () => void
}) => {
  const palette = c.THEMES[theme]

  return (
    <Button onPress={onPress}>
      <View
        style={[
          styles.themeChip,
          { backgroundColor: palette.primaryColor, borderColor: selected ? palette.lightColor : 'transparent' },
        ]}
      >
        <Text style={[styles.themeChipText, { color: palette.secondaryColor }]}>{theme}</Text>
      </View>
    </Button>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  section: {
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: {
    gap: 10,
  },
  rowLabel: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 72,
    alignItems: 'center',
  },
  chipText: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 13,
  },
  themeChip: {
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 88,
    alignItems: 'center',
  },
  themeChipText: {
    fontFamily: c.FONTS.JOYSTIX,
    fontSize: 13,
    textTransform: 'capitalize',
  },
})

export default observer(Settings)
