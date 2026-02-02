'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import dynamic from 'next/dynamic';
import NavigationBar from '@/components/NavigationBar';
import DeviceSetupModal from '@/components/DeviceSetupModal';

// Dynamically import map component to avoid SSR issues
const DynamicMap = dynamic(() => import('@/components/MapComponent'), {
    ssr: false,
});

export default function SetupPage() {
    const searchParams = useSearchParams();
    const macAddress = searchParams.get('mac');
    const secretId = searchParams.get('id');

    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState<{ mac: string; secret: string } | null>(null);

    useEffect(() => {
        if (macAddress && secretId) {
            // Check if device exists in localStorage
            const storedDevices = localStorage.getItem('devices');
            const devices = storedDevices ? JSON.parse(storedDevices) : [];

            const deviceExists = devices.some(
                (device: { mac: string; secret: string }) =>
                    device.mac === macAddress && device.secret === secretId
            );

            if (!deviceExists) {
                setDeviceInfo({mac: macAddress, secret: secretId});
                setShowDeviceModal(true);
            }
        }
    }, [macAddress, secretId]);

    const handleSetupComplete = () => {
        if (deviceInfo) {
            // Store device in localStorage
            const storedDevices = localStorage.getItem('devices');
            const devices = storedDevices ? JSON.parse(storedDevices) : [];

            if (!devices.some((d: { mac: string; secret: string }) => d.mac === deviceInfo.mac)) {
                devices.push(deviceInfo);
                localStorage.setItem('devices', JSON.stringify(devices));
            }

            setShowDeviceModal(false);
        }
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <DynamicMap/>
            <NavigationBar/>
            {showDeviceModal && deviceInfo && (
                <DeviceSetupModal
                    deviceInfo={deviceInfo}
                    onSetup={handleSetupComplete}
                    onClose={() => setShowDeviceModal(false)}
                />
            )}
        </div>
    );
}
