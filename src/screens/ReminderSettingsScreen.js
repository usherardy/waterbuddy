import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Text, Button, Card, TextInput, Divider } from 'react-native-paper';
import { loadReminderSettings, saveReminderSettings } from '../utils/storage';

export default function ReminderSettingsScreen({ onBack, onSave }) {
  const [settings, setSettings] = useState({
    enabled: true,
    interval: 60, // minutes
    startTime: '08:00',
    endTime: '22:00',
    customAmount: 250,
  });

  useEffect(() => {
    loadReminderSettings().then(savedSettings => {
      if (savedSettings) {
        setSettings(savedSettings);
      }
    });
  }, []);

  const handleSave = async () => {
    await saveReminderSettings(settings);
    await onSave(settings);
    onBack();
  };

  const presetIntervals = [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: '3 hours', value: 180 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button icon="arrow-left" onPress={onBack} textColor="#4A90E2">
          Back
        </Button>
        <Text style={styles.headerTitle}>Reminder Settings</Text>
        <View style={{ width: 80 }} />
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Reminders</Text>
            <Switch
              value={settings.enabled}
              onValueChange={(value) =>
                setSettings({ ...settings, enabled: value })
              }
              trackColor={{ false: '#E0E0E0', true: '#BBDEFB' }}
              thumbColor={settings.enabled ? '#4A90E2' : '#F5F5F5'}
            />
          </View>
        </Card.Content>
      </Card>

      {settings.enabled && (
        <>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Reminder Interval</Text>
              <View style={styles.presetContainer}>
                {presetIntervals.map((preset) => (
                  <Button
                    key={preset.value}
                    mode={settings.interval === preset.value ? 'contained' : 'outlined'}
                    onPress={() =>
                      setSettings({ ...settings, interval: preset.value })
                    }
                    style={styles.presetButton}
                    labelStyle={
                      settings.interval === preset.value
                        ? styles.presetButtonLabelActive
                        : styles.presetButtonLabel
                    }
                  >
                    {preset.label}
                  </Button>
                ))}
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Time Range</Text>
              <View style={styles.timeContainer}>
                <View style={styles.timeInputContainer}>
                  <Text style={styles.timeLabel}>Start Time</Text>
                  <TextInput
                    mode="outlined"
                    value={settings.startTime}
                    onChangeText={(text) =>
                      setSettings({ ...settings, startTime: text })
                    }
                    placeholder="08:00"
                    style={styles.timeInput}
                    keyboardType="default"
                  />
                </View>
                <View style={styles.timeInputContainer}>
                  <Text style={styles.timeLabel}>End Time</Text>
                  <TextInput
                    mode="outlined"
                    value={settings.endTime}
                    onChangeText={(text) =>
                      setSettings({ ...settings, endTime: text })
                    }
                    placeholder="22:00"
                    style={styles.timeInput}
                    keyboardType="default"
                  />
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Reminder Amount</Text>
              <TextInput
                mode="outlined"
                label="Amount (ml)"
                value={settings.customAmount.toString()}
                onChangeText={(text) =>
                  setSettings({
                    ...settings,
                    customAmount: parseInt(text) || 250,
                  })
                }
                keyboardType="numeric"
                style={styles.amountInput}
              />
            </Card.Content>
          </Card>
        </>
      )}

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        labelStyle={styles.saveButtonLabel}
      >
        Save Settings
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  card: {
    margin: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 15,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  presetButton: {
    marginRight: 10,
    marginBottom: 10,
  },
  presetButtonLabel: {
    color: '#4A90E2',
  },
  presetButtonLabelActive: {
    color: '#FFFFFF',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  timeInputContainer: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  timeInput: {
    backgroundColor: '#FFFFFF',
  },
  amountInput: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  saveButton: {
    margin: 20,
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#4A90E2',
  },
  saveButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

