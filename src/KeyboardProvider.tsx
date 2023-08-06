import { useState, createContext, ReactNode, ReactElement } from 'react';

type KeyboardContextValue = {
  focusedElementID: string;
  setFocusedElementID: (id: string) => void;
};

export const KeyboardContext = createContext<KeyboardContextValue>({
  focusedElementID: '',
  setFocusedElementID: () => void 0,
});

interface IKeyboardProviderProps {
  children: ReactNode;
}

export default function KeyboardProvider({
  children,
}: IKeyboardProviderProps): ReactElement {
  const [focusedElementID, setFocusedElementID] = useState('');

  return (
    <KeyboardContext.Provider value={{ focusedElementID, setFocusedElementID }}>
      {children}
    </KeyboardContext.Provider>
  );
}
