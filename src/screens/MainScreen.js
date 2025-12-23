import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import WaterBottle from '../components/WaterBottle';
import WaterIntakeButtons from '../components/WaterIntakeButtons';
import StatsCard from '../components/StatsCard';

export default function MainScreen({ waterData, addWater, resetDaily, updateGoal, onSettingsPress, onLogout }) {
  const percentage = Math.min((waterData.today / waterData.goal) * 100, 100);
  const remaining = Math.max(waterData.goal - waterData.today, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Stay Hydrated! 💧</Text>
        <View style={styles.headerButtons}>
          <IconButton
            icon="cog"
            iconColor="#4A90E2"
            size={28}
            onPress={onSettingsPress}
          />
          {onLogout && (
            <IconButton
              icon="logout"
              iconColor="#FF6B6B"
              size={28}
              onPress={onLogout}
            />
          )}
        </View>
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
          mode="contained"
          onPress={resetDaily}
          style={styles.resetButton}
          labelStyle={styles.resetButtonLabel}
          icon="refresh"
          buttonColor="#FF6B6B"
          textColor="#FFFFFF"
        >
          Reset Water Intake
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 25,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resetButtonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

