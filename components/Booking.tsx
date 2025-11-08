"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Calendar, Clock, Users, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
}

const services = [
  "Yoga Class",
  "Wim Hof Workshop",
  "Ice Bath Session",
  "Wellness Retreat (3 days)",
  "Wellness Retreat (7 days)",
  "Private Session",
  "Group Event",
];

const timeSlots = [
  "07:00", "09:00", "11:00", "14:00", "16:00", "17:00"
];

export function Booking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BookingFormData>();

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          date: data.date,
          time: data.time,
          guests: data.guests,
          message: data.message || null,
        }]);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Booking submitted successfully!');
      
      // TODO: Implement email confirmation service
      // Send confirmation email to customer at data.email
      // Send notification email to admin at admin@healthycorner.com
      // Use services like SendGrid, AWS SES, or Resend
      
      setSubmittedEmail(data.email);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmittedEmail('');
      }, 5000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 md:py-40 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <span className="text-primary font-bold text-sm uppercase tracking-[0.3em]">
                BOOK YOUR EXPERIENCE
              </span>
              <div className="w-16 h-1 bg-primary mt-3"></div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-tight">
              Start Your Wellness Journey
            </h2>
            
            <p className="text-xl text-neutral-700 mb-10 leading-relaxed font-light">
              Reserve your spot for our classes, workshops, or multi-day retreats. Our team will confirm your booking within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Flexible Scheduling</h3>
                  <p className="text-neutral-600">Choose from daily classes or multi-day retreat programs</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Small Groups</h3>
                  <p className="text-neutral-600">Limited spots ensure personalized attention</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">Quick Confirmation</h3>
                  <p className="text-neutral-600">Receive booking confirmation within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-2xl">
              <p className="text-neutral-700 font-medium mb-2">Need help choosing?</p>
              <p className="text-neutral-600 text-sm mb-4">
                Contact us for personalized recommendations based on your wellness goals.
              </p>
              <a href="#contact" className="text-primary font-semibold hover:underline">
                Get in touch →
              </a>
            </div>
          </motion.div>

          {/* Right Content - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  <input
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    type="email"
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                  <input
                    {...register("phone", { required: "Phone is required" })}
                    type="tel"
                    className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="+386 XX XXX XXX"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Service *
                </label>
                <select
                  {...register("service", { required: "Please select a service" })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                >
                  <option value="">Choose a service...</option>
                  {services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
                {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Date *
                  </label>
                  <input
                    {...register("date", { required: "Date is required" })}
                    type="date"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Time *
                  </label>
                  <select
                    {...register("time", { required: "Time is required" })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select...</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Guests *
                </label>
                <input
                  {...register("guests", { 
                    required: "Number of guests is required",
                    min: { value: 1, message: "At least 1 guest required" },
                    max: { value: 20, message: "Maximum 20 guests" }
                  })}
                  type="number"
                  min="1"
                  max="20"
                  defaultValue="1"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
                {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  {...register("message")}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Any special requirements or questions..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Book Now"}
              </button>

              {/* Success Message */}
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center"
                >
                  ✓ Booking request submitted successfully! We'll send you a confirmation email at {submittedEmail} within 24 hours to confirm your reservation.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
