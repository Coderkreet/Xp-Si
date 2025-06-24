import React, { useEffect, useState, useMemo } from 'react';
import { getAdminWithdrawalHistory, updateWithdrawalStatus } from '../api/admin-api';
import { formatDateTime, maskTwoLetters } from '../utils/additonalFunc';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  User,
  Hash,
  Activity,
  DollarSign,
  Wallet,
  CircleDollarSign
} from 'lucide-react';
import { IoCloseCircle } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { setLoading } from '../redux/slice/loadingSlice';
import Swal from 'sweetalert2';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import QRCode from 'react-qr-code';

const WithdrawalHistory = () => {
  const dispatch = useDispatch();
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchWithdrawalHistory();
  }, []);

  const fetchWithdrawalHistory = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAdminWithdrawalHistory();
      if (response.success) {
        setWithdrawalHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      Swal.fire({
        title: `Are you sure you want to mark this withdrawal as ${status}?`,
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "No, cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(setLoading(true));
          const response = await updateWithdrawalStatus(id, status);
          console.log(response)
          if (response.success) {
            Swal.fire({
              title: "Success!",
              text: response.message || `Withdrawal marked as ${status}.`,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              fetchWithdrawalHistory();
            });
          } else {
            Swal.fire({
              title: "Failed!",
              text: response.message || "Unable to update withdrawal status.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating the status.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const serialNumberTemplate = (rowData, options) => {
    return <span>{options.rowIndex + 1}</span>;
  };

  const handleViewHandler = (rowData) => {
    return (
      <div className='px-2 py-1 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors'
        onClick={() => {
          setRowData(rowData);
          setShowDetails(true);
        }}
      >
        View
      </div>
    )
  }

  // Copy wallet address to clipboard
  const handleCopyAddress = (address) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      Swal.fire({
        title: "Copied!",
        text: "Wallet address copied to clipboard.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
          Withdrawal History
        </h2>
        <p className="text-slate-400">Track all withdrawal transactions across users</p>
      </div>

      {/* Controls */}
      {/* ...controls code omitted for brevity... */}

      {/* Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
        {/* ...table code omitted for brevity... */}
        <div className="w-full">
          <DataTable
            value={withdrawalHistory}
            className="w-full rounded-xl shadow-md border border-gray-700 bg-gray-800"
            size="small"
            paginator
            rows={15}
            rowsPerPageOptions={[5, 10, 25, 50]}
            stripedRows
            showGridlines
          >
            <Column header="S No." body={serialNumberTemplate} />

            <Column
              header="Name"
              field="userId.name"
              sortable
              filter
            />
            <Column
              header="Email"
              field="userId.email"
              filter
              sortable
            />
            <Column
              header="Number"
              field="userId.mobile"
            />
            <Column
              header="Wallet Address"
              field="clientAddress"
              body={(rowData) => {
                return maskTwoLetters(rowData.clientAddress);
              }}
            />
            <Column
              header="Amount ($)"
              field="amount"
            />
            <Column
              header="Status"
              field="status"
              body={(rowData) => {
                return (
                  <span className={`px-2 py-1 rounded-md text-sm font-semibold ${rowData.status === 'Pending' ? 'bg-yellow-500 text-white' : rowData.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {rowData.status}
                  </span>
                );
              }}
            />
            <Column
              header="Date"
              field="createdAt"
              body={(rowData) => {
                return rowData.createdAt
                  ? new Date(rowData.createdAt).toUTCString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true // optional: use false for 24-hour format
                  })
                  : '';
              }}
              sortable
            />
            <Column
              header="Action"
              body={handleViewHandler}
            />

          </DataTable>
        </div>

      </div>

      {/* Details Modal */}
      {showDetails && rowData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl space-y-4 scale-90 md:scale-100">
            {/* Header */}
            <div className="flex flex-row justify-between items-center rounded-lg shadow-lg p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Withdrawal Details
              </h3>
              <div
                className="text-red-500 cursor-pointer mt-2 sm:mt-0"
                onClick={() => {
                  setShowDetails(false);
                  setRowData(null);
                }}
              >
                <IoCloseCircle size={24} />
              </div>
            </div>

            {/* Body */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="space-y-4 text-sm sm:text-base break-words">
                <p><strong>Name:</strong> {rowData.userId.name}</p>
                <p><strong>Email:</strong> {rowData.userId.email}</p>
                <p><strong>Mobile:</strong> {rowData.userId.mobile}</p>
                <p><strong>Amount:</strong> ${rowData.amount}</p>
                <p><strong>Wallet Address:</strong> {rowData.clientAddress}</p>
                <p><strong>Status:</strong> {rowData.status}</p>
                <p>
                  <strong>Date & Time:</strong>{' '}
                  {new Date(rowData.createdAt).toUTCString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>

                {/* QR Code */}
                <div className="space-y-2">
                  <h4 className="text-base font-semibold">Wallet Address QR:</h4>
                  <QRCode
                    size={200}
                    value={rowData.clientAddress}
                    viewBox="0 0 256 256"
                    className="mx-auto"
                  />
                </div>

                {/* Action Buttons */}
                {rowData.status === 'Pending' && (
                  <div className="w-full flex flex-wrap gap-3 pt-2">
                    <button
                      className="flex-1 min-w-[100px] px-4 py-2 bg-blue-500 rounded-md text-white text-sm"
                      onClick={() => handleCopyAddress(rowData.clientAddress)}
                    >
                      Copy Address
                    </button>
                    <button className="flex-1 min-w-[100px] px-4 py-2 bg-green-500 rounded-md text-white text-sm"
                      onClick={() => handleUpdateStatus(rowData._id, 'Completed')}
                    >
                      Approve
                    </button>
                    <button className="flex-1 min-w-[100px] px-4 py-2 bg-red-500 rounded-md text-white text-sm"
                      onClick={() => handleUpdateStatus(rowData._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;
