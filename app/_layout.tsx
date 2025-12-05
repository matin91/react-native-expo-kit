import { Fragment } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import BottomSheetContents from '@/components/layouts/BottomSheetContents';
import BottomSheet from '@/components/elements/BottomSheet';
import { useDataPersist, DataPersistKeys } from '@/hooks';
import useColorScheme from '@/hooks/useColorScheme';
import { loadImages, loadFonts } from '@/theme';
import { Slot, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAppSlice } from '@/slices';
import { fetchUser } from '@/services';
import Provider from '@/providers';
import { colors } from '@/theme';
import { User } from '@/types';
import { Credential } from '@/types/Credential';

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

function Router() {
  const router = useRouter();
  const { isDark } = useColorScheme();
  const { dispatch, setUser, setLoggedIn, setCredentials } = useAppSlice();
  const { setPersistData, getPersistData } = useDataPersist();
  const [isOpen, setOpen] = useState(false);

  /**
   * preload assets and user info
   */
  useEffect(() => {
    async function preload() {
      try {
        // preload assets
        await Promise.all([loadImages(), loadFonts()]);

        // fetch & store user data to store (fake promise function to simulate async function)
        const user = await fetchUser();
        dispatch(setUser(user));
        dispatch(setLoggedIn(!!user));
        if (user) setPersistData<User>(DataPersistKeys.USER, user);

        // Mock credentials and store in redux so Home screen can display them
        const mockCredentials: Credential[] = [
          {
            id: 'cred-1',
            name: 'Driver License',
            docType: 'DriverLicense',
            docNumber: 'D1234567',
            status: 'verified',
            expiryDate: '2026-08-01',
            createdDate: '2021-08-01',
          },
          {
            id: 'cred-2',
            name: 'Passport',
            docType: 'Passport',
            docNumber: 'P9876543',
            status: 'Pending',
            expiryDate: '2030-01-01',
            createdDate: '2020-01-01',
          },
        ];
        dispatch(setCredentials(mockCredentials));

        // hide splash screen
        SplashScreen.hideAsync();
        setOpen(true);
      } catch {
        // if preload failed, try to get user data from persistent storage
        getPersistData<User>(DataPersistKeys.USER)
          .then(user => {
            if (user) dispatch(setUser(user));
            dispatch(setLoggedIn(!!user));
          })
          .finally(() => {
            // hide splash screen
            SplashScreen.hideAsync();

            // show bottom sheet
            setOpen(true);
          });
      }
    }
    preload();
  }, [dispatch, getPersistData, setLoggedIn, setPersistData, setUser, setCredentials]);

  // navigate to app
  useEffect(() => {
    router.push('/(main)/home');
  }, [router]);

  return (
    <Fragment>
      <Slot />
      <StatusBar style="light" />
      <BottomSheet
        isOpen={isOpen}
        initialOpen
        backgroundStyle={isDark && { backgroundColor: colors.blackGray }}>
        <BottomSheetContents onClose={() => setOpen(false)} />
      </BottomSheet>
    </Fragment>
  );
}

export default function RootLayout() {
  return (
    <Provider>
      <Router />
    </Provider>
  );
}
