import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Users, Calendar, Search, QrCode, X } from 'lucide-react';
import QRCode from 'qrcode.react';
import TipPayment from '../pages/TipPayment';
import type { Staff, Room } from '../types';

const StaffAssignment = () => {
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showQRPreview, setShowQRPreview] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showPaymentPreview, setShowPaymentPreview] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedStaff = localStorage.getItem('staff');
    const storedRooms = localStorage.getItem('rooms');
    
    if (storedStaff) {
      const parsedStaff = JSON.parse(storedStaff);
      setStaff(Array.isArray(parsedStaff) ? parsedStaff : []);
    }
    
    if (storedRooms) {
      const parsedRooms = JSON.parse(storedRooms);
      const roomsWithAssignedStaff = (Array.isArray(parsedRooms) ? parsedRooms : []).map(room => ({
        ...room,
        assignedStaff: Array.isArray(room.assignedStaff) ? room.assignedStaff : []
      }));
      setRooms(roomsWithAssignedStaff);
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaff(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleAssign = () => {
    if (selectedStaff.length === 0 || selectedRooms.length === 0) {
      alert('Please select both staff and rooms to assign');
      return;
    }

    const updatedRooms = rooms.map(room => {
      if (selectedRooms.includes(room.id)) {
        const selectedStaffMembers = staff.filter(s => selectedStaff.includes(s.id));
        return {
          ...room,
          assignedStaff: selectedStaffMembers
        };
      }
      return room;
    });

    localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    setRooms(updatedRooms);
    setSelectedStaff([]);
    setSelectedRooms([]);
  };

  const handleShowQR = (room: Room) => {
    setSelectedRoom(room);
    setShowQRPreview(true);
  };

  const QRPreviewModal = () => {
    if (!selectedRoom) return null;

    const tipUrl = `${window.location.origin}/tip/${selectedRoom.id}`;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setShowQRPreview(false);
                setShowPaymentPreview(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!showPaymentPreview ? (
            <>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">Room {selectedRoom.number}</h2>
                <p className="text-gray-600">Floor {selectedRoom.floor}</p>
              </div>

              <div className="flex justify-center mb-6">
                <QRCode
                  value={tipUrl}
                  size={300}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <p className="text-center text-gray-700 text-lg mb-8">
                Scan to tip the staff assigned to this room
              </p>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowPaymentPreview(true)}
                  className="px-6 py-3 bg-[#0B4619] text-white rounded-lg hover:bg-[#0B4619]/90"
                >
                  Preview Payment Page
                </button>
              </div>
            </>
          ) : (
            <div className="max-h-[80vh] overflow-y-auto">
              <TipPayment roomId={selectedRoom.id} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Assignment</h1>
          <p className="text-gray-500 mt-1">Assign staff members to rooms</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#B4F481] rounded-full p-2">
            <Calendar className="w-5 h-5 text-[#0B4619]" />
          </div>
          <span className="text-gray-600">{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Select Staff</h2>
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
          </div>

          <div className="space-y-2">
            {filteredStaff.map(member => (
              <div
                key={member.id}
                onClick={() => handleStaffSelect(member.id)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedStaff.includes(member.id)
                    ? 'bg-[#B4F481] border-2 border-[#0B4619]'
                    : 'bg-white border border-gray-200 hover:border-[#0B4619]'
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select Rooms</h2>
          <div className="space-y-2">
            {rooms.map(room => (
              <div
                key={room.id}
                onClick={() => handleRoomSelect(room.id)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedRooms.includes(room.id)
                    ? 'bg-[#B4F481] border-2 border-[#0B4619]'
                    : 'bg-white border border-gray-200 hover:border-[#0B4619]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Room {room.number}</h3>
                    <p className="text-sm text-gray-500">Floor {room.floor}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {room.assignedStaff && room.assignedStaff.length > 0 && (
                      <div className="flex -space-x-2">
                        {room.assignedStaff.map((staff, index) => (
                          <div
                            key={staff.id}
                            className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                            style={{ zIndex: room.assignedStaff.length - index }}
                          >
                            {staff.image ? (
                              <img
                                src={staff.image}
                                alt={staff.name}
                                className="w-full h-full rounded-full"
                              />
                            ) : (
                              <span className="text-xs font-medium text-gray-600">
                                {staff.name.charAt(0)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowQR(room);
                      }}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      <QrCode className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleAssign}
          disabled={selectedStaff.length === 0 || selectedRooms.length === 0}
          className={`px-6 py-3 rounded-lg font-medium ${
            selectedStaff.length === 0 || selectedRooms.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#0B4619] text-white hover:bg-[#0B4619]/90'
          }`}
        >
          Assign Staff to Rooms
        </button>
      </div>

      {showQRPreview && <QRPreviewModal />}
    </div>
  );
};

export default StaffAssignment;