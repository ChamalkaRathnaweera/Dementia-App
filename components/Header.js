import { View, Text } from 'react-native'
import React from 'react'

const Header = (props) => {
  return (
    <View >
      <Text style={{fontWeight:'bold', fontSize:32, color:"white",letterSpacing:1.8,}}>
        {props.name}
      </Text>
    </View>
  )
}

export default Header