import { Text, View, StyleSheet } from "react-native"
import { CircleDashed, CircleCheck } from "lucide-react-native"

import { colors } from "@/styles/colors"

export type ParticipantProps = {
  id: string
  name?: string
  email: string
  is_confirmed: boolean
}

type Props = {
  data: ParticipantProps
}

export function Participant({ data }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapperTexts}>
        <Text style={styles.name}>
          {data.name ?? "Pendente"}
        </Text>
        <Text style={styles.email}>{data.email}</Text>
      </View>

      {data.is_confirmed ? (
        <CircleCheck color={colors.lime[300]} size={20} />
      ) : (
        <CircleDashed color={colors.zinc[400]} size={20} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  wrapperTexts: {
    flex: 1,
  },
  name: {
    color: colors.zinc[100],
    fontWeight: "semibold",
  },
  email: {
    color: colors.zinc[400],
    fontSize: 14,
  }
})
