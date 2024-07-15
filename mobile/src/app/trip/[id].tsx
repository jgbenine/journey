import { useEffect, useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar as IconCalendar, CalendarRange, Info, MapPin, Settings2, User, Mail } from "lucide-react-native";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Loading } from "@/components/Loading";
import { Modal } from "@/components/modal";
import { colors } from "@/styles/colors";
import { Calendar, DateData } from "react-native-calendars";
import { validateInput } from "@/utils/validateInput";
import { participantsServer } from "@/server/participants-server";
import { TripDetails, tripServer } from "@/server/trip-server";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import { tripStorage } from "@/storage/trip";
import Activities from "./activities";
import Details from "./details";
import dayjs from "dayjs";


export type TripData = TripDetails & {
  when: string;
};

enum MODAL {
  NONE = 0,
  UPDATE_TRIP = 1,
  CALENDAR = 2,
  CONFIRM_PARTICIPANT = 3,
}

export default function Trip() {
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [option, setOption] = useState<"activity" | "details">("activity");

  const [tripDetails, setTripDetails] = useState({} as TripData)
  const [showModal, setShowModal] = useState(MODAL.NONE)
  const [destination, setDestination] = useState("");
  const [selectDates, setSelectDates] = useState({} as DatesSelected)
  const [isUpdateTrip, setIsUpdateTrip] = useState(false);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);

  const [nameParticipant, setNameParticipant] = useState("")
  const [emailParticipant, setEmailParticipant] = useState("")

  const tripParams = useLocalSearchParams<{ id: string, participant?: string }>();

  async function getTripDetails() {
    try {
      setIsLoadingTrip(true);

      if (tripParams.participant) {
        setShowModal(MODAL.CONFIRM_PARTICIPANT);
      }

      if (!tripParams.id) {
        return router.back();
      }

      const trip = await tripServer.getTripById(tripParams.id)

      const maxLengthDestination = 14;
      const destinationFormated = trip.destination.length > maxLengthDestination ?
        trip.destination.slice(0, maxLengthDestination) + "..." : trip.destination

      const starts_atFormated = dayjs(trip.starts_at).format("DD")
      const ends_atFormated = dayjs(trip.ends_at).format("DD")
      const monthFormated = dayjs(trip.starts_at).format("MMMM")

      setDestination(trip.destination);

      setTripDetails({
        ...trip,
        when: `${destinationFormated} de ${starts_atFormated} a ${ends_atFormated} de ${monthFormated}.`,
      });

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingTrip(false);
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

  async function handleUpdateTrip() {
    try {
      if (!tripParams.id) {
        return
      }

      if (!destination || !selectDates.startsAt || !selectDates.endsAt) {
        return Alert.alert("Atualizar viagem", "Lembre-se de preencher todos os dados!")
      }

      setIsUpdateTrip(true);

      await tripServer.udpate({
        id: tripParams.id,
        destination,
        starts_at: dayjs(selectDates.startsAt.dateString).toString(),
        ends_at: dayjs(selectDates.endsAt.dateString).toString(),
      })

      Alert.alert("Atualizar viagem", "Viagem atualizada com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setShowModal(MODAL.NONE);
            getTripDetails()
          }
        },
      ])

    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdateTrip(false);
    }
  }

  async function handleConfirmeTrip() {
    try {
      if (!tripParams.participant || !tripParams.id) {
        return
      }
      if (!nameParticipant.trim() || !emailParticipant.trim()) {
        return Alert.alert("Confirmação", "Preencha nome e e-mail para confirmar viagem!")
      }
      if (!validateInput.email(emailParticipant.trim())) {
        return Alert.alert("Confirmação", "E-mail inválido!")
      }

      setIsLoadingConfirm(true);
      await participantsServer.confirmTripByParticipantId({
        participantId: tripParams.participant,
        name: nameParticipant.trim(),
        email: emailParticipant.trim(),
      })

      Alert.alert("Confirmação", `${nameParticipant}, Sua viagem foi confirmada!`)

      await tripStorage.save(tripDetails.id)
      setShowModal(MODAL.NONE);
    } catch (error) {
      console.log(error);
      Alert.alert("Confirmação", "Erro ao confirmar viagem!")
    } finally {
      setIsLoadingConfirm(false);
    }
  }

  async function handleRemoveTrip() {
    try {
      Alert.alert("Remover", "Deseja remover viagem?", [
        {
          text: "Não",
          style: "cancel",
        },
        {
          text: "Sim",
          onPress: async () => {
            await tripStorage.remove();
            router.navigate("/");
          },
        }
      ])
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTripDetails();
  }, [])

  if (isLoadingTrip) {
    return <Loading />
  }


  return (
    <View style={styles.container}>
      <Input variants="tertiary">
        <MapPin color={colors.zinc[400]} size={20} />
        <Input.Field value={tripDetails.when} readOnly />

        <TouchableOpacity style={styles.buttonEdit} activeOpacity={0.7} onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
          <Settings2 color={colors.zinc[400]} size={20} />
        </TouchableOpacity>
      </Input>

      {option === "activity" ? (
        <Activities tripDetails={tripDetails} />
      ) : (
        <Details tripId={tripDetails.id} />
      )}


      <View style={styles.menu}>
        <View style={styles.containerMenu}>
          <Button
            onPress={() => setOption("activity")}
            variant={option === "activity" ? "primary" : "secondary"}>
            <CalendarRange color={option === "activity" ? colors.lime[950] : colors.zinc[200]} size={20} />
            <Button.Title>Atividades</Button.Title>
          </Button>
          <Button
            onPress={() => setOption("details")}
            variant={option === "details" ? "primary" : "secondary"}
          >
            <Info color={option === "details" ? colors.lime[950] : colors.zinc[200]} size={20} />
            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        title="Atualizar viagem"
        subtitle="Somente quem criou viagem pode edita-la"
        visible={showModal === MODAL.UPDATE_TRIP}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View style={styles.modalUpdateTrip}>
          <Input variants="secondary">
            <MapPin size={20} color={colors.zinc[400]} />
            <Input.Field placeholder="Para onde?" onChangeText={setDestination} value={destination}></Input.Field>
          </Input>
          <Input variants="secondary">
            <IconCalendar size={20} color={colors.zinc[400]} />
            <Input.Field placeholder="Quando?"
              value={selectDates.formatDatesInText}
              onPressIn={() => setShowModal(MODAL.CALENDAR)}
              onFocus={() => Keyboard.dismiss()}></Input.Field>
          </Input>
        </View>
        <Button onPress={handleUpdateTrip} isLoading={isUpdateTrip}>
          <Button.Title>Atualizar</Button.Title>
        </Button>

      </Modal>

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
          <Button onPress={() => { setShowModal(MODAL.UPDATE_TRIP) }}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      {/* visible={showModal === MODAL.CONFIRM_PARTICIPANT} */}
      <Modal title="Confirmar presença" visible={true}>
        <View style={styles.modalPresentation}>
          <Text style={styles.textPresentation}>
            Você foi convidado(a) para participar dessa viagem, local marcado para
            viagem é, {" "}
            <Text style={styles.textHighLigth}>
              {tripDetails.destination}
            </Text>
            {" "} as datas para viagem foi marcadas
            <Text style={styles.textHighLigth}>
              {" "}de {dayjs(tripDetails.starts_at).date()}
              {" "}á {dayjs(tripDetails.ends_at).date()}
              {" "}de {dayjs(tripDetails.ends_at).format("MMMM")}.
              {"\n\n"}
            </Text>
            Para confirmar presença na viagem, preencha os dados abaixo:
          </Text>

          <Input variants="secondary">
            <User size={20} color={colors.zinc[400]} />
            <Input.Field placeholder="Nome Completo" onChangeText={setNameParticipant} />
          </Input>
          <Input variants="secondary">
            <Mail size={20} color={colors.zinc[400]} />
            <Input.Field placeholder="E-mail de confirmação" onChangeText={setEmailParticipant} />
          </Input>

          <View style={styles.modalConfirmationActions}>
            <Button isLoading={isLoadingConfirm} onPress={handleConfirmeTrip}>
              <Button.Title>Confirmar presença</Button.Title>
            </Button>

            <TouchableOpacity activeOpacity={0.8} onPress={handleRemoveTrip} >
              <Text style={styles.removeTrip}>
                Sair da viagem
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 25,
    paddingTop: 60,
  },

  buttonEdit: {
    width: 36,
    height: 36,
    backgroundColor: colors.zinc[800],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },

  menu: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.zinc[950],
    alignSelf: "center",
    justifyContent: "flex-end",
    paddingBottom: 5,
    zIndex: 10,
  },

  containerMenu: {
    flexDirection: "row",
    backgroundColor: colors.zinc[900],
    borderColor: colors.zinc[800],
    borderRadius: 18,
    gap: 10,
    padding: 15,
  },

  modalUpdateTrip: {
    gap: 5,
    marginBottom: 15,
  },

  modalCalendar: {
    marginTop: 15,
    gap: 10,
  },

  modalPresentation: {
    marginTop: 16,
    gap: 10,
  },

  modalConfirmationActions:{
    marginTop: 5,
  },

  textPresentation: {
    color: colors.zinc[400],
    fontSize: 16,
    fontWeight: "regular",
    lineHeight: 23,
  },

  textHighLigth: {
    fontWeight: "semibold",
    color: colors.zinc[100]
  },

  removeTrip: {
    textAlign: "center",
    color: "#900",
    marginTop: 10,
  }
})