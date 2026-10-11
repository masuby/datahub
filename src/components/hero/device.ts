/**
 * What the device tells us about itself, where the browser reports it (spec
 * §4.4). Shared by everything alive in the hero: on either, the silk
 * (HeroMotion) never mounts — and with it the lights and twinkling dots it
 * draws — and the mark's loops (the wave, the D's breathing glow, the light
 * along it: HeroLive, HeroComet) hold still; the word writer (HeroWords)
 * stays off under Save-Data and runs its lite tier on a low-end device.
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

/** Save-Data or a low-end device: the hero keeps its decoration still. */
export function frugalDevice(): boolean {
  return saveDataOn() || lowEndDevice();
}
