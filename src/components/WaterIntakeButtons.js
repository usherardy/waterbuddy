import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const WATER_AMOUNTS = [
  { amount: 100, label: '100ml', icon: 'cup' },
  { amount: 200, label: '200ml', icon: 'cup-outline' },
  { amount: 250, label: '250ml', icon: 'cup-water' },
  { amount: 500, label: '500ml', icon: 'bottle-wine' },
];

export default function WaterIntakeButtons({ onAddWater }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Water Intake</Text>
      <View style={styles.buttonsRow}>
        {WATER_AMOUNTS.map((item) => (
          <TouchableOpacity
            key={item.amount}
            style={styles.button}
            onPress={() => onAddWater(item.amount)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={32}
              color="#4A90E2"
            />
            <Text style={styles.buttonLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 15,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  buttonLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
});

