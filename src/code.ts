import * as plugin from './utils/plugin';


(function main() {
  const options = { width: 700, height: 500 };
  figma.showUI(__html__, options);
  
  figma.on('run', async () => {
    // await plugin.showCode();
  })

})();
