import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Loading } from "@/components/Loading";
import { TripDetails, tripServer } from "@/server/trip-server";
import { colors } from "@/styles/colors";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar as IconCalendar, CalendarRange, Info, MapPin, Settings2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Activities from "./activities";
import Details from "./details";
import { Modal } from "@/components/modal";
import { Calendar, DateData } from "react-native-calendars";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";


export type TripData = TripDetails & {
  when: string;
};

enum MODAL {
  NONE = 0,
  UPDATE_TRIP = 1,
  CALENDAR = 2,
}

export default function Trip() {
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [option, setOption] = useState<"activity" | "details">("activity");

  const [tripDetails, setTripDetails] = useState({} as TripData)
  const [showModal, setShowModal] = useState(MODAL.NONE)
  const [destination, setDestination] = useState("");
  const [selectDates, setSelectDates] = useState({} as DatesSelected)
  const [isUpdateTrip, setIsUpdateTrip] = useState(false);
  const tripId = useLocalSearchParams<{ id: string }>().id;

  async function getTripDetails() {
    try {
      setIsLoadingTrip(true);
      if (!tripId) {
        return router.back();
      }

      const trip = await tripServer.getTripById(tripId)

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
      if (!tripId) {
        return
      }

      if (!destination || !selectDates.startsAt || !selectDates.endsAt) {
        return Alert.alert("Atualizar viagem", "Lembre-se de preencher todos os dados!")
      }

      setIsUpdateTrip(true);

      await tripServer.udpate({
        id: tripId,
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
            variant={option === "activity" ? "primary" : "secondary"}
          >
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
        <View style={styles.contentModal}>
          <Input variants="secondary">
            <MapPin size={20} color={colors.zinc[400]} />
            <Input.Field placeholder="Para onde?" onChangeText={setDestination} value={destination}></Input.Field>
          </Input>
          <Input variants="secondary">
            <IconCalendar size={20} color={colors.zinc[400]} />
            <Input.Field placeholder="Quando?" value={selectDates.formatDatesInText} onPressIn={() => setShowModal(MODAL.CALENDAR)} onFocus={() => Keyboard.dismiss()}></Input.Field>
          </Input>
          <Button onPress={handleUpdateTrip} isLoading={isUpdateTrip}>
            <Button.Title>Atualizar</Button.Title>
          </Button>
        </View>

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

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.zinc[900],
    borderColor: colors.zinc[800],
    borderRadius: 18,
    gap: 10,
    padding: 15,
  },

  contentModal: {
    gap: 2,
    marginVertical: 12,
  },

  modalCalendar: { marginTop: 20 },
})