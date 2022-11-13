import vm from "vm";

/**
 * Compile function
 * @param  {string} functionBody
 * @param  {any[]} params
 * @param  {import('vm').Context} context
 * @return
 */
export const compileFunction = (functionBody, params, context) =>
	vm.compileFunction(functionBody, params, {
		parsingContext: context,
	});
