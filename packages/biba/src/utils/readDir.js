import { readdir } from "fs/promises";
import { join } from "path";

/**
 * Read dir
 * @param  {string} pathToDir
 * @return
 */
export const readDir = async (pathToDir) => {
	return readdir(pathToDir, {
		encoding: "utf8",
		withFileTypes: true,
	}).then((items) =>
		items.map((item) => ({ fullPath: join(pathToDir, item.name), item }))
	);
};
