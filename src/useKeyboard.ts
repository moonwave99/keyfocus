import { useContext, useEffect } from 'react';
import { KeyboardContext } from './KeyboardProvider';

type Modifier = 'ctrl' | 'meta' | 'shift' | 'alt';

const modifiers: Modifier[] = ['ctrl', 'meta', 'shift', 'alt'];

type Handler = (event: KeyboardEvent) => void;

type HandlerEntry = {
  name: string;
  handler: Handler;
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
};

function parseHandlers(handlers: Record<string, Handler>) {
  return Object.keys(handlers).map(key => {
    const output: HandlerEntry = {
      name: key,
      handler: handlers[key],
      key: '',
    };
    const tokens = key.split('+');
    tokens.forEach((token, index) => {
      if (index === tokens.length - 1) {
        output.key = token;
        return;
      }
      const lowerCaseToken = token.toLowerCase();
      modifiers.forEach((mod: Modifier) => {
        if (lowerCaseToken === mod) {
          output[mod] = true;
        }
      });
    });
    return output;
  });
}

interface IUserKeyboardProps {
  id: string;
  handlers: Record<string, Handler>;
  global?: boolean;
  autoFocus?: boolean;
}

interface IuseKeyboard {
  focus: () => void;
  hasFocus: boolean;
}

export default function useKeyboard({
  id,
  handlers,
  global,
  autoFocus,
}: IUserKeyboardProps): IuseKeyboard {
  const { focusedElementID, setFocusedElementID } = useContext(KeyboardContext);
  const hasFocus = global || focusedElementID === id;

  useEffect(() => {
    if (!autoFocus) {
      return;
    }
    focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!hasFocus) {
      return;
    }
    const parsed = parseHandlers(handlers);

    function onKeyDown(event: KeyboardEvent) {
      const matches = parsed.filter(x => x.key === event.code);
      if (!matches.length) {
        return;
      }
      for (const match of matches) {
        for (const mod of modifiers) {
          if (match[mod] && event[`${mod}Key`]) {
            match.handler(event);
          }
        }
        match.handler(event);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handlers, hasFocus]);

  function focus() {
    setFocusedElementID(id);
  }

  return { focus, hasFocus };
}
