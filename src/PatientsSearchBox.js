import React, { useState } from "react";
import { TextInput, View, StyleSheet,Dimensions } from "react-native";

const PatientsSearchBox = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };



  return (
    <View style={styles.searchContainer}>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
   
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
   width:'90%',
   paddingRight:10
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
  },
});

export default PatientsSearchBox;
