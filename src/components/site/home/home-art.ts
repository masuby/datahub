import type { StaticImageData } from "next/image";
import agentIcon from "@/assets/icons/agent.png";
import automationIcon from "@/assets/icons/automation.png";
import dashboardsIcon from "@/assets/icons/dashboards.png";
import processIcon from "@/assets/icons/process.png";
import securityIcon from "@/assets/icons/security.png";
import danielAvatar from "@/assets/team-avatars/daniel-masubi.png";
import kanudaAvatar from "@/assets/team-avatars/kanuda-sasi.png";
import yohanaAvatar from "@/assets/team-avatars/yohana-mussa.png";
import type { ServiceSlug } from "@/lib/service-slugs";

/*
 * The pictures of the home page's tiles (iteration-5 §D), all first-party
 * and served through next/image (AVIF/WebP).
 *
 * Icons: the owner's own 3D icons, their backgrounds removed: 384×384 RGBA
 * PNG in src/assets/icons/, placed by hand (no script makes them). The same
 * thing has the same icon wherever it has one: other pages take theirs from
 * here.
 * Avatars: one 540px square (from y = 105, centred on x = 370) of each
 * aligned team portrait in public/team/, 192×192, transparent background;
 * rebuilt by scripts/make-home-art.mjs.
 *
 * Decorative everywhere (alt=""): each tile's title says what it is.
 */

/** One 3D icon per service, by slug. */
export const SERVICE_ICON: Readonly<Record<ServiceSlug, StaticImageData>> = {
  dashboards: dashboardsIcon,
  automation: automationIcon,
  "ai-agents": agentIcon,
};

/** The home dashboards section's icon: the dashboards service's own. */
export const DASHBOARDS_ICON: StaticImageData = dashboardsIcon;

/** The reasons row: a notepad for the process, a shield for security. */
export const REASON_ICON = { process: processIcon, security: securityIcon } as const;

/** Team order as on /team: Daniel, Kanuda, Yohana (no implied hierarchy). */
export const TEAM_AVATARS: readonly StaticImageData[] = [danielAvatar, kanudaAvatar, yohanaAvatar];

/** liquid-glass-react 1.1.1 (the glass buttons' refraction), its LICENSE as shipped. */
export const LIQUID_GLASS_LICENSE = `MIT License

Copyright 2025 MAX ROVENSKY

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;

/**
 * @paper-design/shaders 0.0.81 (the liquid-metal mark and the hero's mesh
 * gradient): Apache-2.0, whose section 4(d) asks for the NOTICE file's text.
 */
export const PAPER_SHADERS_NOTICE = `Paper Shaders
Copyright 2026 Paper

Powered by Paper Shaders: https://shaders.paper.design

Licensed under the Apache License, Version 2.0 (https://www.apache.org/licenses/LICENSE-2.0). Modified by DataHub: the LiquidMetal stripe colours are uniforms set to the brand blues, and the logo maps are precomputed by scripts/make-metal-maps.mjs.`;
