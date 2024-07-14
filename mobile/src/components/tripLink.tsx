import { colors } from "@/styles/colors"
import { Link2 } from "lucide-react-native"
import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import * as Linking from "expo-linking"

export type TripLinkProps = {
  id: string
  title: string
  url: string
}

type Props = {
  data: TripLinkProps
}

export function TripLink({ data }: Props) {
  function handleLinkOpen() {
    Linking.openURL(data.url)
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentTexts}>
        <Text style={styles.title}>
          {data.title}
        </Text>
        <Text style={styles.url} numberOfLines={1}>
          {data.url}
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLinkOpen}>
        <Link2 color={colors.zinc[400]} size={20} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  contentTexts:{
    flex: 1,
  },
  title: {
    color: colors.zinc[100],
    fontWeight: "semibold",
  },
  url:{
    color: colors.zinc[400],
  }
})