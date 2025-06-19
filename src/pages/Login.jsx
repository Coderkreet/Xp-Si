import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUserWithUsername } from '../api/auth-api';
import { setLoading } from '../redux/slice/loadingSlice';
import { saveToken } from '../utils/additonalFunc';
import Swal from 'sweetalert2';
import { nameValidator, passwordValidator } from '../utils/inputValidator';
import { AuthenticatedRoutes, AuthRoutes } from '../context/Routes';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    mail_id: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    const nameError = nameValidator(payload.mail_id);
    const passwordError = passwordValidator(payload.password);
    if (nameError) {
      newErrors.mail_id = "mail_id can't be empty.";
      isValid = false;
    }
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      dispatch(setLoading(true));
      const response = await loginUserWithUsername(payload);
      saveToken(response?.id, response?.token, "user");
      
      await Swal.fire({
        icon: "success",
        title: "Login Success",
        text: "You have logged in successfully",
        timer: 1500,
        showConfirmButton: false
      });
      
      navigate(AuthenticatedRoutes.DASHBOARD);
      window.location.reload();
    } catch (error) {
      console.log(error);
      Swal.fire({   
        icon: "error",
        title: "Login Failed",
        text: error?.response?.data.message || "Something went wrong!",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-6 rounded-lg">
        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-xl font-semibold text-white">XPFI-Coin<sup>®</sup></span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white">Sign in to your account</h2>
        
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded mb-4">
            {Object.values(errors).map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mail_id" className="block text-sm font-medium text-white mb-2">
              Email ID
            </label>
            <input
              type="text"
              id="mail_id"
              name="mail_id"
              placeholder="Enter your Email"
              value={payload.mail_id}
              onChange={handleChange}
              autoComplete="mail_id"
              className="w-full px-3 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                value={payload.password}
                onChange={handleChange}
                autoComplete="current-password"
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
          </div>
          
          <div className="flex items-center justify-between">
            {/* <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-white">
                Remember me
              </label>
            </div> */}
            <div>
              <div  onClick={() => navigate('/forgot-password')}  className="text-sm font-medium cursor-pointer text-blue-400 hover:text-blue-300">
                Forgot password?
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Sign in
          </button>
        </form>
        
        <div className="mt-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 px-4 rounded-md font-medium text-gray-300 bg-gray-100 bg-opacity-10 hover:bg-opacity-20 focus:outline-none"
          >
            Create Account
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-gray-300">
            Privacy policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;