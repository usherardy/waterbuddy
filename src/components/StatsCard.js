import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function StatsCard({ consumed, goal, remaining, percentage }) {
  const formatML = (ml) => {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(2)}L`;
    }
    return `${ml}ml`;
  };

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatML(consumed)}</Text>
            <Text style={styles.statLabel}>Consumed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatML(goal)}</Text>
            <Text style={styles.statLabel}>Goal</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatML(remaining)}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(percentage, 100)}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 6,
  },
});

