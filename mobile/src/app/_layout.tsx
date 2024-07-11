import { colors } from '@/styles/colors';
import { Slot } from 'expo-router';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useFonts, Inter_500Medium, Inter_400Regular, Inter_600SemiBold } from "@expo-google-fonts/inter"
import { Loading } from '@/components/Loading';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold
  })

  if(!fontsLoaded) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Slot />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.zinc[950], color: colors.zinc[100] },
})