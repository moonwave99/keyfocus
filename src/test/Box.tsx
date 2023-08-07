import { useState, FC } from 'react';
import useKeyboard from '../index';

interface IBoxProps {
  id: string;
  autoFocus?: boolean;
}

const Box: FC<IBoxProps> = ({ id, autoFocus = false }) => {
  const [count, setCount] = useState(0);
  const { hasFocus } = useKeyboard({
    id: `box-${id}`,
    autoFocus,
    handlers: {
      ArrowUp: () => setCount(count + 1),
      ArrowDown: () => setCount(count - 1),
      'shift+ArrowRight': () => setCount(count + 1),
      'shift+ArrowLeft': () => setCount(count - 1),
      'ctrl+ArrowLeft': () => setCount(count - 1),
      'ctrl+c': () => void 0,
    },
  });

  return (
    <div className={hasFocus ? 'box focused' : 'box'} data-testid={id}>
      <h2>Box {id}</h2>
      <p>Value: {count}</p>
    </div>
  );
};

export default Box;
