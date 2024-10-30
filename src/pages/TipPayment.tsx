import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';
import type { Room, Staff } from '../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PRESET_AMOUNTS = [10, 20, 30];
const EMOJIS = ['😊', '🙂', '😃', '😍'];

export default function TipPayment() {
  const { roomId } = useParams();
  const [amount, setAmount] = useState('50');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [hotelDetails, setHotelDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const storedRooms = localStorage.getItem('rooms');
    const storedHotelDetails = localStorage.getItem('hotelDetails');

    if (storedRooms && roomId) {
      const rooms = JSON.parse(storedRooms);
      const currentRoom = rooms.find((r: Room) => r.id === roomId);
      setRoom(currentRoom);
      if (currentRoom?.assignedStaff) {
        setStaff(currentRoom.assignedStaff);
      }
    }

    if (storedHotelDetails) {
      setHotelDetails(JSON.parse(storedHotelDetails));
    }
  }, [roomId]);

  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    setIsProcessing(false);
    setPaymentError('');
    // Show success message and redirect
    alert('Payment successful! Thank you for your tip.');
    window.location.href = '/payment-success';
  };

  const handlePaymentError = (error: string) => {
    setIsProcessing(false);
    setPaymentError(error);
  };

  if (!room || !hotelDetails) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="text-[#0B4619] text-2xl">
          {/* Placeholder for logo - will be replaced with actual SVG */}
          <div className="h-8 w-24 bg-[#0B4619] rounded"></div>
        </div>
        <div>
          <h1 className="font-medium text-lg">{hotelDetails.hotelName}</h1>
          <p className="text-sm text-gray-600">
            {hotelDetails.address}, {hotelDetails.city} {hotelDetails.state}
          </p>
          <p className="text-sm text-gray-500">ORG ID: {roomId?.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      {/* Staff Info */}
      <div className="text-center mb-8">
        <h2 className="text-xl mb-2">Tip a Hotel Staff</h2>
        {staff.map((member) => (
          <p key={member.id} className="text-gray-600">
            {member.name} was your hotel Staff today
          </p>
        ))}
      </div>

      {!showPaymentForm ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Amount Input */}
          <div>
            <label className="block text-lg mb-4">Amount to Tip</label>
            <div className="relative mb-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-3xl p-4 bg-gray-50 rounded-lg border-none"
                placeholder="50"
                min="1"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl">$</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetAmount(preset)}
                  className={`p-3 rounded-lg text-lg font-medium ${
                    amount === preset.toString()
                      ? 'bg-[#00B227] text-white'
                      : 'bg-[#E8F5E9] text-[#00B227]'
                  }`}
                >
                  {preset}$
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-lg mb-4">Rate Service</label>
            <div className="flex gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`p-4 rounded-lg text-2xl ${
                    selectedEmoji === emoji
                      ? 'bg-[#00B227] text-white'
                      : 'bg-[#E8F5E9]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="relative">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Let us know how you feel"
              className="w-full p-4 bg-gray-50 rounded-lg border-none resize-none"
              rows={3}
            />
            {feedback && (
              <button
                type="button"
                onClick={() => setFeedback('')}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#00B227] text-white py-4 rounded-lg text-lg font-medium hover:bg-[#00B227]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Continue to Payment'}
          </button>

          {/* Payment Methods */}
          <div className="flex justify-center items-center gap-4">
            {/* Placeholders for payment icons - will be replaced with actual SVGs */}
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </form>
      ) : (
        <Elements stripe={stripePromise}>
          <PaymentForm
            amount={Number(amount)}
            staffId={staff[0]?.id}
            roomId={roomId || ''}
            feedback={feedback}
            rating={selectedEmoji || ''}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
          {paymentError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {paymentError}
            </div>
          )}
        </Elements>
      )}
    </div>
  );
}