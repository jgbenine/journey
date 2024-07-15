import { StyleSheet, TextInput, TextInputProps, View, Platform } from "react-native";
import { ReactNode } from "react";
import { colors } from "@/styles/colors";

type Variants = "primary" | "secondary" | "tertiary"

type PropsInput = {
  children: ReactNode
  variants?: Variants
}

function Input({ children, variants = "primary" }: PropsInput) {
  const customStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    tertiary: styles.tertiary,
  };

  return (
    <View style={[styles.initial, customStyles[variants]]}>
      {children}
    </View>
  )
}

function Field({ ...rest }: TextInputProps) {
  return (
    <TextInput
      {...rest}
      style={styles.textInput}
      placeholderTextColor={colors.zinc[400]}
      cursorColor={colors.zinc[400]}
      selectionColor={Platform.OS === "ios" ? colors.zinc[400] : undefined}
    />
  )
}


const styles = StyleSheet.create({
  initial: {
    color: colors.zinc[100],
    width: "100%",
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  primary: {
    borderRadius: 6,
    borderColor: colors.zinc[800]
  },
  secondary: {
    backgroundColor: colors.zinc[950],
  },
  tertiary: {
    backgroundColor: colors.zinc[900],
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "normal",
    color: colors.zinc[200],
  }
})

Input.Field = Field;

export { Input }