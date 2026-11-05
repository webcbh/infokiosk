perl -pi -e 's/newModules\[editingMainModuleIdx\]\.submodules\.push\(newSub\);/newModules\[editingMainModuleIdx\] = \{ \.\.\.newModules\[editingMainModuleIdx\], submodules: \[\.\.\.\(newModules\[editingMainModuleIdx\]\.submodules \|\| \[\]\), newSub\] \};/g' src/AdminDashboard.tsx

perl -pi -e 's/\]\.submodules\.push\(newSub\);/\] = \{ \.\.\.newModules\[editingMainModuleIdx\], submodules: \[\.\.\.\(newModules\[editingMainModuleIdx\]\.submodules \|\| \[\]\), newSub\] \};/g' src/AdminDashboard.tsx
