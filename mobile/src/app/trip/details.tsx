import { useState } from "react"
import { Button } from "@/components/Button"
import { Modal } from "@/components/modal"
import { colors } from "@/styles/colors"
import { Plus } from "lucide-react-native"
import { Alert, StyleSheet, Text, View } from "react-native"
import { Input } from "@/components/Input"
import { validateInput } from "@/utils/validateInput"
import { linksServer } from "@/server/links-server"

export default function Details({ tripId }: { tripId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false)


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
      resetNewLinkFields()
    } catch (error) {
      console.log(error)
    } finally {
      setIsCreatingLinkTrip(false);
    }
  }

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
})