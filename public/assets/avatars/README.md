# Rigged avatar assets

No character GLB is included with this project. To connect a licensed or user-provided model:

1. Place the real `.glb` file under `public/assets/avatars/`.
2. Set `VITE_AVATAR_GLB_URL=/assets/avatars/<your-file>.glb` in the app environment.
3. Use a humanoid GLB with at least one `SkinnedMesh` and skeleton. Optional motion clips are matched by names containing `idle`, `walk`, `meditat`/`sit`, and `tea`/`cup`/`drink`/`raise`.
4. Name materials or nodes with `skin`/`body`/`face`, `cloth`/`robe`/`outfit`, and `hair` to opt into appearance color updates.

The application validates model and clip availability at load time. A mesh without a skeleton is reported as unrigged and is not presented as an animation-ready character. The current procedural preview is only a local customization demo, not a rigged or photorealistic model.
