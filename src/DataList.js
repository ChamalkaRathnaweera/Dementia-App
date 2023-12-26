import React,{useEffect} from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity,Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

const DataList = ({ data,deleteFunction,fetchData }) => {
    const navigation = useNavigation();

    const onPressItem = (item) => {
        // Handle the click on the item here
        
        //item.attempts.unshift("")
        //item.marks.unshift(0)
        navigation.navigate('PatientsDetailsView', { item });
      };

    const handleDelete = (item) => {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this patient?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              // Handle delete action
            deleteFunction(item.id)
            },
          },
        ],
        { cancelable: false }
      );
    };
    useEffect(() => {
     fetchData();
    }, []);

      const ListItem = ({ item, onPress }) => {
        return (
          
            <View style={styles.listItem}>
            <TouchableOpacity onPress={() => onPress(item)} style={{width:'75%'}}>
              <Text style={{fontSize:20}}>{item.firstName+" "+item.lastName}</Text>
              </TouchableOpacity>
              <View style={styles.iconStyle}>
              <Icon name="edit" size={23} color="#1232A7" style={{ marginRight: 20 }} onPress={() => navigation.navigate("EditPatient",{patient:item,fetchData:fetchData})}/>
              <Icon name="trash-o" size={23} color="#f44336" onPress={() => handleDelete(item)} />
              </View>
              
            </View>
          
        );
      };
      
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ListItem item={item} onPress={onPressItem} />}
    />
  );
};


const styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row', // Horizontal layout
    alignItems: 'center', // Center items vertically
    padding: 10, // Padding for the row
    width:'95%'
    
  },
  iconStyle:{

    flexDirection: 'row', // Horizontal layout
    alignItems: 'center', // Center items vertically
    padding: 10, 
    marginLeft:20,
   
  }

});

export default DataList;