# Design and motion references

The public interface uses original components and project-specific art direction. These references informed interaction patterns and implementation choices; no complete template was copied.

- [Higgsfield](https://higgsfield.ai/) — reference for cinematic pacing, oversized typography, dense visual fields, and modular creative-workspace presentation.
- [Motion for React scroll animation guide](https://motion.dev/docs/react-scroll-animations) — implementation reference for scroll-linked and in-view animation APIs.
- [Motion](https://github.com/motiondivision/motion) — animation dependency and public source repository.
- [Magic UI](https://github.com/magicuidesign/magicui) — MIT-licensed reference library for reusable motion-component patterns. The site implements its own project-specific components rather than importing its visual effects wholesale.

Animations are transform- and opacity-led, respect `prefers-reduced-motion`, and avoid blocking access to content or controls.
