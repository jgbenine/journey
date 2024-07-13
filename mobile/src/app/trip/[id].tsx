import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Loading } from "@/components/Loading";
import { TripDetails, tripServer } from "@/server/trip-server";
import { colors } from "@/styles/colors";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { CalendarRange, Info, MapPin, Settings2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


type TripData = TripDetails & {
  when: string;
};

export default function Trip() {
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [option, setOption] = useState<"activity" | "details">("activity");

  const [tripDetails, setTripDetails] = useState({} as TripData)
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

        <TouchableOpacity style={styles.buttonEdit} activeOpacity={0.7}>
          <Settings2 color={colors.zinc[400]} size={20} />
        </TouchableOpacity>
      </Input>

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
})