import { Text, View, StyleSheet } from "react-native"
import { CircleDashed, CircleCheck } from "lucide-react-native"
import { colors } from "@/styles/colors"


export type ActivityProps = {
  id: string
  title: string
  hour: string
  isBefore: boolean
}

type Props = {
  data: ActivityProps
}

export function Activity({ data }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.block}>
        {data.isBefore ? (
          <CircleCheck color={colors.lime[300]} size={20} />
        ) : (
          <CircleDashed color={colors.zinc[400]} size={20} />
        )}
        <Text style={styles.title}>
          {data.title}
        </Text>
      </View>

      <Text style={styles.hour}>{data.hour}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.zinc[900],
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    gap: 12,
    marginTop: 5,
  },

  block:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },

  title: { color: colors.zinc[100], fontSize: 14 },
  hour: { color: colors.zinc[400], fontSize: 14 }

})
