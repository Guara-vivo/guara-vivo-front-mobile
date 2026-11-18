import { version } from '../../package.json'
import i18n from '../i18n'

// Versão do app. O JS é embutido no APK, então este número é o do APK instalado;
// package.json, app.config.js e build.gradle precisam ter o mesmo valor (conferido em teste
// e no workflow de release).
export const APP_VERSION: string = version

export function formatAppVersion(value: string = APP_VERSION): string {
	return i18n.t('common:version', { version: value })
}
