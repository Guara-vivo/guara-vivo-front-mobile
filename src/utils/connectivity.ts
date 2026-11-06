type ConnectivityState = {
	isConnected: boolean | null
	isInternetReachable?: boolean | null
}

// Online = há conexão e a internet não foi dada como inalcançável (null = ainda não sabe: confia).
export function isOnlineState(state: ConnectivityState) {
	return Boolean(state.isConnected) && state.isInternetReachable !== false
}
