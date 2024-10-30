import React, { useState, useEffect } from 'react';
import { DoorClosed, QrCode, Download, Printer, Search, Plus } from 'lucide-react';
import QRCode from 'qrcode.react';
import type { Room } from '../types';

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showQRPreview, setShowQRPreview] = useState(false);

  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateQRValue = (roomId: string) => {
    return `https://tip.hotelapp.com/room/${roomId}`;
  };

  const handlePrintQR = (room: Room) => {
    setSelectedRoom(room);
    setShowQRPreview(true);
  };

  const downloadQR = (room: Room) => {
    const canvas = document.getElementById(`qr-${room.id}`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `room-${room.number}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  const QRPreviewModal = () => {
    if (!selectedRoom) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Room {selectedRoom.number}</h2>
            <p className="text-gray-600">Floor {selectedRoom.floor}</p>
          </div>

          <div className="flex justify-center mb-6">
            <QRCode
              id={`qr-preview-${selectedRoom.id}`}
              value={generateQRValue(selectedRoom.id)}
              size={300}
              level="H"
              includeMargin={true}
            />
          </div>

          <p className="text-center text-gray-700 text-lg mb-8">
            If you are happy with the service and cleaning, please scan to tip
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowQRPreview(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rooms</h1>
          <p className="text-gray-500 mt-1">Manage rooms and QR codes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Add Room
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">All Rooms</h2>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rooms"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <div key={room.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <DoorClosed className="w-6 h-6 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-lg">Room {room.number}</h3>
                      <p className="text-gray-500">Floor {room.floor}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  <QRCode
                    id={`qr-${room.id}`}
                    value={generateQRValue(room.id)}
                    size={150}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrintQR(room)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <QrCode className="w-5 h-5" />
                    Print QR
                  </button>
                  <button
                    onClick={() => downloadQR(room)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showQRPreview && <QRPreviewModal />}

      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #qr-preview-${selectedRoom?.id}, #qr-preview-${selectedRoom?.id} ~ * {
              visibility: visible;
            }
            #qr-preview-${selectedRoom?.id} {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Rooms;