import React from 'react';
import {View, Text, ImageBackground, Image, StyleSheet} from 'react-native'; 
import {Feather as Icon} from '@expo/vector-icons';
import { RectButton} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';


const Home = ()=>{
  const navigation = useNavigation();

  function handleNavigateToPoints(){
    navigation.navigate('Points');   
  };

  return(

    <View style={styles.container}>
    <View style={styles.main}>
      <Image source={require('../../assets/logo.png')}/>
      <Text style={styles.title}>Seu market de coleta de residuos </Text>
      <Text style={ styles.description}>Ajudamos pessoas a encotrarem pontos de coleta de forma esficiente</Text>
    </View>

    </View>
  )

}



