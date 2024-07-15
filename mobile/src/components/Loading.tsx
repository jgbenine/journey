import { colors } from "@/styles/colors"
import { ActivityIndicator, StyleSheet } from "react-native"

export function Loading() {
  return (
    <ActivityIndicator style={styles.loading} />
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.zinc[950],
    color: colors.lime[300]
  },
})
