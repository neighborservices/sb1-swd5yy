import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Users, DoorClosed, Building2 } from 'lucide-react';
import type { Staff, Room } from '../types';

type ReportType = 'general' | 'custom';
type ReportFilter = {
  staff: string[];
  date: string;
  rooms: string[];
  floors: string[];
};

const Reports = () => {
  const [reportType, setReportType] = useState<ReportType>('general');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filters, setFilters] = useState<ReportFilter>({
    staff: [],
    date: '',
    rooms: [],
    floors: [],
  });

  useEffect(() => {
    // Load staff and rooms from localStorage
    const storedStaff = localStorage.getItem('staff');
    const storedRooms = localStorage.getItem('rooms');
    
    if (storedStaff) setStaff(JSON.parse(storedStaff));
    if (storedRooms) setRooms(JSON.parse(storedRooms));
  }, []);

  const uniqueFloors = Array.from(new Set(rooms.map(room => room.floor))).sort();

  const handleStaffSelect = (staffId: string) => {
    setFilters(prev => ({
      ...prev,
      staff: prev.staff.includes(staffId)
        ? prev.staff.filter(id => id !== staffId)
        : [...prev.staff, staffId]
    }));
  };

  const handleRoomSelect = (roomId: string) => {
    setFilters(prev => ({
      ...prev,
      rooms: prev.rooms.includes(roomId)
        ? prev.rooms.filter(id => id !== roomId)
        : [...prev.rooms, roomId]
    }));
  };

  const handleFloorSelect = (floor: string) => {
    setFilters(prev => ({
      ...prev,
      floors: prev.floors.includes(floor)
        ? prev.floors.filter(f => f !== floor)
        : [...prev.floors, floor]
    }));
  };

  const generateReport = () => {
    // In a real application, this would generate and download a report
    // For now, we'll just show an alert
    alert('Report generation started. Your report will be downloaded shortly.');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Generate and download reports</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6">Report Options</h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setReportType('general')}
            className={`p-6 rounded-lg border-2 transition-colors ${
              reportType === 'general'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className={`w-6 h-6 ${
                reportType === 'general' ? 'text-green-500' : 'text-gray-400'
              }`} />
              <h3 className="text-lg font-medium">General Report</h3>
            </div>
            <p className="text-gray-600 text-left">
              Overview of all staff assignments and tips for the selected period
            </p>
          </button>

          <button
            onClick={() => setReportType('custom')}
            className={`p-6 rounded-lg border-2 transition-colors ${
              reportType === 'custom'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className={`w-6 h-6 ${
                reportType === 'custom' ? 'text-green-500' : 'text-gray-400'
              }`} />
              <h3 className="text-lg font-medium">Custom Report</h3>
            </div>
            <p className="text-gray-600 text-left">
              Create a customized report with specific filters and parameters
            </p>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Staff
            </label>
            <div className="grid grid-cols-3 gap-3">
              {staff.map(member => (
                <label
                  key={member.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                    filters.staff.includes(member.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.staff.includes(member.id)}
                    onChange={() => handleStaffSelect(member.id)}
                    className="hidden"
                  />
                  <Users className={`w-5 h-5 ${
                    filters.staff.includes(member.id) ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <span>{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Numbers
              </label>
              <select
                multiple
                value={filters.rooms}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters(prev => ({ ...prev, rooms: values }));
                }}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    Room {room.number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floors
              </label>
              <select
                multiple
                value={filters.floors}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters(prev => ({ ...prev, floors: values }));
                }}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {uniqueFloors.map(floor => (
                  <option key={floor} value={floor}>
                    Floor {floor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={generateReport}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;