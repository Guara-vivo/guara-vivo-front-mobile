import { commonStyles } from './common'
import { authStyles } from './auth'
import { homeStyles } from './home'
import { registerStyles } from './register'
import { mapsStyles } from './maps'
import { zonesStyles } from './zones'
import { historyStyles } from './history'
import { recordStyles } from './record'
import { profileStyles } from './profile'
import { settingsStyles } from './settings'
import { recordImageStyles } from './recordImage'

// Estilos organizados por assunto em arquivos separados; este objeto junta todos
// para que as telas continuem usando `appStyles.<nome>`.
export const appStyles = {
	...commonStyles,
	...authStyles,
	...homeStyles,
	...registerStyles,
	...mapsStyles,
	...zonesStyles,
	...historyStyles,
	...recordStyles,
	...profileStyles,
	...settingsStyles,
	...recordImageStyles,
}
