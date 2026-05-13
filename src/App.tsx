import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, Header } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { EventList } from './pages/EventList';
import { CreateEventWizard } from './pages/CreateEventWizard';
import { EventDetail } from './pages/EventDetail';
import { CustomerList } from './pages/CustomerList';
import { Event as AppEvent } from './types';

export default function App() {
  const [activePage, setActivePage] = useState('events');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);

  const handleViewEvent = (id: string) => {
    setSelectedEventId(id);
    setActivePage('event-detail');
  };

  const handleEditEvent = (event: AppEvent) => {
    setEditingEvent(event);
    setActivePage('edit-event');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <EventList onNavigate={setActivePage} onViewEvent={handleViewEvent} onEditEvent={handleEditEvent} />;
      case 'customers':
        return <CustomerList />;
      case 'event-detail':
        return selectedEventId ? (
          <EventDetail eventId={selectedEventId} onBack={() => setActivePage('events')} />
        ) : <Dashboard />;
      case 'create-event':
        return <CreateEventWizard onComplete={() => setActivePage('events')} />;
      case 'edit-event':
        return editingEvent ? (
          <CreateEventWizard 
            initialEvent={editingEvent} 
            onComplete={() => {
              setEditingEvent(null);
              setActivePage('events');
            }} 
          />
        ) : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-gray">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen overflow-x-hidden">
        <Header />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-[1440px] mx-auto"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

