import { colors } from "@/styles/colors";
import { TouchableOpacity, TextProps, TouchableOpacityProps, StyleSheet, Text, ActivityIndicator } from "react-native";
import { createContext, useContext } from "react";


type Variants = "primary" | "secondary";

type PropsButton = TouchableOpacityProps & {
  variant?: Variants,
  isLoading?: boolean,
}

const ButtonContext = createContext<{ variant?: Variants }>({});


function Button({ variant = "primary", children, isLoading, ...rest }: PropsButton) {
  const customStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
  };

  return (
    <TouchableOpacity style={[styles.button, customStyles[variant]]}  {...rest} disabled={isLoading} activeOpacity={0.9}>
      <ButtonContext.Provider value={{ variant }}>
        {isLoading ? <ActivityIndicator /> : children}
      </ButtonContext.Provider>
    </TouchableOpacity>
  )
}

const Title: React.FC<TextProps> = ({ children }) => {
  const { variant } = useContext(ButtonContext);

  return (
    <Text style={[
      styles.titleButton,
      variant === 'primary' && styles.textPrimary,
      variant === 'secondary' && styles.textSecondary]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 8,
  },
  primary: {
    backgroundColor: colors.lime[300],
  },
  secondary: {
    backgroundColor: colors.zinc[500],
    color: colors.zinc[100],
  },
  titleButton: {
    fontWeight: "semibold",
    fontSize: 18,
  },
  textPrimary: {
    color: colors.lime[950]
  },
  textSecondary: {
    color: colors.zinc[100]
  }
})


Button.Title = Title;

export { Button }