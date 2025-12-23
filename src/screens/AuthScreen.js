import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';

export default function AuthScreen({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        const result = await onLogin(email, password);
        if (!result.success) {
          setError(result.error || 'Login failed');
        }
      } else {
        const result = await onRegister(email, password);
        if (!result.success) {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>💧 Water Reminder</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Sign in to continue' : 'Create an account'}
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              disabled={loading}
            />

            {!isLogin && (
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
                disabled={loading}
              />
            )}

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              {isLogin ? 'Sign In' : 'Register'}
            </Button>

            <Button
              mode="text"
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
                setPassword('');
                setConfirmPassword('');
              }}
              style={styles.switchButton}
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Sign In'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation: 4,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#4A90E2',
  },
  switchButton: {
    marginTop: 15,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

