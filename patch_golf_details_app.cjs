const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importGolfDetails = `import { InteractiveMapLayout } from "./components/InteractiveMapLayout";
import { GolfDetailsLayout } from "./components/GolfDetailsLayout";`;
code = code.replace(/import { InteractiveMapLayout } from "\.\/components\/InteractiveMapLayout";/, importGolfDetails);

const targetAppRender = `            ) : activeSubmodule.layout === "general_info" || activeSubmodule.title?.toLowerCase().includes("general info") ? (
              <GeneralInfoLayout module={activeSubmodule} onClose={goBack} onOpenSubmodule={openSubmodule} />`;
const replaceAppRender = `            ) : activeSubmodule.layout === "general_info" || activeSubmodule.title?.toLowerCase().includes("general info") ? (
              <GeneralInfoLayout module={activeSubmodule} onClose={goBack} onOpenSubmodule={openSubmodule} />
            ) : activeSubmodule.layout === "golfDetails" ? (
              <GolfDetailsLayout module={activeSubmodule} onClose={goBack} />`;
code = code.replace(targetAppRender, replaceAppRender);

fs.writeFileSync('src/App.tsx', code);
