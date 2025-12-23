import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import WaterBottle from '../components/WaterBottle';
import WaterIntakeButtons from '../components/WaterIntakeButtons';
import StatsCard from '../components/StatsCard';

export default function MainScreen({ waterData, addWater, resetDaily, updateGoal, onSettingsPress }) {
  const percentage = Math.min((waterData.today / waterData.goal) * 100, 100);
  const remaining = Math.max(waterData.goal - waterData.today, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Stay Hydrated! 💧</Text>
        <IconButton
          icon="cog"
          iconColor="#4A90E2"
          size={28}
          onPress={onSettingsPress}
        />
      </View>

      <View style={styles.bottleContainer}>
        <WaterBottle percentage={percentage} />
      </View>

      <StatsCard
        consumed={waterData.today}
        goal={waterData.goal}
        remaining={remaining}
        percentage={percentage}
      />

      <WaterIntakeButtons onAddWater={addWater} />

      <View style={styles.actionsContainer}>
        <Button
          mode="outlined"
          onPress={resetDaily}
          style={styles.resetButton}
          labelStyle={styles.resetButtonLabel}
        >
          Reset Day
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  bottleContainer: {
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  resetButton: {
    borderColor: '#4A90E2',
    borderWidth: 2,
  },
  resetButtonLabel: {
    color: '#4A90E2',
    fontSize: 16,
  },
});

