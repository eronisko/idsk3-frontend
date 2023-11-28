import { mkdir, writeFile } from 'fs/promises'
import { dirname, join, parse } from 'path'

import config from '@govuk-frontend/config'
import cpy from 'cpy'
import slash from 'slash'

/**
 * Write `packages/govuk-frontend/package.json` version to file
 *
 * @param {AssetEntry[0]} assetPath - File path to asset
 * @param {Pick<AssetEntry[1], "destPath">} options - Asset options
 */
export async function version(assetPath, options) {
  await write(assetPath, {
    ...options,

    // Add package version
    async fileContents() {
      return config.version
    }
  })
}

/**
 * Write file task
 *
 * @param {AssetEntry[0]} assetPath - File path to asset
 * @param {Pick<AssetEntry[1], "destPath" | "filePath" | "fileContents">} options - Asset options
 */
export async function write(assetPath, { destPath, filePath, fileContents }) {
  const assetDestPath = join(
    destPath,
    filePath ? filePath(parse(assetPath)) : assetPath
  )

  if (!destPath || !fileContents) {
    throw new Error("Options 'destPath' and 'fileContents' required")
  }

  await mkdir(dirname(assetDestPath), { recursive: true })
  await writeFile(assetDestPath, `${await fileContents()}\n`)
}

/**
 * Copy files task
 * Copies files to destination
 *
 * @param {string} pattern - Minimatch pattern
 * @param {Pick<AssetEntry[1], "srcPath" | "destPath">} options - Asset options
 */
export async function copy(pattern, { srcPath, destPath }) {
  await cpy([slash(join(srcPath, pattern))], destPath, { cwd: srcPath })
}

/**
 * @typedef {import('./assets.mjs').AssetEntry} AssetEntry
 */
