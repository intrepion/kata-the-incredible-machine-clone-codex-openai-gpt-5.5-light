# Render Physics Through Canvas

The game will render Matter.js bodies through a single Canvas layer rather than representing physical objects as DOM elements. Canvas keeps the visual board aligned with the physics world and avoids the misleading split where DOM objects appear interactive but do not reflect real collision state.

