"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Calendar, Mail, Phone, User, Clock, Users, LogOut, MessageSquare } from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  guests: number;
  message: string | null;
  status: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages' | 'products' | 'orders'>('bookings');

  // Immediately redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  // Show loading state while checking auth OR redirect to login immediately
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // If no user after loading, show nothing and redirect happens
  if (!user) {
    router.replace('/login');
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoadingData(true);
    
    // Fetch bookings
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
    } else {
      setBookings(bookingsData || []);
    }

    // Fetch contact messages
    const { data: messagesData, error: messagesError } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
    } else {
      setMessages(messagesData || []);
    }

    setLoadingData(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    } else {
      fetchData();
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating message:', error);
      alert('Failed to update message status');
    } else {
      fetchData();
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
              <p className="text-sm text-neutral-600">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Bookings</p>
                <p className="text-3xl font-bold text-neutral-900">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pending Bookings</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Unread Messages</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {messages.filter(m => m.status === 'unread').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-neutral-200">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'bookings'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'messages'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Messages ({messages.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'products'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'orders'
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => router.push('/admin/media')}
                className="px-6 py-3 rounded-xl font-semibold transition-all bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              >
                Media Manager
              </button>
            </div>
          </div>

          <div className="p-6">
            {loadingData ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-neutral-600">Loading data...</p>
              </div>
            ) : activeTab === 'bookings' ? (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">No bookings yet</p>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <User className="text-neutral-400" size={20} />
                            <span className="font-semibold text-neutral-900">{booking.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-600">
                            <div className="flex items-center space-x-2">
                              <Mail size={16} />
                              <span>{booking.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone size={16} />
                              <span>{booking.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar size={16} />
                              <span>{booking.date} at {booking.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users size={16} />
                              <span>{booking.guests} guest(s)</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm font-medium text-neutral-700">Service: {booking.service}</p>
                            {booking.message && (
                              <p className="text-sm text-neutral-600 mt-2">Message: {booking.message}</p>
                            )}
                          </div>

                          <p className="text-xs text-neutral-400 mt-2">
                            Created: {new Date(booking.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'messages' ? (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-neutral-500 py-8">No messages yet</p>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <User className="text-neutral-400" size={20} />
                            <span className="font-semibold text-neutral-900">{message.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.status === 'unread' ? 'bg-blue-100 text-blue-800' :
                              message.status === 'read' ? 'bg-gray-100 text-gray-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {message.status}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2 text-neutral-600">
                              <Mail size={16} />
                              <span>{message.email}</span>
                            </div>
                            <p className="font-medium text-neutral-700">Subject: {message.subject}</p>
                            <p className="text-neutral-600">{message.message}</p>
                          </div>

                          <p className="text-xs text-neutral-400 mt-2">
                            Created: {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          <select
                            value={message.status}
                            onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'products' ? (
              <div className="space-y-4">
                <div className="text-center py-12">
                  <p className="text-neutral-600 mb-4">Product management coming soon</p>
                  <p className="text-sm text-neutral-500">You can manage products from the database directly</p>
                </div>
              </div>
            ) : activeTab === 'orders' ? (
              <div className="space-y-4">
                <div className="text-center py-12">
                  <p className="text-neutral-600 mb-4">No orders yet</p>
                  <p className="text-sm text-neutral-500">Orders will appear here when customers make purchases</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
