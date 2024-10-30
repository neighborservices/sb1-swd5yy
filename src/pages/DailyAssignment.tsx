import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Search, Users, PenSquare } from 'lucide-react';
import type { Staff, Room } from '../types';

interface Assignment {
  staffId: string;
  roomId: string;
  date: string;
  shift: 'Morning' | 'Evening';
  timestamp: string;
}

const DailyAssignment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedShift, setSelectedShift] = useState('All Shifts');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedStaff = localStorage.getItem('staff');
    const storedRooms = localStorage.getItem('rooms');
    const storedAssignments = localStorage.getItem('assignments');

    if (storedStaff) setStaff(JSON.parse(storedStaff));
    if (storedRooms) setRooms(JSON.parse(storedRooms));
    if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    const staffMember = staff.find(s => s.id === assignment.staffId);
    if (!staffMember) return false;

    const matchesSearch = staffMember.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = assignment.date === selectedDate;
    const matchesShift = selectedShift === 'All Shifts' || assignment.shift === selectedShift;

    return matchesSearch && matchesDate && matchesShift;
  });

  const getStaffMember = (staffId: string) => staff.find(s => s.id === staffId);
  const getRoom = (roomId: string) => rooms.find(r => r.id === roomId);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Daily Assignments</h1>
          <p className="text-gray-500 mt-1">View and manage staff assignments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-green-50 rounded-full p-2">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-gray-600">{format(new Date(selectedDate), 'EEEE, dd MMM yyyy')}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Assignments</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-lg px-4 py-2"
              />
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option>All Shifts</option>
                <option>Morning</option>
                <option>Evening</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Found</h3>
              <p className="text-gray-500 mb-6">
                There are no assignments for the selected date and shift.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="pb-4 pl-4">Staff</th>
                    <th className="pb-4">Room #</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Time</th>
                    <th className="pb-4">Shift</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((assignment, index) => {
                    const staffMember = getStaffMember(assignment.staffId);
                    const room = getRoom(assignment.roomId);
                    if (!staffMember || !room) return null;

                    return (
                      <tr key={index} className="border-t">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            {staffMember.image ? (
                              <img
                                src={staffMember.image}
                                alt={staffMember.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{staffMember.name}</div>
                              <div className="text-sm text-gray-500">{staffMember.role}</div>
                            </div>
                          </div>
                        </td>
                        <td>Room {room.number}</td>
                        <td>{format(new Date(assignment.date), 'MMM dd, yyyy')}</td>
                        <td>{assignment.timestamp}</td>
                        <td>{assignment.shift}</td>
                        <td>
                          <button className="text-blue-600 hover:text-blue-700">
                            <PenSquare className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyAssignment;