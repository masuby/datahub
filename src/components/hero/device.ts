/**
 * What the device tells us about itself, where the browser reports it (spec
 * §4.4). Shared by the hero's two canvases: the silk (HeroMotion) never
 * mounts on either; the word writer (HeroWords) stays off under Save-Data
 * and runs its lite tier on a low-end device.
 */

type DeviceNavigator = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

/** The visitor asked to save data (`navigator.connection.saveData`). */
export function saveDataOn(): boolean {
  try {
    return (navigator as DeviceNavigator).connection?.saveData === true;
  } catch {
    return false;
  }
}

/** deviceMemory < 4 GB or fewer than 4 cores, where reported. */
export function lowEndDevice(): boolean {
  try {
    const nav = navigator as DeviceNavigator;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return true;
    return typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency < 4;
  } catch {
    return false;
  }
}
