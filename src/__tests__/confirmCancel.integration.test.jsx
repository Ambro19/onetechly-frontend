// frontend/src/__tests__/confirmCancel.integration.test.jsx
/**
 * @jest-environment jsdom
 * why: ensure DOM APIs; CRA usually sets jsdom, this keeps it explicit
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmModal from '../components/ConfirmModal';

describe('ConfirmModal cancel subscription flow', () => {
  beforeEach(() => {
    // why: block real network; assert single call when confirmed
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'scheduled_cancellation',
            at_period_end: true,
          }),
      })
    );
  });
  afterEach(() => jest.resetAllMocks());

  function UnderTest() {
    const [open, setOpen] = React.useState(true);
    const onConfirm = async () => {
      await fetch('/subscription/cancel', { method: 'POST' });
      setOpen(false);
    };
    return (
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        title="Cancel Your Subscription"
        bullets={[
          'No further charges after the current period.',
          'Access remains active until period end.',
        ]}
        expectedText="CANCEL MY SUBSCRIPTION"
        confirmLabel="Cancel Subscription"
        cancelLabel="Keep Subscription"
        accent="amber"
      />
    );
  }

  it('blocks confirm until exact phrase is typed and calls API once', async () => {
    const user = userEvent.setup();
    render(<UnderTest />);

    const confirmBtn = screen.getByRole('button', { name: /cancel subscription/i });
    expect(confirmBtn).toBeDisabled();

    const input = screen.getByRole('textbox');
    await user.type(input, 'cancel my subscription'); // wrong case -> still disabled
    expect(confirmBtn).toBeDisabled();

    await user.clear(input);
    await user.type(input, 'CANCEL MY SUBSCRIPTION'); // exact -> enabled
    expect(confirmBtn).toBeEnabled();

    await user.click(confirmBtn);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/subscription/cancel', { method: 'POST' });
  });
});
