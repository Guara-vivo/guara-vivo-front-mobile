import { readFileSync } from 'fs'
import { join } from 'path'
import { APP_VERSION, formatAppVersion } from './appVersion'

function read(file: string) {
	return readFileSync(join(process.cwd(), file), 'utf8')
}

describe('appVersion', () => {
	it('formata a versão para exibição', () => {
		expect(formatAppVersion('1.2.3')).toBe('Versão 1.2.3')
	})

	it('usa uma versão no formato X.Y.Z', () => {
		expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
	})

	// O workflow de release também confere isso, mas aqui o erro aparece já no PR.
	it('package.json, app.config.js e build.gradle têm a mesma versão', () => {
		const config = read('app.config.js').match(/^\s*version:\s*'([^']+)'/m)?.[1]
		const gradle = read('android/app/build.gradle').match(/^\s*versionName\s+"([^"]+)"/m)?.[1]

		expect(config).toBe(APP_VERSION)
		expect(gradle).toBe(APP_VERSION)
	})
})
