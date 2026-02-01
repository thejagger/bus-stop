'use client';

import { X } from 'lucide-react';

interface DeviceSetupModalProps {
  deviceInfo: {
    mac: string;
    secret: string;
  };
  onSetup: () => void;
  onClose: () => void;
}

export default function DeviceSetupModal({
  deviceInfo,
  onSetup,
  onClose,
}: DeviceSetupModalProps) {
  const handleSetup = () => {
    onSetup();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-zinc-900 border border-white/20 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Device Setup
            </h2>
            <p className="text-white/70 text-sm">
              A new device has been detected. Please complete the setup to continue.
            </p>
          </div>

          {/* Device Information */}
          <div className="space-y-3 bg-zinc-800/50 rounded-lg p-4 border border-white/10">
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wide">
                MAC Address
              </label>
              <p className="text-white font-mono text-sm mt-1 break-all">
                {deviceInfo.mac}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wide">
                Secret ID
              </label>
              <p className="text-white font-mono text-sm mt-1 break-all">
                {deviceInfo.secret}
              </p>
            </div>
          </div>

          {/* Setup Button */}
          <button
            onClick={handleSetup}
            className="w-full py-3 px-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );
}
