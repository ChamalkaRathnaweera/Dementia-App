
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Dashboard from './Dashboard'; // Import your existing Dashboard component
import FooterBar from '../components/FooterBar';

const DashboardWithFooter = () => {
  return (
    <View style={styles.container}>
      <Dashboard />
      <FooterBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DashboardWithFooter;