import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calendar = () => {
  const events = [
    { title: 'Team Meeting', date: '2024-03-15' },
    { title: 'Project Deadline', date: '2024-03-20' },
    { title: 'Client Presentation', date: '2024-03-25' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
          height="auto"
        />
      </div>
    </div>
  );
};

export default Calendar;