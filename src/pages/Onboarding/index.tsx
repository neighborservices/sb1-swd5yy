import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { useOnboarding } from '../../hooks/useOnboarding';
import Registration from './steps/Registration';
import BankDetails from './steps/BankDetails';
import RoomSetup from './steps/RoomSetup';
import StaffSetup from './steps/StaffSetup';
import QRGeneration from './steps/QRGeneration';

const steps = [
  { id: 'registration', title: 'Hotel Details', path: 'registration' },
  { id: 'bank', title: 'Bank Account', path: 'bank' },
  { id: 'rooms', title: 'Room Setup', path: 'rooms' },
  { id: 'staff', title: 'Staff Setup', path: 'staff' },
  { id: 'qr', title: 'QR Codes', path: 'qr' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeOnboarding, resetOnboarding } = useOnboarding();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentStepIndex = steps.findIndex(step => 
    location.pathname.includes(step.path)
  );

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => [...new Set([...prev, stepId])]);
  };

  const isStepComplete = (stepId: string) => completedSteps.includes(stepId);

  const handleStepComplete = (stepId: string, nextPath?: string) => {
    markStepComplete(stepId);
    if (nextPath) {
      navigate(nextPath);
    } else if (completedSteps.length === steps.length - 1) {
      completeOnboarding();
      navigate('/', { replace: true });
    }
  };

  const handleBackToSignIn = () => {
    resetOnboarding();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-12 px-4">
        <div className="mb-8">
          <button
            onClick={handleBackToSignIn}
            className="flex items-center text-[#0B4619] hover:text-[#0B4619]/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Sign In
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#0B4619] mb-4">Welcome to TipCard</h1>
          <p className="text-gray-600">Let's get your hotel set up in just a few steps</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStepIndex >= index
                      ? 'bg-[#0B4619] text-white'
                      : isStepComplete(step.id)
                      ? 'bg-[#B4F481] text-[#0B4619]'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isStepComplete(step.id) ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-sm mt-2 text-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStepIndex > index ? 'bg-[#0B4619]' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <Routes>
            <Route path="/" element={<Navigate to="registration" replace />} />
            <Route 
              path="registration" 
              element={
                <Registration 
                  onComplete={() => handleStepComplete('registration', '/onboarding/bank')} 
                />
              } 
            />
            <Route 
              path="bank" 
              element={
                <BankDetails 
                  onComplete={() => handleStepComplete('bank', '/onboarding/rooms')} 
                />
              } 
            />
            <Route 
              path="rooms" 
              element={
                <RoomSetup 
                  onComplete={() => handleStepComplete('rooms', '/onboarding/staff')} 
                />
              } 
            />
            <Route 
              path="staff" 
              element={
                <StaffSetup 
                  onComplete={() => handleStepComplete('staff', '/onboarding/qr')} 
                />
              } 
            />
            <Route 
              path="qr" 
              element={
                <QRGeneration 
                  onComplete={() => handleStepComplete('qr')} 
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;