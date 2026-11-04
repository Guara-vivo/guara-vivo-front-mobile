import { Marker } from 'react-native-maps'

type Props = {
	latitude: number
	longitude: number
}

// Imagem estática (ponto azul, anel branco e halo, 56 dp, centrada): o Android corta marcadores
// feitos de View quando o bitmap é capturado menor que a view.
const userLocationImage = require('../../assets/images/user-location.png')

export function UserLocationMarker({ latitude, longitude }: Props) {
	return (
		<Marker
			coordinate={{ latitude, longitude }}
			anchor={{ x: 0.5, y: 0.5 }}
			image={userLocationImage}
			title="Sua localização"
			description="Localização atual"
		/>
	)
}
