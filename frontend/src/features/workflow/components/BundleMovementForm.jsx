import React, { useState } from 'react';
import { useLogBundleMovement } from '../hooks/useLogBundleMovement';

export default function BundleMovementForm({ bundle, onSuccessCallback }) {
  const [received, setReceived] = useState(bundle?.received || 0);
  const [output, setOutput] = useState('0');
  const [wastage, setWastage] = useState('0');
  const [loggedByEmployeeId, setLoggedByEmployeeId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { mutate: logMovement, isPending } = useLogBundleMovement();

  // Sirf positive numbers allow karne ka handler (minus sign block karega)
  const handlePositiveNumberChange = (setter) => (e) => {
    let rawVal = e.target.value;
    
    // Minus sign ya koi bhi non-digit character remove kar dein
    let cleanVal = rawVal.replace(/\D/g, '');
    
    setter(cleanVal);
    setValidationError('');
    setSuccessMessage('');
  };

  const handleSaveMovement = (e) => {
    e.preventDefault();
    if (isPending) return;

    setValidationError('');
    setSuccessMessage('');

    const bundleIdentifier = bundle?.id || bundle?.bundleCode || bundle?.bundleNumber;
    if (!bundleIdentifier) {
      setValidationError('Bundle ID or Code is missing.');
      return;
    }

    const movementData = {
      bundleId: bundleIdentifier,
      orderId: bundle?.orderId || bundle?.poNumber || bundle?.po_number,
      stageName: bundle?.currentStageName || bundle?.stageName || bundle?.stage_name || 'Material Allocation',
      stageOrder: bundle?.currentStageOrder || bundle?.stageOrder || bundle?.stage_order || 1,
      quantity_received: Number(received) || 0,
      quantity_output: Number(output) || 0,
      quantity_wastage: Number(wastage) || 0,
      logged_by_employee_id: Number(loggedByEmployeeId) || 0,
      remarks: remarks.trim(),
    };

    logMovement(movementData, {
      onSuccess: () => {
        setSuccessMessage("Movement logged successfully!");
        setTimeout(() => {
          if (onSuccessCallback) onSuccessCallback();
        }, 1200);
      },
      onError: (err) => {
        console.error("Failed to save movement:", err);
        setValidationError(err?.message || "Failed to save movement.");
      },
    });
  };

  return (
    <form onSubmit={handleSaveMovement} className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-lg">{bundle?.bundleCode || bundle?.bundleNumber || "Bundle Movement"}</h3>
          <p className="text-sm text-gray-500">
            Qty: {bundle?.qty || 28} · {bundle?.currentStageName || bundle?.stageName || "Material Allocation"}
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm font-medium">
          {successMessage}
        </div>
      )}

      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
          {validationError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Received</label>
          <input
            type="text"
            inputMode="numeric"
            value={received}
            onChange={handlePositiveNumberChange(setReceived)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
          <input
            type="text"
            inputMode="numeric"
            value={output}
            onChange={handlePositiveNumberChange(setOutput)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wastage</label>
          <input
            type="text"
            inputMode="numeric"
            value={wastage}
            onChange={handlePositiveNumberChange(setWastage)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logged by (employee ID)</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="e.g. emp-001"
            value={loggedByEmployeeId}
            onChange={handlePositiveNumberChange(setLoggedByEmployeeId)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
        <input
          type="text"
          placeholder="Optional note"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {isPending ? "Saving..." : "Save Movement"}
        </button>
      </div>
    </form>
  );
}