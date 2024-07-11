import { X } from "lucide-react-native"
import {
  View,
  Text,
  ModalProps,
  ScrollView,
  Modal as RNModal,
  TouchableOpacity,
  StyleSheet
} from "react-native"
import { BlurView } from "expo-blur"
import { colors } from "@/styles/colors"

type Props = ModalProps & {
  title: string
  subtitle?: string
  onClose?: () => void
}

export function Modal({title, subtitle = "", onClose, children,...rest}: Props) {
  return (
    <RNModal transparent animationType="slide" {...rest}>
      <BlurView
      style={styles.blueView}
        intensity={7}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
      >
        <View style={styles.containerView}>
          <View style={styles.content}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.introduction}>
                <Text style={styles.title}>{title}</Text>

                {onClose && (
                  <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
                    <X color={colors.zinc[400]} size={20} />
                  </TouchableOpacity>
                )}
              </View>

              {subtitle.trim().length > 0 && (
                <Text style={styles.subtitle}>
                  {subtitle}
                </Text>
              )}
              {children}
            </ScrollView>
          </View>
        </View>
      </BlurView>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  blueView:{
    flex: 1,
  },
  containerView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  content:{
    backgroundColor: colors.zinc[900],
    borderColor: colors.zinc[500],
    paddingTop: 10,
    paddingBottom: 10,
  },
  introduction:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  title:{
    color: "white",
    fontWeight: "normal",
    fontSize: 32,
  },
  subtitle:{
    color: colors.zinc[400],
    marginHorizontal: 4,
  }
})
