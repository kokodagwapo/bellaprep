import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'call' | 'deadline' | 'reminder';
  attendees?: string[];
}

const mockEvents: CalendarEvent[] = [
  { id: '1', title: 'Borrower Consultation - John Smith', date: '2024-02-15', time: '10:00 AM', type: 'meeting', attendees: ['john.smith@email.com'] },
  { id: '2', title: 'Document Review Call', date: '2024-02-15', time: '2:00 PM', type: 'call', attendees: ['jane.doe@email.com'] },
  { id: '3', title: 'Loan Submission Deadline', date: '2024-02-16', time: '5:00 PM', type: 'deadline' },
  { id: '4', title: 'Follow-up: Rate Lock', date: '2024-02-17', time: '9:00 AM', type: 'reminder' },
  { id: '5', title: 'Team Sync', date: '2024-02-17', time: '11:00 AM', type: 'meeting', attendees: ['team@lender.com'] },
];

const CalendarModule: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<string>('2024-02-15');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'meeting' as CalendarEvent['type'] });

  const typeColors: Record<string, string> = { meeting: 'bg-blue-100 text-blue-700 border-blue-200', call: 'bg-green-100 text-green-700 border-green-200', deadline: 'bg-red-100 text-red-700 border-red-200', reminder: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  const typeIcons: Record<string, string> = { meeting: '👥', call: '📞', deadline: '⏰', reminder: '🔔' };

  const createEvent = () => {
    const event: CalendarEvent = { id: Date.now().toString(), ...newEvent };
    setEvents([...events, event]);
    setShowCreateModal(false);
    setNewEvent({ title: '', date: '', time: '', type: 'meeting' });
  };

  const days = Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    const date = '2024-02-' + day.toString().padStart(2, '0');
    return { day, date, hasEvents: events.some(e => e.date === date) };
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
          <p className="mt-1 text-gray-500">Manage appointments and deadlines.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ New Event</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">February 2024</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">←</button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">→</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
            ))}
            {[null, null, null, null].map((_, i) => <div key={'empty-' + i} />)}
            {days.map(({ day, date, hasEvents }) => (
              <button key={day} onClick={() => setSelectedDate(date)}
                className={`p-2 text-center rounded-lg relative ${selectedDate === date ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                {day}
                {hasEvents && <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${selectedDate === date ? 'bg-white' : 'bg-blue-500'}`} />}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Events for {selectedDate}</h2>
          <div className="space-y-3">
            {events.filter(e => e.date === selectedDate).length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No events scheduled</p>
            ) : (
              events.filter(e => e.date === selectedDate).map(event => (
                <div key={event.id} className={`p-3 rounded-xl border ${typeColors[event.type]}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{typeIcons[event.type]}</span>
                    <span className="font-medium text-sm">{event.title}</span>
                  </div>
                  <p className="text-xs opacity-75">{event.time}</p>
                  {event.attendees && <p className="text-xs opacity-75 mt-1">{event.attendees.join(', ')}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h2>
        <div className="space-y-2">
          {events.slice(0, 5).map(event => (
            <div key={event.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">{typeIcons[event.type]}</span>
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${typeColors[event.type]}`}>{event.type}</span>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Event</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent['type'] })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="meeting">Meeting</option>
                  <option value="call">Call</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
                <button onClick={createEvent} disabled={!newEvent.title || !newEvent.date} className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModule;
