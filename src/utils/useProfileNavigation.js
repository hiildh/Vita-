import { useNavigation } from 'expo-router';

const profileRoutes = { idoso: '(idoso)', familiar: '(familiar)', profissional: '(profissional)' };

// Reset only the root navigation stack; demonstration data remains in DemoProvider.
export function useProfileNavigation() {
  const navigation = useNavigation('/');
  const showProfileSelection = () => navigation.reset({ index: 0, routes: [{ name: 'selecionar-perfil' }] });
  const selectProfile = profile => {
    const name = profileRoutes[profile];
    if (name) navigation.reset({ index: 0, routes: [{ name }] });
  };
  return { showProfileSelection, selectProfile };
}
