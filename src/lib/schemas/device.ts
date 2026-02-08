import { z } from 'zod';

/**
 * Schema for a single device configuration item
 * Each item represents a stop-route pair that the device should display
 */
export const DeviceConfigItemSchema = z.object({
	stopId: z.string().min(1, 'Stop ID is required'),
	routeId: z.string().min(1, 'Route ID is required'),
});

/**
 * Schema for device configuration array
 * Can be empty (for newly added devices)
 */
export const DeviceConfigSchema = z.array(DeviceConfigItemSchema).default([]);

/**
 * Schema for a complete device record
 */
export const DeviceSchema = z.object({
	mac: z.string().min(1, 'MAC address is required'),
	secret: z.string().min(1, 'Secret is required'),
	config: DeviceConfigSchema,
	updated_at: z.string().datetime().optional(),
});

/**
 * Type exports for use in TypeScript
 */
export type DeviceConfigItem = z.infer<typeof DeviceConfigItemSchema>;
export type DeviceConfig = z.infer<typeof DeviceConfigSchema>;
export type Device = z.infer<typeof DeviceSchema>;
