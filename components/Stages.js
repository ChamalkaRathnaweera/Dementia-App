import React, { useState } from "react";
import { View, Button, StyleSheet,Dimensions,Text } from 'react-native';

const Stages = ({onFilter}) => {

    const handleFilter = (filterType) => {
        onFilter(filterType);
      };

  return (

     <View style={styles.buttonRow}>
      <Button
        title="      All     "
        onPress={() => handleFilter("ALL")}
        color="#0782F9"
        
      /><Text> </Text>
       <Button
        title="  Severe  "
        onPress={() => handleFilter("SEVERE")}
        color="#799BE3"
        
      /><Text> </Text>

      <Button
        title="Modarate"
        onPress={() => handleFilter("MODARATE")}
        color="#799BE3"
        
      /><Text> </Text>
      <Button
        title="     Mid     "
        onPress={() => handleFilter("MID")}
        color="#799BE3"
        
      /><Text> </Text>
      <Button
        title="Normal "
        onPress={() => handleFilter("NORMAL")}
        color="#799BE3"
      />
      
    
    </View>
  
  );
};

const styles = StyleSheet.create({
   
    buttonRow: {
    width:'100%',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    button:{
    marginLeft:15
    }
  });


export default Stages;