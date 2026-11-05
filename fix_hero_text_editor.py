with open("src/AdminDashboard.tsx", "r") as f:
    content = f.read()

editor = """
function HeroTextEditor({
  label,
  textKey,
  defaultText,
  heroTexts,
  onChange,
}: {
  label: string;
  textKey: string;
  defaultText: string;
  heroTexts: any;
  onChange: (val: any) => void;
}) {
  const texts = heroTexts || {};
  const isEnabled = texts[`${textKey}Enabled`] !== false;

  return (
    <div className="border border-neutral-200 rounded p-4 bg-[#FAFAFA] shadow-sm mb-3">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-medium text-sm text-neutral-800">{label}</h5>
        <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
          <input 
            type="checkbox" 
            checked={isEnabled} 
            onChange={(e) => onChange({ ...texts, [`${textKey}Enabled`]: e.target.checked })}
            className="accent-blue-600"
          />
          Enabled
        </label>
      </div>
      {isEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-neutral-500 mb-1">Text Content</label>
            <input 
              type="text" 
              value={texts[textKey] ?? defaultText} 
              onChange={(e) => onChange({ ...texts, [textKey]: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-1">Color (Hex/RGBA)</label>
            <input 
              type="text" 
              value={texts[`${textKey}Color`] ?? ""} 
              onChange={(e) => onChange({ ...texts, [`${textKey}Color`]: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Default"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-1">Font Size (Tailwind class or px)</label>
            <input 
              type="text" 
              value={texts[`${textKey}Size`] ?? ""} 
              onChange={(e) => onChange({ ...texts, [`${textKey}Size`]: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Default"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-neutral-500 mb-1">Font Family (Tailwind class or CSS)</label>
            <input 
              type="text" 
              value={texts[`${textKey}FontFamily`] ?? ""} 
              onChange={(e) => onChange({ ...texts, [`${textKey}FontFamily`]: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Default"
            />
          </div>
        </div>
      )}
    </div>
  );
}
"""

content = content.replace("export default function AdminDashboard()", editor + "\nexport default function AdminDashboard()")

with open("src/AdminDashboard.tsx", "w") as f:
    f.write(content)
