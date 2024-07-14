import { Alert, FlatList, StyleSheet, Text, View } from "react-native"
import { useEffect, useState } from "react"
import { Button } from "@/components/Button"
import { Modal } from "@/components/modal"
import { colors } from "@/styles/colors"
import { Plus } from "lucide-react-native"
import { Input } from "@/components/Input"
import { validateInput } from "@/utils/validateInput"
import { linksServer } from "@/server/links-server"
import { TripLink, TripLinkProps } from "@/components/tripLink"
import { participantsServer } from "@/server/participants-server"
import { Participant, ParticipantProps } from "@/components/participant"

export default function Details({ tripId }: { tripId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false)

  const [links, setLinks] = useState<TripLinkProps[]>([])
  const [participants, setParticipants] = useState<ParticipantProps[]>([])


  function resetNewLinkFields() {
    setLinkTitle("");
    setLinkURL("");
    setShowModal(false);
  }


  async function handleCreateLinkTrip() {
    try {

      if (!linkTitle.trim()) {
        return Alert.alert("Link", "Nome do link é inválido!")
      }
      if (!validateInput.url(linkURL.trim())) {
        return Alert.alert("Link", "Link inválido")
      }

      setIsCreatingLinkTrip(true)
      await linksServer.create({
        tripId,
        title: linkTitle,
        url: linkURL
      })

      Alert.alert("Link", "Link cadastraddo com sucesso!")
      resetNewLinkFields();
      await getTripLinks();
    } catch (error) {
      console.log(error)
    } finally {
      setIsCreatingLinkTrip(false);
    }
  }

  async function getTripLinks() {
    try {
      const links = await linksServer.getLinksByTripId(tripId)
      setLinks(links)
    } catch (error) {
      console.log(error)
    }
  }

  async function getTripParticipants() {
    try {
      const participants = await participantsServer.getByTripId(tripId)
      setParticipants(participants)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getTripLinks();
    getTripParticipants();
  }, [])

  return (
    <View style={styles.container}>

      <View style={styles.contentIntro}>
        <Text style={styles.titleIntro}>Links Importantes</Text>
        <Button variant="secondary" onPress={() => setShowModal(true)}>
          <Plus color={colors.zinc[200]} />
          <Button.Title>
            Novo link
          </Button.Title>
        </Button>
      </View>

      <View style={styles.linksList}>
        {links.length > 0 ? (
          <FlatList
            data={links}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripLink data={item} />}
            contentContainerStyle={{ gap: 4 }}
          />
        ) : (
          <Text style={styles.noLinksText}>Nenhum link cadastrado</Text>
        )}
      </View>

      <View style={styles.guests}>
        <Text style={styles.titleIntro}>Convidados</Text>
        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Participant data={item} />}
          contentContainerStyle={{ gap: 4, marginTop: 10, paddingBottom: 4 }}
        />
      </View>

      <Modal
        title="Cadastrar Link"
        subtitle="Todos convidados podem visualizar os links."
        visible={showModal}
        onClose={() => setShowModal(false)}>

        <View style={styles.contentModal}>
          <Input variants="secondary">
            <Input.Field
              placeholder="Titulo do link"
              onChangeText={setLinkTitle}
            />
          </Input>
          <Input variants="secondary">
            <Input.Field
              placeholder="Url do link"
              onChangeText={setLinkURL}
            />
          </Input>
        </View>

        <Button isLoading={isCreatingLinkTrip} onPress={handleCreateLinkTrip}>
          <Button.Title>
            Salvar link
          </Button.Title>
        </Button>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  titleIntro: {
    color: "white",
    fontSize: 26,
    fontWeight: "semibold",
  },

  contentIntro: {
    marginTop: 20,
    flexDirection: "row",
    gap: 20,
  },

  contentModal: {
    marginBottom: 12,
  },

  linksList: {
    marginTop: 20,
  },

  noLinksText: {
    color: colors.zinc[500],
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
  },

  guests: {
    flex: 1,
    borderTopWidth: 2,
    borderColor: colors.zinc[800],
    marginTop: 40,
    paddingTop: 10,
  }


})