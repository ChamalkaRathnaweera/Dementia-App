import React, { useState, useEffect } from 'react';
import { View, Text, ProgressBarAndroid } from 'react-native';

const ProgressBar = ({progress,total} ) => {

 return (
 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
 <ProgressBarAndroid
 styleAttr="Horizontal"
 indeterminate={false}
 progress={progress / total} // Convert progress to a value between 0 and 1
 style={{ width: '80%', height: 70 }}
/>
 <Text>{progress +  " out of " + total}</Text>
 </View> );
};

export default ProgressBar;