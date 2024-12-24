import * as plugin from './plugin'
import { GenerateType } from './plugin/types';

(function main() {
  const options = { width: 700, height: 500 };
  figma.showUI(__html__, options);
  
  figma.on('run', async () => {
    await plugin.generate(GenerateType.SELECTED);
  })

})();
