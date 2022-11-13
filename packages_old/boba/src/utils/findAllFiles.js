import { readDir } from "./index.js";
/**
 * Find all files in dir by regexp
 * @param  {string} pathToDir path to dir
 * @param  {RegExp} regexp    regexp
 * @return {Promise<string[]>}
 */
export const findAllFiles = async (pathToDir, regexp = /.*/) => {
	const toPromise = [readDir(pathToDir)];

	const result = [];

	while (toPromise.length) {
		await Promise.all(toPromise).then((allFiles) => {
			toPromise.length = 0;
			return allFiles.flat().map(({ item, fullPath }) => {
				if (item.isFile() && regexp.test(fullPath)) {
					result.push(fullPath);
				} else if (item.isDirectory()) {
					toPromise.push(readDir(fullPath));
				}
			});
		});
	}

	return result;
};
