import React, { useState } from "react";
import AddressForm from './AddressForm';
import "../styles/Address.css";

const Address: React.FC = () => {
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);

  return (
    <div className="address-page">
      <p className="address-info">
        The following addresses will be used on the checkout page by default.
      </p>
      <div className="address-container">
        {/* Billing Address */}
        <div className="address-section">
          <h2>BILLING ADDRESS</h2>
          {showBillingForm ? (
            <AddressForm title="Billing Address" />
          ) : (
            <>
              <p className="add-address" onClick={() => setShowBillingForm(true)}>
                Add Billing address
              </p>
              <p className="no-address"><em>You have not set up this type of address yet.</em></p>
            </>
          )}
        </div>

        {/* Shipping Address */}
        <div className="address-section">
          <h2>SHIPPING ADDRESS</h2>
          {showShippingForm ? (
            <AddressForm title="Shipping Address" />
          ) : (
            <>
              <p className="add-address" onClick={() => setShowShippingForm(true)}>
                Add Shipping address
              </p>
              <p className="no-address"><em>You have not set up this type of address yet.</em></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Address;
