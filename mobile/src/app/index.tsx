import { useState } from "react"
import { View, Text, StyleSheet, Image, Keyboard, Alert } from "react-native"
import { MapPin, Calendar as IconCalendar, Settings2, UserRoundPlus, ArrowRight, AtSign } from "lucide-react-native"
import { DateData } from "react-native-calendars"
import { colors } from "@/styles/colors"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { Modal } from "@/components/modal"
import { Calendar } from "@/components/calendar"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils"
import dayjs from "dayjs"
import { GuestEmail } from "@/components/email"
import { validateInput } from "@/utils/validateInput"



enum StepFormControl {
  TRIP_DETAILS = 1,
  EMAIL_DETAILS = 2,
}

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  GUESTS = 2
}

export default function Index() {
  const [stepForm, setStepForm] = useState(StepFormControl.TRIP_DETAILS)
  const [showModal, setShowModal] = useState(MODAL.NONE);
  const [selectDates, setSelectDates] = useState({} as DatesSelected)
  const [destination, setDestination] = useState("")
  const [emailToEnvite, setEmailToEnvite] = useState("")
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])

  function handleNextStepForm() {
    if (destination.trim().length === 0 || !selectDates.startsAt || !selectDates.endsAt) {
      return Alert.alert("Detalhes da viagem", "Preencha os dados da viagem para prosseguir.")
    }
    if (destination.length < 4) {
      return Alert.alert("Detalhes da viagem", "Deve ter pelo menos 4 caracteres.")
    }
    if (stepForm === StepFormControl.TRIP_DETAILS) {
      return setStepForm(StepFormControl.EMAIL_DETAILS)
    }
  }

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectDates.startsAt,
      endsAt: selectDates.endsAt,
      selectedDay,
    })
    setSelectDates(dates)
  }

  function handleRemoveEmail(emailToRemove: string) {
    setEmailsToInvite((prevState) => prevState.filter((email => email !== emailToRemove)))
  }

  function handleAddEmail() {
    if (!validateInput.email(emailToEnvite)) {
      return Alert.alert("Convidade", "E-mail invalido!")
    }

    const emailExist = emailsToInvite.find((email) => email === emailToEnvite);
    if (emailExist) {
      return Alert.alert("Convidade", "E-mail ja foi adicionado!")
    }

    //Adicionando todos e-mails
    setEmailsToInvite((prevState) => [...prevState, emailToEnvite])
    setEmailToEnvite("");
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
            onChangeText={setDestination}
            value={destination}
          />
        </Input>
        <Input>
          <IconCalendar size={18} color={colors.zinc[400]} />
          <Input.Field placeholder="Quando?"
            editable={stepForm === StepFormControl.TRIP_DETAILS}
            onFocus={() => Keyboard.dismiss()}
            showSoftInputOnFocus={false}
            onPressIn={() =>
              stepForm === StepFormControl.TRIP_DETAILS
              && setShowModal(MODAL.CALENDAR)}
            value={selectDates.formatDatesInText}
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
              <Input.Field
                placeholder="Quem vai viajar junto?"
                autoCorrect={false}
                value={emailsToInvite.length > 0 ? `${emailsToInvite.length} Pessoa(s) convidada(s)` : ""}
                onPress={() => {
                  Keyboard.dismiss()
                  setShowModal(MODAL.GUESTS)
                }}
                showSoftInputOnFocus={false}
              />
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

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => { setShowModal(MODAL.NONE) }}>

        <View style={styles.modalCalendar} >
          <Calendar
            minDate={dayjs().toISOString()}
            onDayPress={handleSelectDate}
            markedDates={selectDates.dates}
          />
          <Button onPress={() => { setShowModal(MODAL.NONE) }}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Selecionar convidades"
        subtitle="Envie um e-mail para os convidades confirmarem a participação na viagem"
        visible={showModal === MODAL.GUESTS}
        onClose={() => setShowModal(MODAL.NONE)}
      >

        <View style={styles.email}>
          {emailsToInvite.length > 0 ? (
            emailsToInvite.map((email) => (
              <GuestEmail key={email} email={email} onRemove={() => { handleRemoveEmail(email) }} />
            ))
          ) : (
            <Text style={{ color: colors.zinc[500] }}>Nenhum e-mail adicionado.</Text>
          )}
        </View>

        <View>
          <Input variants="secondary">
            <AtSign color={colors.zinc[200]} size={20} />
            <Input.Field
              placeholder="E-mail do convidado"
              keyboardType="email-address"
              onChangeText={(text) => setEmailToEnvite(text.toLowerCase())}
              value={emailToEnvite}
              returnKeyType="send"
              onSubmitEditing={handleAddEmail}
            />
          </Input>
          <Button onPress={handleAddEmail}>
            <Button.Title >Convidar</Button.Title>
          </Button>
        </View>
      </Modal>

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
  backgroundImage: { position: "absolute" },
  modalCalendar: { marginTop: 20 },
  email: { marginVertical: 12, flexWrap: "wrap", gap: 2, borderBottomColor: colors.zinc[800], paddingHorizontal: 2, alignItems: "flex-start" },

})