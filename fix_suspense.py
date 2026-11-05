with open("src/App.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "{/* Detailed Submodule Overlay */}" in line:
        lines.insert(i+1, "      <React.Suspense fallback={<div className=\"fixed inset-0 z-[100] flex items-center justify-center bg-[#060A18]\"><div className=\"w-12 h-12 border-4 border-[#B5925A] border-t-transparent rounded-full animate-spin\"></div></div>}>\n")
        break

with open("src/App.tsx", "w") as f:
    f.writelines(lines)
