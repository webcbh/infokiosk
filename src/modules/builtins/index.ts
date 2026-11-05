import { moduleRegistry } from "../ModuleRegistry";
import { diningPlugin } from "./diningPlugin";
import { spaPlugin } from "./spaPlugin";
import { dailyProgramPlugin } from "./dailyProgramPlugin";
import { golfPlugin } from "./golfPlugin";
import { interactiveMapPlugin } from "./interactiveMapPlugin";
import { weatherPlugin } from "./weatherPlugin";
import { loyaltyPlugin } from "./loyaltyPlugin";
import { suitesPlugin } from "./suitesPlugin";
import {
  directoryPlugin,
  weddingsPlugin,
  awardsPlugin,
  generalInfoPlugin,
  attractionsPlugin,
  airportPlugin,
  busRoutesPlugin,
} from "./otherBuiltins";
import { currencyConverterPlugin } from "./currencyConverterPlugin";
import { feedbackSurveyPlugin } from "./feedbackSurveyPlugin";

let initialized = false;

export function initializeBuiltinModules() {
  if (initialized) return;
  initialized = true;

  const builtins = [
    directoryPlugin,
    suitesPlugin,
    diningPlugin,
    dailyProgramPlugin,
    spaPlugin,
    loyaltyPlugin,
    golfPlugin,
    awardsPlugin,
    interactiveMapPlugin,
    weatherPlugin,
    generalInfoPlugin,
    weddingsPlugin,
    attractionsPlugin,
    airportPlugin,
    busRoutesPlugin,
    currencyConverterPlugin,
    feedbackSurveyPlugin,
  ];

  builtins.forEach((plugin) => {
    moduleRegistry.register(plugin);
  });
}
