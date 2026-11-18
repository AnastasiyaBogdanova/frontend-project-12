// src/App.jsx
import { Grid } from '@mantine/core';
import { useEffect } from 'react';
import useUIStore from './store/StoreProvider';
import { useChannels } from './api/queries';
import ChannelList from './components/ChannelList';
import MessageList from './components/MessageList';
import MessageForm from './components/MessageForm';
import { useSocketMessages } from './hooks/useSocketMessages';
import CreateChannelModal from './components/modals/CreateChannelModal';
import RenameChannelModal from './components/modals/RenameChannelModal';
import DeleteChannelModal from './components/modals/DeleteChannelModal';

const App = ({ socket }) => {
  useSocketMessages(socket);

  const { data: channels } = useChannels();
  const currentChannelId = useUIStore((state) => state.currentChannelId);
  const setCurrentChannelId = useUIStore((state) => state.setCurrentChannelId);

  useEffect(() => {
    if (channels?.length && !currentChannelId) {
      const generalChannel = channels.find((ch) => ch.name === 'general');
      setCurrentChannelId(generalChannel ? generalChannel.id : channels[0].id);
    }
  }, [channels, currentChannelId, setCurrentChannelId]);

  return (
    <>
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <ChannelList />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <MessageList />
            <div style={{ marginTop: '1rem' }}>
              <MessageForm />
            </div>
          </div>
        </Grid.Col>
      </Grid>

      <CreateChannelModal />
      <RenameChannelModal />
      <DeleteChannelModal />
    </>
  );
};

export default App;