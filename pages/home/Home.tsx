import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import useColorScheme from '@/hooks/useColorScheme';
import Button from '@/components/elements/Button';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import React, { useCallback } from 'react';
import { Credential } from '@/types/Credential';
import { useAppSlice } from '@/slices';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
    height: 44,
    width: '50%',
  },
});

export function Home() {
  const router = useRouter();
  const { isDark } = useColorScheme();

  const { credentials } = useAppSlice();

  const renderItem = useCallback(
    (item: Credential) => {
      return (
        <TouchableOpacity onPress={() => {
        }}>
          <View>
            <Text style={{ color: isDark ? colors.gray : colors.black }}>{item.docType}</Text>
            <Text style={{ color: isDark ? colors.gray : colors.black }}>{item.name}</Text>
            <Text style={{ color: isDark ? colors.gray : colors.black }}>{item.status}</Text>
            <Text style={{ color: isDark ? colors.gray : colors.black }}>{item.expiryDate}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [isDark],
  );

  return (
    <View style={[styles.root, isDark && { backgroundColor: colors.blackGray }]}>
      <Text style={[styles.title, isDark && { color: colors.gray }]}>Home</Text>
      <FlatList data={credentials} renderItem={renderItem} keyExtractor={item => item.id} />
      <Button
        title="Go to Details"
        titleStyle={[styles.buttonTitle, isDark && { color: colors.blackGray }]}
        style={styles.button}
        onPress={() =>
          router.push({ pathname: '(main)/(tabs)/home/details', params: { from: 'Home' } })
        }
      />
    </View>
  );
}
