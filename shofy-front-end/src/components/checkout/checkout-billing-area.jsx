'use client';
import React, { useState, useEffect } from "react";
import ErrorMsg from "../common/error-msg";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "@/redux/features/auth/authApi";

const CheckoutBillingArea = ({ register, errors, setValue }) => {
  const { user } = useSelector((state) => state.auth);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();

  // Load saved addresses on mount
  useEffect(() => {
    if (user?._id) {
      // Load from localStorage
      const storedAddresses = localStorage.getItem(`user_addresses_${user._id}`);
      if (storedAddresses) {
        const addresses = JSON.parse(storedAddresses);
        setSavedAddresses(addresses);

        // Auto-select the first address if available
        if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].id);
          const firstAddress = addresses[0];
          // Set form values with shouldValidate: false to prevent validation errors while form is hidden
          setValue("firstName", firstAddress.firstName || user.firstName || "", { shouldValidate: false, shouldDirty: true });
          setValue("lastName", firstAddress.lastName || "", { shouldValidate: false, shouldDirty: true });
          setValue("country", firstAddress.country || "INDIA", { shouldValidate: false, shouldDirty: true });
          setValue("address", firstAddress.address || "", { shouldValidate: false, shouldDirty: true });
          setValue("city", firstAddress.city || "", { shouldValidate: false, shouldDirty: true });
          setValue("zipCode", firstAddress.zipCode || "", { shouldValidate: false, shouldDirty: true });
          setValue("contactNo", firstAddress.contactNo || user.phone || "", { shouldValidate: false, shouldDirty: true });
          setValue("email", firstAddress.email || user.email || "", { shouldValidate: false, shouldDirty: true });
        }
      } else {
        // If no saved addresses, try to load from user profile
        if (user.address) {
          setValue("address", user.address);
        }
        if (user.phone) {
          setValue("contactNo", user.phone);
        }
        if (user.email) {
          setValue("email", user.email);
        }
        setShowNewAddressForm(true);
      }
    }
  }, [user, setValue]);

  // Sync form values when selected address changes
  useEffect(() => {
    if (selectedAddressId && savedAddresses.length > 0 && !showNewAddressForm) {
      const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress) {
        // Update form values whenever selected address changes
        setValue("firstName", selectedAddress.firstName || "", { shouldValidate: true, shouldDirty: true });
        setValue("lastName", selectedAddress.lastName || "", { shouldValidate: true, shouldDirty: true });
        setValue("country", selectedAddress.country || "INDIA", { shouldValidate: true, shouldDirty: true });
        setValue("address", selectedAddress.address || "", { shouldValidate: true, shouldDirty: true });
        setValue("city", selectedAddress.city || "", { shouldValidate: true, shouldDirty: true });
        setValue("zipCode", selectedAddress.zipCode || "", { shouldValidate: true, shouldDirty: true });
        setValue("contactNo", selectedAddress.contactNo || "", { shouldValidate: true, shouldDirty: true });
        setValue("email", selectedAddress.email || user?.email || "", { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [selectedAddressId, savedAddresses, showNewAddressForm, setValue, user]);

  // Handle address selection
  const handleSelectAddress = (addressId) => {
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setShowNewAddressForm(false);
      // Set form values with shouldValidate: false to prevent validation errors while form is hidden
      // Use shouldDirty: true to mark fields as touched
      setValue("firstName", address.firstName || "", { shouldValidate: false, shouldDirty: true });
      setValue("lastName", address.lastName || "", { shouldValidate: false, shouldDirty: true });
      setValue("country", address.country || "INDIA", { shouldValidate: false, shouldDirty: true });
      setValue("address", address.address || "", { shouldValidate: false, shouldDirty: true });
      setValue("city", address.city || "", { shouldValidate: false, shouldDirty: true });
      setValue("zipCode", address.zipCode || "", { shouldValidate: false, shouldDirty: true });
      setValue("contactNo", address.contactNo || "", { shouldValidate: false, shouldDirty: true });
      setValue("email", address.email || user?.email || "", { shouldValidate: false, shouldDirty: true });
    }
  };

  // Handle add new address
  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId(null);
    // Clear form values
    setValue("firstName", user?.firstName || "");
    setValue("lastName", "");
    setValue("country", "INDIA");
    setValue("address", "");
    setValue("city", "");
    setValue("zipCode", "");
    setValue("contactNo", user?.phone || "");
    setValue("email", user?.email || "");
  };



  return (
    <div className="tp-checkout-bill-area">
      <h3 className="tp-checkout-bill-title">Billing Details</h3>

      {/* Saved Addresses Section */}
      {savedAddresses.length > 0 && (
        <div className="tp-checkout-saved-addresses mb-30">
          <h4 className="mb-15">Saved Addresses</h4>
          <div className="row">
            {savedAddresses.map((address) => (
              <div key={address.id} className="col-md-6 mb-15">
                <div
                  className={`tp-checkout-address-card ${selectedAddressId === address.id ? 'active' : ''}`}
                  onClick={() => handleSelectAddress(address.id)}
                  style={{
                    border: selectedAddressId === address.id ? '2px solid #F875AA' : '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedAddressId === address.id ? '#fff5f8' : '#fff'
                  }}
                >
                  <p><strong>{address.firstName} {address.lastName}</strong></p>
                  <p>{address.address}</p>
                  <p>{address.city}, {address.zipCode}</p>
                  <p>{address.country}</p>
                  <p>{address.contactNo}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddNewAddress}
            className="tp-checkout-btn mb-20"
            style={{
              background: 'transparent',
              border: '1px solid #F875AA',
              color: '#F875AA',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add New Address
          </button>
        </div>
      )}

      {/* Address Form - Always render (hidden visually when saved address is selected) */}
      <div className={`tp-checkout-bill-form ${savedAddresses.length > 0 && !showNewAddressForm ? 'd-none' : ''}`}>
        <div className="tp-checkout-bill-inner">
          <div className="row">
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>
                  First Name <span>*</span>
                </label>
                <input
                  {...register("firstName", {
                    required: `firstName is required!`,
                  })}
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  defaultValue={user?.firstName}
                  style={savedAddresses.length > 0 && !showNewAddressForm ? { display: 'none' } : {}}
                />
                <ErrorMsg msg={errors?.firstName?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>
                  Last Name <span>*</span>
                </label>
                <input
                  {...register("lastName", {
                    required: `lastName is required!`,
                  })}
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  style={savedAddresses.length > 0 && !showNewAddressForm ? { display: 'none' } : {}}
                />
                <ErrorMsg msg={errors?.lastName?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  Country <span>*</span>
                </label>
                <input
                  {...register("country", { required: `country is required!` })}
                  name="country"
                  id="country"
                  type="text"
                  placeholder="INDIA"
                  style={savedAddresses.length > 0 && !showNewAddressForm ? { display: 'none' } : {}}
                />
                <ErrorMsg msg={errors?.lastName?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>Street address</label>
                <input
                  {...register("address", { required: `Address is required!` })}
                  name="address"
                  id="address"
                  type="text"
                  placeholder="House number and street name"
                  style={savedAddresses.length > 0 && !showNewAddressForm ? { display: 'none' } : {}}
                />
                <ErrorMsg msg={errors?.address?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>Town / City</label>
                <input
                  {...register("city", { required: `City is required!` })}
                  name="city"
                  id="city"
                  type="text"
                  placeholder="City"
                  style={savedAddresses.length > 0 && !showNewAddressForm ? { display: 'none' } : {}}
                />
                <ErrorMsg msg={errors?.city?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>Postcode ZIP</label>
                <input
                  {...register("zipCode", { required: `zipCode is required!` })}
                  name="zipCode"
                  id="zipCode"
                  type="text"
                  placeholder="Postcode ZIP"
                  style={savedAddresses.length > 0 && !showNewAddressForm ? { display: 'none' } : {}}
                />
                <ErrorMsg msg={errors?.zipCode?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  Phone <span>*</span>
                </label>
                <input
                  {...register("contactNo", {
                    required: `ContactNumber is required!`,
                  })}
                  name="contactNo"
                  id="contactNo"
                  type="text"
                  placeholder="Phone"
                  style={savedAddresses.length > 0 && !showNewAddressForm ? { display: 'none' } : {}}
                />
                <ErrorMsg msg={errors?.contactNo?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  Email address <span>*</span>
                </label>
                <input
                  {...register("email", { required: `Email is required!` })}
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={user?.email}
                  style={savedAddresses.length > 0 && !showNewAddressForm ? { display: 'none' } : {}}
                />
                <ErrorMsg msg={errors?.email?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>Order notes (optional)</label>
                <textarea
                  {...register("orderNote", { required: false })}
                  name="orderNote"
                  id="orderNote"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden inputs to ensure form values are tracked when saved address is selected */}
      {savedAddresses.length > 0 && !showNewAddressForm && selectedAddressId && (() => {
        const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
        if (!selectedAddress) return null;
        return (
          <div style={{ display: 'none' }}>
            <input {...register("firstName", { required: true })} type="hidden" defaultValue={selectedAddress.firstName || ""} />
            <input {...register("lastName", { required: true })} type="hidden" defaultValue={selectedAddress.lastName || ""} />
            <input {...register("country", { required: true })} type="hidden" defaultValue={selectedAddress.country || "INDIA"} />
            <input {...register("address", { required: true })} type="hidden" defaultValue={selectedAddress.address || ""} />
            <input {...register("city", { required: true })} type="hidden" defaultValue={selectedAddress.city || ""} />
            <input {...register("zipCode", { required: true })} type="hidden" defaultValue={selectedAddress.zipCode || ""} />
            <input {...register("contactNo", { required: true })} type="hidden" defaultValue={selectedAddress.contactNo || ""} />
            <input {...register("email", { required: true })} type="hidden" defaultValue={selectedAddress.email || user?.email || ""} />
          </div>
        );
      })()}
    </div>
  );
};

export default CheckoutBillingArea;
