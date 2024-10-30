import React, { useState } from 'react';
import { Plus, User, Trash2 } from 'lucide-react';

interface StaffSetupProps {
  onComplete: () => void;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

const StaffSetup = ({ onComplete }: StaffSetupProps) => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [currentStaff, setCurrentStaff] = useState({
    name: '',
    role: 'housekeeper',
    email: '',
    phone: ''
  });

  const addStaffMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff = {
      id: Date.now().toString(),
      ...currentStaff
    };
    setStaff([...staff, newStaff]);
    setCurrentStaff({ name: '', role: 'housekeeper', email: '', phone: '' });
  };

  const removeStaffMember = (id: string) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  const handleSubmit = () => {
    localStorage.setItem('staff', JSON.stringify(staff));
    onComplete();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Staff Setup</h2>
      <p className="text-gray-600 mb-8">
        Add your hotel staff members who will receive tips
      </p>

      <form onSubmit={addStaffMember} className="mb-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              value={currentStaff.name}
              onChange={(e) => setCurrentStaff({ ...currentStaff, name: e.target.value })}
              placeholder="Staff Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={currentStaff.role}
              onChange={(e) => setCurrentStaff({ ...currentStaff, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="housekeeper">Housekeeper</option>
              <option value="concierge">Concierge</option>
              <option value="bellhop">Bellhop</option>
              <option value="valet">Valet</option>
              <option value="roomservice">Room Service</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="email"
              value={currentStaff.email}
              onChange={(e) => setCurrentStaff({ ...currentStaff, email: e.target.value })}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="tel"
              value={currentStaff.phone}
              onChange={(e) => setCurrentStaff({ ...currentStaff, phone: e.target.value })}
              placeholder="Phone Number"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Staff Member
        </button>
      </form>

      <div className="space-y-4 mb-8">
        {staff.map(member => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-gray-500">
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)} • {member.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeStaffMember(member.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {staff.length > 0 ? (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      ) : (
        <div className="text-center text-gray-500">
          Add at least one staff member to continue
        </div>
      )}
    </div>
  );
};

export default StaffSetup;