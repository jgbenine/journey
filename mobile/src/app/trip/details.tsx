import { useState } from "react"
import { Button } from "@/components/Button"
import { Modal } from "@/components/modal"
import { colors } from "@/styles/colors"
import { Plus } from "lucide-react-native"
import { StyleSheet, Text, View } from "react-native"
import { Input } from "@/components/Input"

export default function Details({ tripId }: { tripId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false)


  async function handleCreateLinkTrip(){
    try {
      
    } catch (error) {
      console.log(error) 
    }finally{
      setIsCreatingLinkTrip(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleIntro}>Links Importantes</Text>

      <View style={styles.content}>
        <Button variant="secondary" onPress={() => setShowModal(true)}>
          <Plus color={colors.zinc[200]} />
          <Button.Title>
            Cadastrar novo link
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
              onChangeText={setLinkName}
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

  content: {
    width: '100%',
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 20,
  },

  titleIntro: {
    color: "white",
    fontSize: 26,
    fontWeight: "semibold",
    flex: 1,
    marginTop: 10,
  },

  contentModal: {
    gap: 8,
    marginBottom: 12,
  }




})