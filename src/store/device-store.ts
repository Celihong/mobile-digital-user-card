// stores/useDeviceStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UAParser } from "ua-parser-js";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

type DeviceInfo = {
  browser: string;
  os: string;
  device_name: string;
  device_type: string;
  fingerprint: string;
  device_model: string;
  ip_address: string | null; // optional if you fetch it later
};

type DeviceState = {
  device: DeviceInfo | null;
  fetchDeviceInfo: () => Promise<void>;
};

export const useDeviceStore = create<DeviceState>()(
  devtools((set) => ({
    device: null,

    fetchDeviceInfo: async () => {
      const parser = new UAParser();
      const result = parser.getResult();

      // Get fingerprint
      const fp = await FingerprintJS.load();
      const fingerprintResult = await fp.get();

      // Optional: fetch IP address (external service or backend)
      let ip_address: string | null = null;
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data: { ip: string } = await res.json();
        ip_address = data.ip;
      } catch (e) {
        console.error("Failed to get IP:", e);
      }

      const info: DeviceInfo = {
        browser: result.browser.name || "Unknown",
        os: result.os.name || "Unknown",
        device_type: result.device.type || "desktop",
        fingerprint: fingerprintResult.visitorId,
        device_name: result.device.vendor || "Unknown",
        device_model: result.device.model || "Unknown",
        ip_address,
      };

      set({ device: info });
    },
  }))
);
