import React from 'react';

const UserManagement = ({ data }) => {
  // حماية ضد البيانات الفارغة
  if (!data || !data.items) {
    return <div className="p-20 text-center font-bold">لا توجد بيانات لعرضها</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <h2 className="text-2xl font-black mb-6 text-[#1e5af2]">إدارة مستخدمي النظام</h2>
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-5 text-gray-600 font-bold">الاسم</th>
              <th className="p-5 text-gray-600 font-bold">البريد</th>
              <th className="p-5 text-gray-600 font-bold">الوظيفة</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((user) => (
              <tr key={user.id} className="border-b hover:bg-blue-50 transition-colors">
                <td className="p-5 font-medium">{user.name}</td>
                <td className="p-5 text-gray-500">{user.email}</td>
                <td className="p-5">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;