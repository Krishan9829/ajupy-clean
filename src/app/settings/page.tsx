export default function SettingsPage() {
  return (
    <main className="p-8 text-white bg-black min-h-screen">
      
      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-2">
        ⚙️ Settings
      </h1>

      <p className="text-gray-400 mb-8">
        Manage your account preferences and system configuration
      </p>

      {/* SETTINGS CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition">
          <h2 className="text-xl font-semibold">👤 Profile</h2>
          <p className="text-gray-400 mt-2">
            Update your personal information and username
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition">
          <h2 className="text-xl font-semibold">🔒 Security</h2>
          <p className="text-gray-400 mt-2">
            Change password and enable 2FA protection
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition">
          <h2 className="text-xl font-semibold">🎨 Appearance</h2>
          <p className="text-gray-400 mt-2">
            Theme, dark mode and UI customization
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition">
          <h2 className="text-xl font-semibold">💳 Billing</h2>
          <p className="text-gray-400 mt-2">
            Manage subscription and payment methods
          </p>
        </div>

      </div>
    </main>
  );
}