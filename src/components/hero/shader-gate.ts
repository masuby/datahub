import { frugalDevice } from "./device";

/**
 * May this device run the hero's WebGL shaders (the liquid-metal mark and
 * the mesh gradient)? Cheap checks first, so a phone that says no never
 * downloads the shader chunk or the metal maps:
 *
 *   - forced colours: the decoration is hidden anyway;
 *   - Save-Data or a low-end device (device.ts): the static mark, as for the
 *     silk canvas;
 *   - WebGL 2 with `failIfMajorPerformanceCaveat`, and a renderer that is
 *     not a software one (SwiftShader, llvmpipe, Microsoft Basic Render):
 *     a software rasteriser runs the shaders on the CPU — the case where
 *     they cost the battery most.
 *
 * Reduced motion is not a no: the shaders then draw one still frame.
 */
let probed: boolean | null = null;

function webgl2Usable(): boolean {
  if (probed !== null) return probed;
  probed = false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true, powerPreference: "low-power" });
    if (gl) {
      // The caveat flag is not enough on its own: a browser told to use a
      // software renderer (or one that falls back to it) may not report the
      // caveat. The renderer string names it where the browser exposes it.
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      probed = !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
      // Free the probe's context at once: browsers cap live contexts (~16).
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    probed = false;
  }
  return probed;
}

export function shadersAllowed(): boolean {
  try {
    if (window.matchMedia("(forced-colors: active)").matches) return false;
    if (frugalDevice()) return false;
    return webgl2Usable();
  } catch {
    return false;
  }
}

/** The mesh is a translucent wash behind text: none for readers who asked for less transparency. */
export function reducedTransparency(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
  } catch {
    return false;
  }
}
