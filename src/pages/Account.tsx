import React, { useState, useEffect } from 'react';
import { PencilIcon, CreditCard, Building2, CheckCircle2, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51QFZt8GMXInbuTdwO7A384TlV2KK4bCX4CrEjO6iEjNfC6BolYR3E23L3txmgMl5OouOvxcx691j22hUdffIAJcd00QlXj7feI';

interface BankDetails {
  accountName: string;
  bankName: string;
  routingNumber: string;
  accountNumber: string;
}

interface HotelDetails {
  hotelName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AlertState {
  type: 'success' | 'error';
  message: string;
}

const Account = () => {
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      setIsLoading(true);
      // Load hotel and bank details from localStorage
      const storedHotelDetails = localStorage.getItem('hotelDetails');
      const storedBankDetails = localStorage.getItem('bankDetails');
      
      if (storedHotelDetails) {
        setHotelDetails(JSON.parse(storedHotelDetails));
      }
      if (storedBankDetails) {
        setBankDetails(JSON.parse(storedBankDetails));
      }

      // Simulate balance (in a real app, this would come from your backend)
      setBalance(25350.53);
    } catch (error) {
      showAlert('error', 'Failed to load account data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000); // Clear alert after 5 seconds
  };

  const handleAddPaymentMethod = async () => {
    try {
      setIsLoading(true);
      const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }

      const { error } = await stripe.redirectToCheckout({
        mode: 'setup',
        successUrl: `${window.location.origin}/account?setup=success`,
        cancelUrl: `${window.location.origin}/account?setup=canceled`,
        customerEmail: hotelDetails?.email
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      showAlert('error', 'Failed to initialize payment setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showAlert('success', 'Withdrawal initiated successfully. Funds will be transferred to your bank account.');
    } catch (error) {
      showAlert('error', 'Failed to process withdrawal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (number: string) => {
    return number.match(/.{1,4}/g)?.join(' ') || number;
  };

  if (isLoading && !hotelDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading account details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {alert && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{alert.message}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Account / Payments</h1>
          <p className="text-gray-500 mt-1">Manage your account and payment methods</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-600">
                  {hotelDetails?.hotelName?.[0] || 'H'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{hotelDetails?.hotelName}</h2>
                <p className="text-gray-500">{hotelDetails?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="text-blue-600 hover:text-blue-700"
              disabled={isLoading}
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Role</label>
              <p className="mt-1 text-gray-900">Hotel Manager</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-gray-900">{hotelDetails?.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-gray-900">
                {hotelDetails?.address}, {hotelDetails?.city}, {hotelDetails?.state} {hotelDetails?.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-4">Current Balance</h3>
            <div className="text-4xl font-bold mb-4">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <button
              onClick={handleWithdraw}
              disabled={isLoading || balance === 0}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Withdraw
            </button>
          </div>

          {/* Bank Account */}
          {bankDetails && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-gray-400" />
                  <h3 className="text-lg font-medium">Bank Account</h3>
                </div>
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Account Name: {bankDetails.accountName}</p>
                <p className="text-gray-600">Bank: {bankDetails.bankName}</p>
                <p className="text-gray-600">
                  Account: ****{bankDetails.accountNumber.slice(-4)}
                </p>
              </div>
            </div>
          )}

          {/* Credit Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-gray-400" />
                <h3 className="text-lg font-medium">Payment Methods</h3>
              </div>
            </div>

            {/* Example Card */}
            <div className="bg-gray-900 rounded-lg p-4 mb-4 text-white">
              <div className="flex justify-between items-center mb-8">
                <div className="w-12 h-8 bg-gray-800 rounded"></div>
                <span className="text-sm">Mastercard</span>
              </div>
              <div className="mb-4">
                <p className="text-lg">{formatCardNumber('4242424242424242')}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span>John Doe</span>
                <span>12/24</span>
              </div>
            </div>

            <button
              onClick={handleAddPaymentMethod}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;