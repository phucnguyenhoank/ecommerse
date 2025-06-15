import React, { useState } from "react";
import "../styles/AccountDetails.css";

const AccountDetails: React.FC = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field: string) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="account-details">
      <h2>Account Details</h2>
      <form>
        <div className="input-group">
          <label>First name *</label>
          <input type="text" required />
        </div>

        <div className="input-group">
          <label>Last name *</label>
          <input type="text" required />
        </div>

        <div className="input-group">
          <label>Display name *</label>
          <input type="text" defaultValue="huahuyentran" />
          <small>This will be how your name will be displayed in the account section and in reviews</small>
        </div>

        <div className="input-group">
          <label>Email address *</label>
          <input type="email" defaultValue="n22dccn087@student.ptithcm.edu.vn" required />
        </div>

        {/* Password Change Section */}
        <div className="password-section">
          <h3>Password change</h3>

          <div className="input-group">
            <label>Current password (leave blank to leave unchanged)</label>
            <div className="password-input">
              <input type={showPassword.current ? "text" : "password"} />
              <span onClick={() => togglePassword("current")}>
                {showPassword.current ? "👁" : "👁‍🗨"}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>New password (leave blank to leave unchanged)</label>
            <div className="password-input">
              <input type={showPassword.new ? "text" : "password"} />
              <span onClick={() => togglePassword("new")}>
                {showPassword.new ? "👁" : "👁‍🗨"}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm new password</label>
            <div className="password-input">
              <input type={showPassword.confirm ? "text" : "password"} />
              <span onClick={() => togglePassword("confirm")}>
                {showPassword.confirm ? "👁" : "👁‍🗨"}
              </span>
            </div>
          </div>
        </div>

        <button type="submit" className="save-button">SAVE CHANGES</button>
      </form>
    </div>
  );
};

export default AccountDetails;
