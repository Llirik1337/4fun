import fs from "fs/promises";
/**
 * Read file as string
 * @param  {string} pathToFile
 * @return
 */
export const readFile = async (pathToFile) => {
	return fs.readFile(pathToFile, {
		encoding: "utf8",
	});
};
