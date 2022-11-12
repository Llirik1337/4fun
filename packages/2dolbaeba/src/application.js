/**
 * @callback ModuleType
 * @param {Application} app
 * @returns {Record<any,any>}
 */

/**
 * @typedef {Object} Application
 * @property {(module: ModuleType)=>void} register
 */

/**
 *
 * @returns {Application}
 */

export const createApplication = () => {
  const countAnonyms = 0;

  return new Proxy(
    {
      register(module) {
        const name = module.name || `anonym-${countAnonyms}`;
        console.log(name);
        this[name] = module(this);
      },
    },
    {
      get: (target, p, receiver) => {
        if (p === "register") {
          return Reflect.get(target, p, receiver);
        }
        return target[p];
      },
      // set: (target, p, newValue, receiver) => {
      //   if (target[p] === undefined) {
      //     Reflect.set(target, p, newValue, receiver);
      //   }
      //   return false;
      // },
    }
  );
};
