import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../hooks/useOnboarding';

interface QRGenerationProps {
  onComplete: () => void;
}

interface Room {
  id: string;
  number: string;
  floor: string;
  type: string;
}

const QRGeneration = ({ onComplete }: QRGenerationProps) => {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [generatedQRs, setGeneratedQRs] = useState<string[]>([]);

  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      setRooms(JSON.parse(storedRooms));
    }
  }, []);

  const generateQRCode = (room: Room) => {
    const tipUrl = `https://tip.hotelapp.com/room/${room.id}`;
    return tipUrl;
  };

  const downloadQR = (roomId: string) => {
    setGeneratedQRs(prev => [...prev, roomId]);
  };

  const handleComplete = () => {
    if (generatedQRs.length === rooms.length) {
      completeOnboarding();
      navigate('/');
      onComplete();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Generate QR Codes</h2>
      <p className="text-gray-600 mb-8">
        Generate and download QR codes for each room. Place these in your rooms so guests can easily tip staff.
      </p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {rooms.map(room => {
          const tipUrl = generateQRCode(room);
          const isGenerated = generatedQRs.includes(room.id);

          return (
            <div
              key={room.id}
              className="bg-white border rounded-lg p-6 flex flex-col items-center"
            >
              <h3 className="text-lg font-medium mb-2">Room {room.number}</h3>
              <p className="text-sm text-gray-500 mb-4">Floor {room.floor}</p>
              
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <QRCodeSVG
                  value={tipUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <button
                onClick={() => downloadQR(room.id)}
                className={`w-full flex items-center justify-center py-2 px-4 rounded-lg ${
                  isGenerated
                    ? 'bg-green-50 text-green-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}
                disabled={isGenerated}
              >
                {isGenerated ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Downloaded
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download QR Code
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleComplete}
        disabled={generatedQRs.length !== rooms.length}
        className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors ${
          generatedQRs.length !== rooms.length ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Complete Setup
      </button>

      {generatedQRs.length !== rooms.length && (
        <p className="text-center text-gray-500 mt-4">
          Download all QR codes to continue
        </p>
      )}
    </div>
  );
};

export default QRGeneration;