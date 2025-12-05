import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '@/utils/store';
import { User } from '@/types';
import { Credential } from '@/types/Credential';

export interface AppState {
  checked: boolean;
  loggedIn: boolean;
  user?: User;
  credentials: Credential[];
}

const initialState: AppState = {
  checked: false,
  loggedIn: false,
  user: undefined,
  credentials: [],
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoggedIn: (state: AppState, { payload }: PayloadAction<boolean>) => {
      state.checked = true;
      state.loggedIn = payload;
    },
    setUser: (state: AppState, { payload }: PayloadAction<User | undefined>) => {
      state.user = payload;
    },
    reset: () => initialState,
    setCredentials: (state: AppState, { payload }: PayloadAction<Credential[]>) => {
      state.credentials = payload;
    },
    addCredential: (state: AppState, { payload }: PayloadAction<Credential>) => {
      state.credentials.push(payload);
    },
    updateCredentialStatus: (
      state: AppState,
      { payload }: PayloadAction<{ id: string; status: Credential['status'] }>,
    ) => {
      const idx = state.credentials.findIndex(c => c.id === payload.id);
      if (idx >= 0) state.credentials[idx].status = payload.status;
    },
  },
});

export function useAppSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector(({ app }: State) => app);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
