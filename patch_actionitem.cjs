const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetActionMap = `<ActionItem
                  key={act.id}
                  icon={<DynamicIcon name={act.icon} />}
                  title={act.title}
                  subtitle={act.subtitle}`;
const replacementActionMap = `<ActionItem
                  key={act.id}
                  icon={<DynamicIcon name={act.icon} />}
                  title={act.title}
                  subtitle={act.subtitle}
                  pulseGlow={act.title.toLowerCase().includes("check-in")}`;

code = code.replace(targetActionMap, replacementActionMap);

const targetActionItem = `function ActionItem({
  icon,
  title,
  subtitle,
  ...props
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  [key: string]: any;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      {...props}
      className="w-full bg-[#08183A] rounded-xl px-6 py-5 flex items-center justify-between hover:bg-[#08183A]/90 transition-colors group shadow-md"
    >
      <div className="flex items-center gap-4 text-white">`;

const replacementActionItem = `function ActionItem({
  icon,
  title,
  subtitle,
  pulseGlow,
  ...props
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  pulseGlow?: boolean;
  [key: string]: any;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      animate={
        pulseGlow
          ? {
              boxShadow: [
                "0px 0px 0px rgba(217,182,115,0)",
                "0px 0px 20px rgba(217,182,115,0.4)",
                "0px 0px 0px rgba(217,182,115,0)",
              ],
            }
          : {}
      }
      transition={
        pulseGlow
          ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
          : {}
      }
      {...props}
      className={\`w-full bg-[#08183A] rounded-xl px-6 py-5 flex items-center justify-between transition-colors group shadow-md relative overflow-hidden \${pulseGlow ? 'border-2 border-[#D9B673]/60' : 'hover:bg-[#08183A]/90'}\`}
    >
      {pulseGlow && (
        <div className="absolute inset-0 bg-[#D9B673]/5 animate-pulse z-0 pointer-events-none"></div>
      )}
      <div className="flex items-center gap-4 text-white relative z-10">`;

code = code.replace(targetActionItem, replacementActionItem);

fs.writeFileSync('src/App.tsx', code);
