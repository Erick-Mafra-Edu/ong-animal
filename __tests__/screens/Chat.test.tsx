import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockGetUser = jest.fn();
const mockGetHistory = jest.fn().mockResolvedValue([]);
const mockConnect = jest.fn().mockResolvedValue(undefined);
const mockDisconnect = jest.fn();
const mockOnMessage = jest.fn();
const mockOffMessage = jest.fn();
const mockSendMessage = jest.fn().mockResolvedValue(undefined);

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({ push: mockPush, back: mockBack })),
  useLocalSearchParams: jest.fn(() => ({ matchId: 'match-abc' })),
}));

jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
    },
  },
}));

jest.mock('../../services/chat', () => ({
  createChatAdapter: jest.fn(() => ({
    getHistory: mockGetHistory,
    connect: mockConnect,
    disconnect: mockDisconnect,
    onMessage: mockOnMessage,
    offMessage: mockOffMessage,
    sendMessage: mockSendMessage,
  })),
}));

import ChatScreen from '../../app/chat/[matchId]';

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockGetHistory.mockResolvedValue([]);
    mockConnect.mockResolvedValue(undefined);
  });

  it('shows loading state initially', () => {
    mockGetUser.mockReturnValue(new Promise(() => {}));
    const { getByText } = render(<ChatScreen />);
    expect(getByText('Carregando conversa...')).toBeTruthy();
  });

  it('renders chat UI after loading', async () => {
    const { getByTestId } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByTestId('message-input')).toBeTruthy();
      expect(getByTestId('send-button')).toBeTruthy();
    });
  });

  it('renders back button', async () => {
    const { getByTestId } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByTestId('back-button')).toBeTruthy();
    });
  });

  it('navigates back when back button pressed', async () => {
    const { getByTestId } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByTestId('back-button')).toBeTruthy();
    });
    fireEvent.click(getByTestId('back-button'));
    expect(mockBack).toHaveBeenCalled();
  });

  it('renders messages from history', async () => {
    const mockMessages = [
      { id: 'msg-1', match_id: 'match-abc', sender_id: 'user-1', conteudo: 'Olá!', created_at: '2024-01-01T10:00:00Z' },
      { id: 'msg-2', match_id: 'match-abc', sender_id: 'user-2', conteudo: 'Oi!', created_at: '2024-01-01T10:01:00Z' },
    ];
    mockGetHistory.mockResolvedValue(mockMessages);

    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText('Olá!')).toBeTruthy();
      expect(getByText('Oi!')).toBeTruthy();
    });
  });

  it('shows empty state when no messages', async () => {
    mockGetHistory.mockResolvedValue([]);
    const { getByText } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByText(/Nenhuma mensagem ainda/)).toBeTruthy();
    });
  });

  it('sends a message when send button is clicked', async () => {
    const { getByTestId } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByTestId('message-input')).toBeTruthy();
    });

    fireEvent.change(getByTestId('message-input'), { target: { value: 'Olá!' } });
    fireEvent.click(getByTestId('send-button'));

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith('match-abc', 'user-1', 'Olá!');
    });
  });

  it('does not send empty message', async () => {
    const { getByTestId } = render(<ChatScreen />);
    await waitFor(() => {
      expect(getByTestId('send-button')).toBeTruthy();
    });

    fireEvent.click(getByTestId('send-button'));
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('calls connect with matchId on mount', async () => {
    render(<ChatScreen />);
    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalledWith('match-abc');
    });
  });
});
