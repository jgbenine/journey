import { View } from "lucide-react-native"
import { StyleSheet, Text } from "react-native"

export default function Details({tripId} : {tripId: string}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{tripId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text: {
    color: "white"
  }

})