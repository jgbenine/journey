import { colors } from "@/styles/colors"
import { View, Text, StyleSheet, Image } from "react-native"


export default function Index(){
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("@/assets/logo.png")} resizeMode="contain" />
      <Text style={styles.text}>Convide seus amigos e planeje sua {"\n"} melhor viagem!</Text>
    </View>
  ) 
}

const styles = StyleSheet.create({
  container: {flex: 1,  justifyContent: "center", alignItems: "center"},
  text: {color: colors.zinc[400], textAlign: "center", fontSize: 20, marginTop: 10, lineHeight: 28},
  logo: {height: 25}
})