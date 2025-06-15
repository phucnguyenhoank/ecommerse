import React from "react";
import "../styles/Address.css";
interface AddressForm {
  title: string;
}

const AddressForm: React.FC<AddressForm> = ({ title }) => {
  return (
    <div className="address-form">
      <h2>{title}</h2>
      <form>
        <div className="form-group">
          <label>First name *</label>
          <input type="text" required />
        </div>

        <div className="form-group">
          <label>Last name *</label>
          <input type="text" required />
        </div>

        <div className="form-group">
          <label>Company name (optional)</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label>Country / Region *</label>
          <select required>
            <option>Select a country / region...</option>
          </select>
        </div>

        <div className="form-group">
          <label>Street address *</label>
          <input type="text" placeholder="House number and street name" required />
          <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" />
        </div>

        <div className="form-group">
          <label>State (optional)</label>
          <select>
            <option>Select an option...</option>
          </select>
        </div>

        <div className="form-group">
          <label>City *</label>
          <select required>
            <option>Select an option...</option>
          </select>
        </div>

        <div className="form-group">
          <label>Postcode / ZIP (optional)</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input type="tel" required />
        </div>

        <div className="form-group">
          <label>Email address *</label>
          <input type="email" required />
        </div>

        <button type="submit" className="save-button">SAVE ADDRESS</button>
      </form>
    </div>
  );
};

export default AddressForm;
