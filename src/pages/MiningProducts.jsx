import { useEffect, useState } from "react";
import {
  getProductLists,
  getProductPurchaseHistory,
  purchaseProduct,
} from "../api/product-api";
import MinersPurchaseHistory from "../components/MinersPurchaseHistory";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/slice/loadingSlice";
import Swal from "sweetalert2";
import { tokenOptions } from "../utils/tokenOptions";
import { toast } from "react-toastify";
import scanGIF from "../assets/users/scan-gif.gif";
import { X, Zap, DollarSign, TrendingUp, Clock } from "lucide-react";
import { MainContent } from "../context/MainContent";
import USDTPaymentMain from "../components/wallet/USDTPaymentMain";

// Skeleton Loader for Product Card
const ProductSkeleton = () => (
  <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden animate-pulse">
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 p-6">
      <div className="w-full h-48 bg-slate-700 rounded-xl mb-2"></div>
      <div className="absolute top-2 right-2 bg-blue-600/60 text-white px-3 py-1 rounded-full text-xs font-semibold w-20 h-6"></div>
    </div>
    <div className="p-6 space-y-4">
      <div>
        <div className="h-6 bg-slate-700 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-full"></div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
          <div className="h-4 w-20 bg-slate-700 rounded"></div>
          <div className="h-4 w-16 bg-slate-700 rounded"></div>
        </div>
        <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
          <div className="h-4 w-20 bg-slate-700 rounded"></div>
          <div className="h-4 w-16 bg-slate-700 rounded"></div>
        </div>
      </div>
      <div className="w-full h-10 bg-slate-700 rounded-xl"></div>
    </div>
  </div>
);

const MiningProducts = ({ className }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [showScaning, setShowScaning] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payload, setPayload] = useState({
    investment: 0.0,
    token: "",
    minerId: "",
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoadingState] = useState(true); // <-- Add loading state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [walletType, setWalletType] = useState(null);


  const fetchHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getProductPurchaseHistory();
      const filterData = response?.data?.reverse()
      setHistory(filterData);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      setLoadingState(true); // <-- Set loading true
      const response = await getProductLists();
      setProducts(response?.data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
      setLoadingState(false); // <-- Set loading false
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const ScanWindowPopup = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="text-center">
            <img src={scanGIF} alt="Scanning..." className="w-32 h-32 mx-auto mb-4 rounded-lg" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">Scanning Device...</h3>
            <p className="text-slate-400">Please wait while we verify your device compatibility</p>
          </div>
        </div>
      </div>
    );
  };

  const handleClick = async (data) => {
    if (data?.minerType == "default") {
      setShowScaning(true);
      document.body.style.overflow =
        document.body.style.overflow === "hidden" ? "" : "hidden";
      return setTimeout(() => {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: "Your Device is not capable to buy this plan",
          timer: 2000,
        });
        setShowScaning(false);
        document.body.style.overflow = "";
      }, 5000);
    } else {
      setSelectedPlan(data);
      setShowInputModal(true);
    }
  };

  const sendPurchaseRequest = async () => {
    try {
      dispatch(setLoading(true));
      const response = await purchaseProduct({
        ...payload,
        minerId: selectedPlan?._id,
      });
      fetchHistory();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text:
          response?.data?.message ||
          "Your investment has been successfully processed!",
        timer: 3000,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error?.response?.data?.message || "Something went wrong!",
        timer: 3000,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const setInputDataHandler = () => {
    if (!payload?.investment || !payload?.token) {
      return toast.error("Please fill all the required fields!");
    }
    if (payload?.investment < 100 || payload?.investment > 100000) {
      return toast.error("Investment amount must be between 100 and 100000 USDT");
    }
    setShowInputModal(false);
    setShowPaymentModal(false);
    sendPurchaseRequest();
  };


  return (
    <>
      {showScaning && <ScanWindowPopup />}
      {/* Investment Modal */}
      {showInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-200">Investment Details</h3>
                <button
                  onClick={() => setShowInputModal(false)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Investment Amount
                  </label>
                  <input
                    type="number"
                    value={payload?.investment}
                    onChange={(e) => {
                      const { value } = e.target;
                      setPayload((prev) => ({
                        ...prev,
                        investment: value,
                      }));
                    }}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter amount"
                  />
                  {selectedPlan && (
                    <p className="text-xs text-slate-400 mt-1">
                      Range: {selectedPlan?.min} - {selectedPlan?.max} USDT
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Token
                  </label>
                  <select
                    value={payload?.token}
                    onChange={(e) => {
                      setPayload((prev) => ({
                        ...prev,
                        token: e.target.value,
                      }));
                    }}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Token</option>
                    {tokenOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  Invest Now
                </button>
                <button
                  onClick={() => setShowInputModal(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 ${className ? className : ""}`}>
        {/* Header Section */}
        <div className="px-6 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              Mining Products
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Choose from our premium mining plans and start earning cryptocurrency today
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={i} />)
              : products?.map((product, index) => (
                <div
                  key={index}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 p-6">
                    <img
                      src={product?.image}
                      alt={product?.minerName}
                      className="w-full h-96 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Premium
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-200 mb-2 group-hover:text-blue-300 transition-colors">
                        {product?.minerName}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {product?.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <DollarSign size={16} className="text-green-400" />
                          <span className="text-slate-300 text-sm">Investment</span>
                        </div>
                        <span className="text-green-400 font-semibold">
                          {product?.investment} USDT
                        </span>
                      </div>

                      <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <TrendingUp size={16} className="text-blue-400" />
                          <span className="text-slate-300 text-sm">Daily Earning</span>
                        </div>
                        <span className="text-blue-400 font-semibold">
                          {product?.dailyEarning}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleClick(product)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center space-x-2"
                    >
                      <Zap size={18} />
                      <span>Invest Now</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {!loading && products?.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-12 max-w-md mx-auto">
                <Clock size={48} className="text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  No Products Available
                </h3>
                <p className="text-slate-500">
                  Mining products will appear here when available.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Purchase History Section */}
        <MinersPurchaseHistory
          className={className}
          fetchData={history}
          fetchDataHandler={fetchHistory}
        />
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-900/95 w-full max-w-md mx-4 rounded-2xl border border-slate-700/50 shadow-2xl">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-6">
                  <img src={MainContent.appLogo} alt="App Logo" className="w-full h-full object-contain" />
                </div>
                <USDTPaymentMain
                  amount={payload?.investment}
                  walletType={walletType}
                  onSuccess={setInputDataHandler}
                  onFailure={() => setShowPaymentModal(false)}
                />
                <div className="mt-6 w-full">
                  <button
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MiningProducts;