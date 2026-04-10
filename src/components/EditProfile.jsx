import React from 'react';
import { Camera, User, Mail, Phone, MapPin, Briefcase, AlignLeft, Save, X } from 'lucide-react';

export default function EditProfile() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-8" dir="ltr">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">Edit Profile</h1>
        <p className="text-slate-500 mt-1">Update your profile information</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 p-10 max-w-5xl">
        <h2 className="text-lg font-bold text-slate-700 mb-8">Profile Information</h2>

        <form className="space-y-8">
          {/* Profile Picture Section */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-600 block">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200">
                <User size={40} className="text-slate-300" />
              </div>
              <div>
                <button type="button" className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-sm shadow-blue-50">
                  <Camera size={18} />
                  Upload Photo
                </button>
                <p className="text-xs text-slate-400 mt-2">JPG, PNG or GIF (max. 2MB)</p>
              </div>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="doctor"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none text-slate-700"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="doctor@gmail.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none text-slate-700"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Enter your phone number"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none text-slate-700"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">Location</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Enter your city"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Specialty (Select) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Specialty</label>
            <select className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none text-slate-700 appearance-none">
              <option value="">Select your specialty</option>
              <option value="cardiology">Cardiology</option>
              <option value="dentistry">Dentistry</option>
            </select>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600">Bio</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-slate-400" size={18} />
              <textarea 
                rows="4"
                placeholder="Tell us about yourself and your experience..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none text-slate-700 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <Save size={20} />
              Save Changes
            </button>
            <button type="button" className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              <X size={20} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}