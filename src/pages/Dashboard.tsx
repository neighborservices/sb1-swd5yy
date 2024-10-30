import React, { useState, useEffect } from 'react';
import { Users, Calendar, CreditCard, FileText, Search, MoreVertical, UserPlus, DoorClosed } from 'lucide-react';
import { format } from 'date-fns';
import { Staff } from '../types';

interface HotelDetails {
  hotelName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('Monthly');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null);
  const [assignedStaff, setAssignedStaff] = useState<Staff[]>([]);

  useEffect(() => {
    const storedHotelDetails = localStorage.getItem('hotelDetails');
    if (storedHotelDetails) {
      setHotelDetails(JSON.parse(storedHotelDetails));
    }

    const storedStaff = localStorage.getItem('staff');
    if (storedStaff) {
      setStaff(JSON.parse(storedStaff));
    }

    // Load room assignments
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      const rooms = JSON.parse(storedRooms);
      const allAssignedStaff = rooms.reduce((acc: Staff[], room: any) => {
        if (room.assignedStaff && Array.isArray(room.assignedStaff)) {
          return [...acc, ...room.assignedStaff];
        }
        return acc;
      }, []);
      
      // Remove duplicates based on staff ID
      const uniqueStaff = Array.from(new Set(allAssignedStaff.map(s => s.id)))
        .map(id => allAssignedStaff.find(s => s.id === id));
      
      setAssignedStaff(uniqueStaff as Staff[]);
    }
  }, []);

  const quickActions = [
    { icon: Users, label: 'Staff Assignment', color: 'bg-[#0B4619]' },
    { icon: Calendar, label: 'Daily Assignment', color: 'bg-[#B4F481]' },
    { icon: DoorClosed, label: 'Manage Rooms', color: 'bg-[#B4F481]' },
    { icon: CreditCard, label: 'Account / Cards', color: 'bg-[#B4F481]' },
    { icon: FileText, label: 'Reports', color: 'bg-[#B4F481]' },
  ];

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="bg-[#B4F481] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <UserPlus className="w-8 h-8 text-[#0B4619]" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Staff Assigned</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Start by assigning staff members to rooms to manage their assignments and track tips.
      </p>
      <button className="bg-[#0B4619] text-white px-6 py-2 rounded-lg hover:bg-[#0B4619]/90 transition-colors">
        Assign Staff
      </button>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome to {hotelDetails?.hotelName || 'Your Hotel'}
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening at your hotel today</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#B4F481] rounded-full p-2">
            <Calendar className="w-5 h-5 text-[#0B4619]" />
          </div>
          <span className="text-gray-600">{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">{hotelDetails?.email}</span>
            <span className="text-sm text-gray-500">{hotelDetails?.phone}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} ${index === 0 ? 'text-white' : 'text-[#0B4619]'} p-4 rounded-lg flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}
          >
            <action.icon className="w-6 h-6" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Staff Assignments</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff"
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {assignedStaff.length === 0 ? (
            <EmptyState />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="pb-4">Staff</th>
                  <th className="pb-4">Room #</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Shift</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedStaff.map((member) => (
                  <tr key={member.id} className="border-t">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>Assigned</td>
                    <td>{format(new Date(), 'MMM dd, yyyy')}</td>
                    <td>Morning</td>
                    <td>
                      <span className="px-3 py-1 rounded-full text-sm bg-[#B4F481] text-[#0B4619]">
                        Active
                      </span>
                    </td>
                    <td>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;