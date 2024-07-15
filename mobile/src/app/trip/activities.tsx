import { useEffect, useState } from "react";
import { Alert, Keyboard, StyleSheet, Text, View, SectionList } from "react-native"
import { PlusIcon, Tag, Calendar as IconCalendar, Clock } from "lucide-react-native"
import { Button } from "@/components/Button";
import { Modal } from "@/components/modal";
import { Input } from "@/components/Input";
import { colors } from "@/styles/colors";
import { TripData } from "./[id]";
import { Calendar } from "@/components/calendar";
import { activitiesServer } from "@/server/activities-server";
import { Activity, ActivityProps } from "@/components/activity";
import dayjs from "dayjs";
import { Loading } from "@/components/Loading";

type Props = {
  tripDetails: TripData;
}

type TripActivities = {
  title: {
    dayNumber: number,
    dayName: string,
  }
  data: ActivityProps[]
}

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  NEW_ACTIVITY = 2,
}

export default function Activities({ tripDetails }: Props) {
  const [showModal, setShowModal] = useState(MODAL.NONE);

  const [activityTitle, setActivityTitle] = useState("")
  const [activityDate, setActivityDate] = useState("")
  const [activityHour, setActivityHour] = useState("")

  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);

  const [tripActivities, setTripActivities] = useState<TripActivities[]>([])



  function resetActivityFields() {
    setActivityTitle("")
    setActivityDate("")
    setActivityHour("")
  }


  async function handleCreateTripActivity() {
    try {
      if (!activityTitle || !activityDate || !activityHour) {
        Alert.alert("Cadastrar atividades", "Preencha todos os campos!");
      }
      setIsCreatingActivity(true);

      await activitiesServer.create({
        tripId: tripDetails.id,
        occours_at: dayjs(activityDate).add(Number(activityHour), "h").toString(),
        title: activityTitle,
      })

      Alert.alert("Cadastrar atividades", "Atividade cadastrada com sucesso!");

      await getTripActivities();
      resetActivityFields()
    } catch (error) {
      console.log(error)
    } finally {
      setIsCreatingActivity(false);
      setShowModal(MODAL.NONE);
    }
  }

  async function getTripActivities() {
    try {
      const activities = await activitiesServer.getActivitiesByTripId(tripDetails.id)

      const activitiesSectionList = activities.map((dayActivity) => ({
        title: {
          dayNumber: dayjs(dayActivity.date).date(),
          dayName: dayjs(dayActivity.date).format("dddd").replace("-feira", ""),
        },
        data: dayActivity.activities.map((activity) => ({
          id: activity.id,
          title: activity.title,
          hour: dayjs(activity.occours_at).format("HH[:]mm[h]"),
          isBefore: dayjs(activity.occours_at).isBefore(dayjs())
        })),
      }))

      setTripActivities(activitiesSectionList);
      // console.log(activitiesSectionList);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingActivity(false);
    }
  }

  useEffect(() => {
    getTripActivities();
  }, [])


  return (
    <View style={styles.container}>
      <View style={styles.contentIntro}>
        <Text style={styles.titleIntro}>Atividades:</Text>
        <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
          <PlusIcon color={colors.lime[950]} size={20} />
          <Button.Title>Nova atividade</Button.Title>
        </Button>
      </View>


      {isLoadingActivity ? <Loading /> : (
        <SectionList
          sections={tripActivities}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{paddingBottom: 100}}
          renderItem={({ item }) => <Activity data={item} />}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionList}>
              <View style={styles.containerDays}>
                <Text style={styles.textDayNumber}>
                  Dia {section.title.dayNumber + " "}
                </Text>
                <Text style={styles.textDayName}>
                  {section.title.dayName}
                </Text>
              </View>
              {
                section.data.length === 0 && (
                  <Text style={styles.emptyAtivity}>
                    Nenhuma atividade cadastrada nessa data.
                  </Text>
                )
              }

            </View>
          )}
        />
      )}

      <Modal
        visible={showModal === MODAL.NEW_ACTIVITY}
        title="Cadastrar atividade"
        subtitle="Todos convidados podem visualizar"
        onClose={() => { setShowModal(MODAL.NONE) }}>

        <View style={styles.modalActivity}>
          <Input variants="secondary">
            <Tag color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Qual nova atividade?"
              onChangeText={setActivityTitle}
              value={activityTitle} />
          </Input>

          <View style={styles.containersInput}>
            <View style={styles.blockInput}>
              <Input variants="secondary">
                <IconCalendar color={colors.zinc[400]} size={20} />
                <Input.Field
                  placeholder="Data:"
                  onChangeText={setActivityDate}
                  value={activityDate ? dayjs(activityDate).format("DD [de] MMMM") : ""}
                  onFocus={() => Keyboard.dismiss()}
                  showSoftInputOnFocus={false}
                  onPress={() => setShowModal(MODAL.CALENDAR)}
                />
              </Input>
            </View>

            <View style={styles.blockInput}>
              <Input variants="secondary">
                <Clock color={colors.zinc[400]} size={20} />
                <Input.Field
                  placeholder="Horário:"
                  onChangeText={(text) => setActivityHour(text.replace(".", "").replace(",", ""))}
                  value={activityHour}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </Input>
            </View>
          </View>
          <Button onPress={handleCreateTripActivity} isLoading={isCreatingActivity}>
            <Button.Title>
              Cadastrar
            </Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Selecionar data"
        subtitle="Selecionar a data de atividades"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.NONE)}>
        <View style={styles.modalCalendar}>
          <Calendar
            onDayPress={(day) => setActivityDate(day.dateString)}
            markedDates={{ [activityDate]: { selected: true } }}
            initialDate={tripDetails.starts_at.toString()}
            minDate={tripDetails.starts_at.toString()}
            maxDate={tripDetails.ends_at.toString()}
          />
          <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
            <Button.Title>
              Confirmar
            </Button.Title>
          </Button>
        </View>

      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentIntro: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    gap: 20,
  },

  titleIntro: {
    color: "white",
    fontSize: 26,
    fontWeight: "semibold",
  },

  containersInput: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },

  blockInput: {
    width: "50%",
    borderColor: "white",
  },

  modalActivity:{
    gap: 5,
    marginBottom: 10,
  },

  modalCalendar:{
    marginTop: 15,
    gap: 10,
  },

  sectionList: {
    gap: 8,
    width: "100%",
  },

  containerDays: {
    flexDirection: "row",
    alignItems: "center",
  },

  textDayNumber: {
    color: colors.zinc[100],
    fontSize: 22,
    fontWeight: "semibold",
    paddingVertical: 8,
  },

  textDayName: {
    color: colors.zinc[400],
    fontSize: 16,
    fontWeight: "regular",
    textTransform: "capitalize",
  },

  emptyAtivity: {
    color: colors.zinc[400],
    fontSize: 14,
    fontWeight: "regular",
    marginBottom: 10,
  }
})