import { useState } from 'react';
import useKeyboard, { KeyboardProvider } from './index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function Box({ id, autoFocus = false }: { id: string; autoFocus?: boolean }) {
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
}

describe('useKeyboard', () => {
  it('responds to key events if the element is focused', async () => {
    const user = userEvent.setup();
    render(<Box id="1" autoFocus />, { wrapper: KeyboardProvider });
    expect(document.querySelector('.box')?.classList).toContain('focused');
    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('Value: 1')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Value: 0')).toBeInTheDocument();
  });

  it('does not respond to key events if the element is not focused', async () => {
    const user = userEvent.setup();
    render(<Box id="1" />, { wrapper: KeyboardProvider });
    expect(document.querySelector('.box')?.classList).not.toContain('focused');
    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('Value: 0')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Value: 0')).toBeInTheDocument();
  });

  it('responds to key events if they include modifier keys', async () => {
    const user = userEvent.setup();
    render(<Box id="1" autoFocus />, { wrapper: KeyboardProvider });
    expect(document.querySelector('.box')?.classList).toContain('focused');
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
    expect(screen.getByText('Value: 1')).toBeInTheDocument();
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    expect(screen.getByText('Value: 0')).toBeInTheDocument();
  });

  it('responds to key events just for the focused element', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Box id="1" />
        <Box id="2" autoFocus />
      </>,
      { wrapper: KeyboardProvider }
    );
    const firstBox = screen.getByTestId('1');
    const secondBox = screen.getByTestId('2');
    expect(firstBox?.classList).not.toContain('focused');
    expect(secondBox?.classList).toContain('focused');

    await user.keyboard('{ArrowUp}');

    expect(firstBox.querySelector('p')?.innerHTML).toBe('Value: 0');
    expect(secondBox.querySelector('p')?.innerHTML).toBe('Value: 1');
  });
});