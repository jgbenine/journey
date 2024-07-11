import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import { X } from "lucide-react-native"
import { colors } from "@/styles/colors"

type Props = {
  email: string
  onRemove: () => void
}

export function GuestEmail({ email, onRemove }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.email}>{email}</Text>
      <TouchableOpacity onPress={onRemove}>
        <X color={colors.zinc[400]} size={16} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: colors.zinc[800],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  email:{
    color: colors.zinc[300],
  }

})
