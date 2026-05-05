import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Upload, Save, X, Globe } from "lucide-react";
import axios from 'axios';

export default function LabProfile() {
  // 1. حالة البيانات (مطابقة لهيكل الـ API الخاص بك)
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    bio: "",
    profilePictureUrl: null,
    addressUrl: null
  });

  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // 2. جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // استبدل الرابط بـ Endpoint الجلب الخاصة بك
        // const response = await axios.get('YOUR_API_URL/lab-profile');
        
        // محاكاة البيانات التي أرسلتها
        const data = {
          "id": "019cc30c-cda8-7e89-9306-2ff16428b23b",
          "name": "معمل البرج",
          "email": "lab@healthcare.com",
          "phoneNumber": "01047852369",
          "address": "اخر الشارع",
          "addressUrl": null,
          "city": "Cairo",
          "bio": "المعمل العريق المعمل العظيم",
          "profilePictureUrl": "https://res.cloudinary.com/dhyta9b7p/image/upload/v1773231256/HealthCare/Images/oofz8lnrzivz9nadysds.png"
        };
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 3. تحديث الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // 4. التعامل مع رفع الصورة (تحويلها لـ Base64 أو إرسالها كـ File لاحقاً)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, profilePictureUrl: imageUrl, rawFile: file }));
    }
  };

  // 5. وظيفة الحفظ الفعلي للبيانات
  const handleSave = async () => {
    try {
      // تجهيز البيانات للإرسال (FormData في حال وجود ملفات)
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('phoneNumber', profile.phoneNumber);
      formData.append('address', profile.address);
      formData.append('city', profile.city);
      formData.append('bio', profile.bio);
      if (profile.rawFile) {
        formData.append('profilePicture', profile.rawFile);
      }

      console.log("Sending Data to API...", profile);
      
      // كود الـ axios الحقيقي:
      // await axios.post(`YOUR_API_URL/lab/update/${profile.id}`, formData);

      alert("تم تحديث بيانات المعمل بنجاح!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("حدث خطأ أثناء التحديث");
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-slate-500">جاري تحميل البيانات...</div>;

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto p-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">إعدادات الحساب</h2>
          <p className="text-slate-400 text-xs font-bold mt-1 italic">تحديث بيانات معمل التحاليل الخاص بك</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-10 space-y-10 mt-8">
          <section className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User size={12}/> المعلومات العامة
            </h4>
            
            {/* Profile Picture Section */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-700 block ml-1">شعار المعمل</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden shadow-inner">
                  {profile.profilePictureUrl ? (
                    <img src={profile.profilePictureUrl} alt="Lab Logo" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                <div className="space-y-2">
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-blue-600 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <Upload size={14} /> رفع شعار جديد
                  </button>
                  <p className="text-[10px] text-slate-400 font-bold italic">JPG, PNG or GIF (max. 2MB)</p>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="اسم المعمل *" 
                icon={<User size={16}/>} 
                name="name"
                value={profile.name} 
                onChange={handleChange} 
              />
              <InputField 
                label="البريد الإلكتروني" 
                icon={<Mail size={16}/>} 
                name="email"
                value={profile.email} 
                readOnly // عادة البريد لا يتغير بسهولة
                onChange={handleChange} 
              />
              <InputField 
                label="رقم الهاتف" 
                icon={<Phone size={16}/>} 
                name="phoneNumber"
                value={profile.phoneNumber} 
                onChange={handleChange} 
                placeholder="01xxxxxxxxx" 
              />
              <InputField 
                label="المدينة" 
                icon={<MapPin size={16}/>} 
                name="city"
                value={profile.city} 
                onChange={handleChange} 
                placeholder="مثال: Cairo" 
              />
              <div className="md:col-span-2">
                <InputField 
                    label="العنوان بالتفصيل" 
                    icon={<Globe size={16}/>} 
                    name="address"
                    value={profile.address} 
                    onChange={handleChange} 
                    placeholder="اكتب العنوان هنا..." 
                />
              </div>
            </div>
            
            {/* Bio */}
            <div className="space-y-2">
               <label className="text-[11px] font-black text-slate-700 block ml-1">وصف المعمل (Bio)</label>
               <textarea 
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="4" 
                  className="w-full pl-6 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-600 text-sm placeholder:text-slate-300 shadow-inner" 
                  placeholder="تحدث عن الخدمات التي يقدمها المعمل..."
               ></textarea>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-50">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all"
            >
              <Save size={16} /> حفظ التغييرات
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-100 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              <X size={16} /> إلغاء
            </button>
          </div>
        </div>
    </div>
  );
}

// مكون الحقل المطور
function InputField({ label, icon, value, placeholder, onChange, name, readOnly = false }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-700 block ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>
        <input 
          type="text" 
          name={name}
          value={value} 
          onChange={onChange} 
          readOnly={readOnly}
          placeholder={placeholder} 
          className={`w-full pl-14 pr-6 py-4 border rounded-2xl outline-none transition-all font-bold text-sm shadow-inner
            ${readOnly ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-transparent' : 'bg-slate-50 border-slate-100 focus:ring-4 focus:ring-blue-50 text-slate-600 placeholder:text-slate-300'}
          `} 
        />
      </div>
    </div>
  );
}