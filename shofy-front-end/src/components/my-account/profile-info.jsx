import React from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
// internal
import ErrorMsg from '../common/error-msg';
import { useUpdateProfileMutation } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/toast';

// yup  schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Full Name"),
  lastName: Yup.string().required().label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  phone: Yup.string().required().min(10).label("Phone"),
  address: Yup.string().required().label("Address"),
  city: Yup.string().required().label("City/District"),
  state: Yup.string().required().label("State"),
  zipCode: Yup.string().required().label("Pin Code"),
  locality: Yup.string().required().label("Locality / Town / Village"),
});

const ProfileInfo = () => {
  const { user } = useSelector((state) => state.auth);

  const [updateProfile, { }] = useUpdateProfileMutation();
  // react hook form
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  // on submit
  const onSubmit = (data) => {
    updateProfile({
      id: user?._id,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      locality: data.locality,
    }).then((result) => {
      if (result?.error) {
        notifyError(result?.error?.data?.message);
      }
      else {
        notifySuccess(result?.data?.message);
      }
    })
    reset();
  };
  return (
    <div className="profile__info">
      <h3 className="profile__info-title">Personal Details</h3>
      <div className="profile__info-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("name", { required: `Full Name is required!` })} name='name' type="text" placeholder="First Name" defaultValue={user?.name} />
                  <ErrorMsg msg={errors.name?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("lastName", { required: `Last Name is required!` })} name='lastName' type="text" placeholder="Last Name" defaultValue={user?.lastName} />
                  <ErrorMsg msg={errors.lastName?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("email", { required: `Email is required!` })} name='email' type="email" placeholder="Email" defaultValue={user?.email} />
                  <ErrorMsg msg={errors.email?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input d-flex align-items-center" style={{ border: '1px solid #EBEBEB', borderRadius: '4px', overflow: 'hidden', padding: 0 }}>
                  <div style={{ padding: '0 15px', borderRight: '1px solid #EBEBEB', fontWeight: '500', color: '#000', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', height: '100%', minHeight: '56px' }}>
                    +91
                  </div>
                  <input {...register("phone", { required: true })} name='phone' type="text" placeholder="Mobile Number" defaultValue={user?.phone} style={{ border: 'none', borderRadius: '0', paddingLeft: '15px', height: '56px', flex: 1 }} />
                </div>
                <ErrorMsg msg={errors.phone?.message} />
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("zipCode", { required: true })} name='zipCode' type="text" placeholder="Pin Code" defaultValue={user?.zipCode || ""} />
                  <ErrorMsg msg={errors.zipCode?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("city", { required: true })} name='city' type="text" placeholder="City/District" defaultValue={user?.city || ""} />
                  <ErrorMsg msg={errors.city?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("state", { required: true })} name='state' type="text" placeholder="State" defaultValue={user?.state || ""} />
                  <ErrorMsg msg={errors.state?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("address", { required: true })} name='address' type="text" placeholder="Address (House No, Street, Area)" defaultValue={user?.address || ""} />
                  <ErrorMsg msg={errors.address?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input {...register("locality", { required: true })} name='locality' type="text" placeholder="Locality / Town / Village *" defaultValue={user?.locality || ""} />
                  <ErrorMsg msg={errors.locality?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__btn">
                <button type="submit" className="tp-btn">Update Profile</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;