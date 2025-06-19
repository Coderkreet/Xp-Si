import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading } from '../redux/slice/loadingSlice';
import { sendRegisterOtp, verifyRegisterOtp } from '../api/auth-api';
import { saveToken } from '../utils/additonalFunc';
import { AuthenticatedRoutes, AuthRoutes } from '../context/Routes';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import {
  nameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  numberValidator
} from '../utils/inputValidator';
import { countriesWithCode } from "../context/authContent";

import DualOtpVerificationPopup from '../components/UI/DualOtpVerificationPopup';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const [otpPopup, setOtpPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    referral: '',
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    country: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (search) {
      setFormData((prev) => ({
        ...prev,
        referral: search?.split('=')[1] || '',
      }));
    }
  }, [search]);

  const handleNavigate = () => {
    navigate(AuthenticatedRoutes.DASHBOARD);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const nameError = nameValidator(formData.name);
    const emailError = emailValidator(formData.email);
    const passwordError = passwordValidator(formData.password);
    const confirmPasswordError = confirmPasswordValidator(
      formData.password,
      formData.confirmPassword
    );
    const mobileNumberError = numberValidator(formData.mobile);

    if (nameError) {
      newErrors.name = nameError;
      isValid = false;
    }
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
      isValid = false;
    }
    if (mobileNumberError) {
      newErrors.mobile = mobileNumberError;
      isValid = false;
    }
    if (!formData.country) {
      newErrors.country = 'Please select a country';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!formData.terms) {
      Swal.fire({
        icon: 'error',
        title: 'Alert!',
        text: 'Please agree to the terms and conditions.',
        confirmButtonText: 'OK',
        timer: 3000,
      });
      return;
    }

    try {
      dispatch(setLoading(true));
      await sendRegisterOtp({
        ...formData,
      });
      setOtpPopup(true);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Send Register Otp Failed',
        text: error?.response?.data.message || 'Something went wrong!',
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const otpSubmitHandler = async (data) => {
    try {
      dispatch(setLoading(true));

      const response = await verifyRegisterOtp({
        ...formData,
        ...data,
      });
      saveToken(response?.id, response?.token, 'user');

      await Swal.fire({
        icon: 'success',
        title: 'Registration Success',
        text: 'You have registered successfully',
        timer: 2000,
      });
      
      handleNavigate();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Otp Verification Failed',
        text: error?.response?.data?.message || 'Something went wrong!',
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <DualOtpVerificationPopup
        show={otpPopup}
        payload={formData}
        onHide={() => setOtpPopup(false)}
        otpSubmitHandler={otpSubmitHandler}
      />

      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-md p-8 rounded-lg">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <svg className="w-8 h-8 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-xl font-semibold text-white">XPFI-Coin<sup>®</sup></span>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-white">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="referral" className="block text-sm font-medium text-white mb-2">
                Reference Code
              </label>
              <input
                type="text"
                id="referral"
                name="referral"
                value={formData.referral}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-white mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-white mb-2">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a country</option>
                  <option value="India" defaultChecked >India IN</option>
                  {countriesWithCode.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-white">
                I agree to the Terms and Conditions
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Create Account
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to={AuthRoutes.LOGIN} className="font-medium text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-gray-300">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register; 