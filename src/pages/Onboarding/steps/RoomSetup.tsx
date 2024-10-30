import React, { useState } from 'react';
import { Plus, DoorClosed, Trash2 } from 'lucide-react';

interface RoomSetupProps {
  onComplete: () => void;
}

interface Room {
  id: string;
  number: string;
  floor: string;
  type: string;
}

const RoomSetup = ({ onComplete }: RoomSetupProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState({
    number: '',
    floor: '',
    type: 'standard'
  });

  const addRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom = {
      id: Date.now().toString(),
      ...currentRoom
    };
    setRooms([...rooms, newRoom]);
    setCurrentRoom({ number: '', floor: '', type: 'standard' });
  };

  const removeRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const handleSubmit = () => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
    onComplete();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Room Setup</h2>
      <p className="text-gray-600 mb-8">
        Add the rooms in your hotel that will participate in the tipping system
      </p>

      <form onSubmit={addRoom} className="mb-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <input
              type="text"
              value={currentRoom.number}
              onChange={(e) => setCurrentRoom({ ...currentRoom, number: e.target.value })}
              placeholder="Room Number"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="col-span-1">
            <input
              type="text"
              value={currentRoom.floor}
              onChange={(e) => setCurrentRoom({ ...currentRoom, floor: e.target.value })}
              placeholder="Floor"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="col-span-1">
            <select
              value={currentRoom.type}
              onChange={(e) => setCurrentRoom({ ...currentRoom, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="suite">Suite</option>
              <option value="deluxe">Deluxe</option>
            </select>
          </div>
          <div className="col-span-1">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Room
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4 mb-8">
        {rooms.map(room => (
          <div
            key={room.id}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex items-center">
              <DoorClosed className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <h3 className="font-medium">Room {room.number}</h3>
                <p className="text-sm text-gray-500">Floor {room.floor} • {room.type}</p>
              </div>
            </div>
            <button
              onClick={() => removeRoom(room.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {rooms.length > 0 ? (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      ) : (
        <div className="text-center text-gray-500">
          Add at least one room to continue
        </div>
      )}
    </div>
  );
};

export default RoomSetup;