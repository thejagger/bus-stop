import type { Device } from '$lib/schemas/device';

const STORAGE_KEY = 'bus-stop-devices';

/**
 * Retrieve all devices from localStorage
 * Returns an empty array if no devices are stored or if localStorage is unavailable
 */
export function getStoredDevices(): Device[] {
	if (typeof window === 'undefined') {
		return [];
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) {
			return [];
		}
		return JSON.parse(stored) as Device[];
	} catch (error) {
		console.error('Error reading devices from localStorage:', error);
		return [];
	}
}

/**
 * Add a device to localStorage
 * If a device with the same MAC address exists, it will be updated
 * Otherwise, the device will be added to the array
 */
export function addDeviceToStorage(device: Device): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		const devices = getStoredDevices();
		const existingIndex = devices.findIndex((d) => d.mac === device.mac);

		if (existingIndex >= 0) {
			// Update existing device
			devices[existingIndex] = device;
		} else {
			// Add new device
			devices.push(device);
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
	} catch (error) {
		console.error('Error saving device to localStorage:', error);
	}
}

/**
 * Remove a device from localStorage by MAC address
 */
export function removeDeviceFromStorage(mac: string): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		const devices = getStoredDevices();
		const filtered = devices.filter((d) => d.mac !== mac);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
	} catch (error) {
		console.error('Error removing device from localStorage:', error);
	}
}

/**
 * Check if a device exists in localStorage by MAC address
 */
export function hasDeviceInStorage(mac: string): boolean {
	if (typeof window === 'undefined') {
		return false;
	}

	const devices = getStoredDevices();
	return devices.some((d) => d.mac === mac);
}
