import { View } from "lucide-react-native"
import { StyleSheet, Text } from "react-native"
import { TripData } from "./[id]";

type Props ={
  tripDetails: TripData;
}

export default function Activities({tripDetails} : Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{tripDetails.destination}</Text>
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