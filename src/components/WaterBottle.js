import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function WaterBottle({ percentage }) {
  // Calculate water level from bottom (bottle body starts at y=100, ends at y=350)
  const bottleTop = 100;
  const bottleBottom = 350;
  const bottleHeight = bottleBottom - bottleTop;
  const waterLevel = bottleBottom - (bottleHeight * percentage / 100);
  const waterTop = Math.max(waterLevel, bottleTop);
  const waterBottom = bottleBottom;
  const hasWater = percentage > 0;

  return (
    <View style={styles.container}>
      <Svg width="200" height="400" viewBox="0 0 200 400">
        <Defs>
          <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.95" />
            <Stop offset="50%" stopColor="#29B6F6" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#0288D1" stopOpacity="0.9" />
          </LinearGradient>
          <LinearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#E3F2FD" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#BBDEFB" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* Water fill - fills from bottom */}
        {hasWater && (
          <Path
            d={`M 65 ${waterBottom} L 65 ${waterTop} Q 65 ${waterTop - 5} 70 ${waterTop - 5} L 130 ${waterTop - 5} Q 135 ${waterTop - 5} 135 ${waterTop} L 135 ${waterBottom} Z`}
            fill="url(#waterGradient)"
            opacity={0.9}
          />
        )}

        {/* Water surface with wave effect */}
        {hasWater && (
          <Path
            d={`M 65 ${waterTop} Q 70 ${waterTop - 2} 75 ${waterTop} T 85 ${waterTop} T 95 ${waterTop} T 105 ${waterTop} T 115 ${waterTop} T 125 ${waterTop} T 135 ${waterTop}`}
            fill="none"
            stroke="#81D4FA"
            strokeWidth="2.5"
            opacity={0.8}
          />
        )}

        {/* Bottle outline */}
        <Path
          d="M 60 50 L 60 80 Q 60 100 80 100 L 120 100 Q 140 100 140 80 L 140 350 Q 140 370 120 370 L 80 370 Q 60 370 60 350 Z"
          fill="url(#bottleGradient)"
          stroke="#1976D2"
          strokeWidth="4"
        />

        {/* Bottle cap */}
        <Path
          d="M 60 50 L 140 50 L 140 80 L 60 80 Z"
          fill="#64B5F6"
          stroke="#1976D2"
          strokeWidth="2"
        />

        {/* Bottle label area */}
        <Path
          d="M 70 150 L 130 150 L 130 250 L 70 250 Z"
          fill="none"
          stroke="#1976D2"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity={0.3}
        />
      </Svg>

      {/* Percentage text overlay */}
      <View style={styles.percentageContainer}>
        <Text style={styles.percentageText}>
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  percentageContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -15 }],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
});

