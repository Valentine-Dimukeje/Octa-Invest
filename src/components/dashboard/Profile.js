import { useEffect, useState, useContext } from "react";
import { authFetch } from "../utils/authFetch";
import { WalletContext } from "../dashboard/walletContext";
import "../styles/profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    walletBalance,
    profitBalance,
    totalBalance,
    refreshWallet,
    walletLoading,
  } = useContext(WalletContext);

  useEffect(() => {
    // Refresh wallet when profile page opens
    refreshWallet();

    const fetchProfile = async () => {
      try {
        const res = await authFetch("/api/profile/");
        if (!res.ok) throw new Error("Profile fetch failed");

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [refreshWallet]);

  if (loading || walletLoading) {
    return <p className="loading-text">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="error-text">Failed to load profile.</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Account Profile</h2>

        {/* PERSONAL INFO */}
        <section>
          <h3>Personal Information</h3>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
          <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
          <p><strong>Country:</strong> {profile.country || "N/A"} {profile.flag}</p>
        </section>

        {/* WALLET */}
        <section>
          <h3>Wallet Balances</h3>
          <p><strong>Main Wallet:</strong> ${walletBalance.toFixed(2)}</p>
          <p><strong>Profit Wallet:</strong> ${profitBalance.toFixed(2)}</p>
          <p><strong>Total Balance:</strong> ${totalBalance.toFixed(2)}</p>
        </section>

        {/* NOTIFICATIONS */}
        <section>
          <h3>Notifications</h3>
          <p>Email: {profile.notifications.email ? "✅ On" : "❌ Off"}</p>
          <p>SMS: {profile.notifications.sms ? "✅ On" : "❌ Off"}</p>
          <p>System: {profile.notifications.system ? "✅ On" : "❌ Off"}</p>
        </section>

        {/* DEVICES */}
        <section>
          <h3>Connected Devices</h3>
          {profile.devices.length === 0 ? (
            <p>No active devices.</p>
          ) : (
            <ul>
              {profile.devices.map((d, i) => (
                <li key={i}>
                  {d.device_name} — {d.ip_address}
                  <br />
                  <small>
                    Last active: {new Date(d.last_active).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
