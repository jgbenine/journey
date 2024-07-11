import { Input } from "@/components/Input"
import { colors } from "@/styles/colors"
import { View, Text, StyleSheet, Image } from "react-native"
import { MapPin, Calendar as IconCalendar, Settings2, UserRoundPlus, ArrowRight } from "lucide-react-native"
import { Button } from "@/components/Button"
import React, { useState } from "react"




enum StepFormControl {
  TRIP_DETAILS = 1,
  EMAIL_DETAILS = 2,
}

export default function Index() {
  const [stepForm, setStepForm] = useState(StepFormControl.TRIP_DETAILS)

  function handleNextStepForm() {
    if (stepForm === StepFormControl.TRIP_DETAILS) {
      return setStepForm(StepFormControl.EMAIL_DETAILS)
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("@/assets/logo.png")} resizeMode="contain" />

      <Image source={require(("@/assets/bg.png"))} style={styles.backgroundImage} />

      <Text style={styles.text}>Convide seus amigos e planeje sua {"\n"} melhor viagem!</Text>
      <View style={styles.containerInput}>
        <Input>
          <MapPin color={colors.zinc[400]} size={18} />
          <Input.Field placeholder="Para onde?"
            editable={stepForm === StepFormControl.TRIP_DETAILS}
          />
        </Input>
        <Input>
          <IconCalendar size={18} color={colors.zinc[400]} />
          <Input.Field placeholder="Quando?"
            editable={stepForm === StepFormControl.TRIP_DETAILS}
          />
        </Input>

        {stepForm === StepFormControl.EMAIL_DETAILS && (
          <>
            <Button variant="secondary"
              onPress={() => setStepForm(StepFormControl.TRIP_DETAILS)}>
              <Button.Title>Alterar local/data</Button.Title>
              <Settings2 size={18} color={colors.zinc[200]} />
            </Button>
            <Text style={styles.divisor} />
            <Input>
              <UserRoundPlus size={18} color={colors.zinc[400]} />
              <Input.Field placeholder="Quem vai viajar junto?" />
            </Input>
          </>
        )}

        <Button onPress={handleNextStepForm}>
          <Button.Title>
            {stepForm === StepFormControl.TRIP_DETAILS ? "Continuar" : "Confirmar Viagem"}
          </Button.Title>
          <ArrowRight size={18} color={colors.lime[950]} />
        </Button>
      </View>
      <Text style={styles.termosPrivacidade}>
        Ao viajar conosco estará concordando com os
        <Text style={styles.termosHighlight}>{"\n"}termos de uso e políticas de privacidade</Text>.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  text: { color: colors.zinc[400], textAlign: "center", fontSize: 20, marginTop: 10, lineHeight: 28 },
  logo: { height: 25 },
  containerInput: { width: "100%", backgroundColor: colors.zinc[800], paddingBottom: 15, paddingHorizontal: 10, borderRadius: 6, marginVertical: 40 },
  divisor: { padding: 1, marginVertical: 10, width: "100%", height: 1, backgroundColor: colors.zinc[500], opacity: 0.3 },
  termosPrivacidade: { color: colors.zinc[500], textAlign: "center", fontSize: 14, lineHeight: 20 },
  termosHighlight: { color: colors.lime[300] },
  backgroundImage: {position: "absolute"}
})