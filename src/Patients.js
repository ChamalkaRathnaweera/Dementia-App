import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";
import PatientsSearchBox from "./PatientsSearchBox";
import DataList from './DataList';
import Icon from 'react-native-vector-icons/FontAwesome';
import Stages from "../components/Stages";




const Patients = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const db = firebase.firestore();

  const handleSearch = (query) => {

    const filteredItems = data.filter((item) =>
      item.idNo.includes(query)
    );
    setFilteredData([]);
    setFilteredData(filteredItems);
  };

  const handleFilter = (filterType) => {
    if(filterType == "ALL"){
      fetchData();

    }
    else if(filterType == "SEVERE" ){
      const filteredItems = data.filter((item) =>
      item.marks && item.marks.length > 0 && item.marks[item.marks.length - 1] >= 0 && item.marks[item.marks.length - 1] < 10
    );
    setFilteredData([]);
    setFilteredData(filteredItems);
    }
    else if(filterType == "MODARATE" ){
      const filteredItems = data.filter((item) =>
      item.marks && item.marks.length > 0 && item.marks[item.marks.length - 1] >= 10 && item.marks[item.marks.length - 1] < 20
    );
    setFilteredData([]);
    setFilteredData(filteredItems);
    }
    else if(filterType == "MID" ){
      const filteredItems = data.filter((item) =>
      item.marks && item.marks.length > 0 && item.marks[item.marks.length - 1] >= 20 && item.marks[item.marks.length - 1] < 26
    );
    setFilteredData([]);
    setFilteredData(filteredItems);
    }
    else if(filterType == "NORMAL" ){
      const filteredItems = data.filter((item) =>
      item.marks && item.marks.length > 0 && item.marks[item.marks.length - 1] >= 26 && item.marks[item.marks.length - 1] < 31
    );
    setFilteredData([]);
    setFilteredData(filteredItems);
    }
  };


  const deletePatient = (patientId) => {
    db.collection("patients").doc(patientId).delete().then(() => {
      fetchData()
    })

  };

    const fetchData = async () => {
      const querySnapshot = await db.collection('patients').get();
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(items);
      setFilteredData(items);
    };

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await db.collection('patients').get();
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(items);
      setFilteredData(items);
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        selectedItem?.id === item.id && styles.selectedItemContainer,
      ]}
      onPress={() => handleSelectItem(item)}
    >
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const onPressItem = (item) => {
    // Handle the click on the item here
    console.log("Item clicked:", item);
  };
  const ListItem = ({ item, onPress }) => {
    return (
      <TouchableOpacity onPress={() => onPress(item)}>
        <View style={styles.listItem}>
          <Text>{item.firstName+" "+item.lastName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
    <View style={styles.searchRow}>
    <PatientsSearchBox onSearch={handleSearch}  />
      <TouchableOpacity
        onPress={() => navigation.navigate("AddPatient",{fetchData:fetchData})}
      ><Icon name="plus-square-o" size={30} color="#1232A7" />
      </TouchableOpacity>
      </View>
      <Stages onFilter ={handleFilter}/>
      <DataList data={filteredData} deleteFunction={deletePatient} fetchData={fetchData}  />
    </View>
  );
};

export default Patients;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginLeft: 15,
  },
  searchRow: {
    flexDirection: 'row', // Horizontal layout
    alignItems: 'center', // Center items vertically
    padding: 10, // Padding for the row
    backgroundColor: '#eee', // Background color for the row'
  },
  button: {
    height: 45,
    backgroundColor: "#0782F9",
    width: Dimensions.get("window").width - 270,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    marginLeft: '30%',
    
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
