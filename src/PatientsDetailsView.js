import React from "react";
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";

const PatientsDetailsView = ({ route }) => {
  const { item } = route.params;
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();

  // Check if item is defined before accessing its properties
  const data = {
    labels: item?.attempts || [],
    datasets: [
      {
        data: item?.marks || [],
      },
    ],
  };

  const minYValue = 0;
  const maxYValue = 30;

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0, // Number of decimal places for the labels
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    yLabelsOffset: -10,
    yAxisLabel: 30,
    yAxis: {
      min: 0,
      max: 30,
    },
  };

  // Define colors based on ranges
  const getColor = (mark) => {
    if (mark >= 0 && mark <= 9) return "red";
    if (mark >= 10 && mark <= 19) return "green";
    if (mark >= 20 && mark <= 25) return "blue";
    if (mark >= 26 && mark <= 30) return "yellow";
    return "black"; // Default color
  };

  const barColors = data.datasets[0].data.map((mark) => getColor(mark));

  return (
    <View style={styles.container}>
      {item?.marks ? (
        <View>
          <Text>Previous Results</Text>
          <BarChart
            data={data}
            width={width - 20} // Adjust for margins or padding
            height={height * 0.5} // Adjust the multiplier as needed
            yAxisLabel=""
            chartConfig={chartConfig}
            fromZero={true} // Start from 0
            bezier
            barColors={barColors}
          />
        </View>
      ) : (
        <Text>Previous results not found.</Text>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("Test", { patient: item })}
        style={styles.button}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>Test</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: 45,
    backgroundColor: "#0782F9",
    width: Dimensions.get("window").width - 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },
});

export default PatientsDetailsView;
