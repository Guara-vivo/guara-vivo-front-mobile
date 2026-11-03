import { StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { colors, spacing } from '../constants/theme'
import { cornerRadius } from './shared'

export const zonesStyles = StyleSheet.create<Record<string, any>>({
	mapZoneInfoHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: spacing.md,
	},
	mapZoneInfoHeaderActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.sm,
	},
	mapZoneInfoEyebrow: {
		color: colors.muted,
		fontSize: 10,
		textTransform: 'uppercase',
	},
	mapZoneInfoTitle: {
		color: colors.secondary,
		fontSize: 16,
	},
	mapZoneInfoType: {
		color: colors.muted,
		fontSize: 12,
	},
	mapZoneInfoCloseButton: {
		width: 30,
		height: 30,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.secondary,
	},
	mapZoneInfoDeleteIconButton: {
		width: 30,
		height: 30,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.primary,
	},
	mapZoneInfoGrid: {
		flexDirection: 'row',
		gap: spacing.sm,
	},
	mapZoneInfoMetric: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 10,
		borderRadius: cornerRadius,
		backgroundColor: colors.splash,
	},
	mapZoneInfoLabel: {
		color: colors.muted,
		fontSize: 10,
		textTransform: 'uppercase',
	},
	mapZoneInfoValue: {
		color: colors.text,
		fontSize: 13,
	},
	mapZoneInfoCoordinates: {
		color: colors.muted,
		fontSize: 11,
	},
	mapZoneRecordsSection: {
		gap: spacing.xs,
	},
	mapZoneRecordsHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	mapZoneRecordsCount: {
		color: colors.secondary,
		fontSize: 13,
		fontWeight: '900',
	},
	mapZoneRecordsStatusRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: spacing.xs,
		paddingVertical: 6,
	},
	mapZoneRecordsStatusText: {
		color: colors.muted,
		fontSize: 12,
	},
	mapZoneRecordsErrorText: {
		color: colors.primary,
		fontSize: 12,
	},
	mapZoneRecordRow: {
		minHeight: 90,
		paddingVertical: 8,
		paddingLeft: 14,
		paddingRight: 10,
		borderRadius: cornerRadius,
		backgroundColor: '#F3F7FF',
		borderWidth: 1,
		borderColor: 'transparent',
		marginBottom: 6,
		overflow: 'hidden',
	},
	mapZoneRecordFocusAccent: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: 4,
		backgroundColor: colors.secondary,
	},
	mapZoneRecordMainRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: spacing.sm,
	},
	mapZoneRecordId: {
		color: colors.secondary,
		fontSize: 12,
		fontWeight: '900',
	},
	mapZoneRecordDate: {
		color: colors.text,
		fontSize: 11,
	},
	mapZoneRecordAuthor: {
		color: colors.text,
		fontSize: 12,
		marginTop: 2,
	},
	mapZoneRecordMeta: {
		color: colors.muted,
		fontSize: 11,
		marginTop: 2,
	},
	mapZoneRecordDetailsButton: {
		alignSelf: 'flex-end',
		marginTop: 6,
		paddingHorizontal: 9,
		paddingVertical: 5,
		borderRadius: 999,
		backgroundColor: colors.secondary,
	},
	mapZoneRecordDetailsButtonText: {
		color: colors.surface,
		fontSize: 9,
	},
	zoneErrorBanner: {
		marginHorizontal: spacing.md,
		marginVertical: spacing.sm,
		padding: spacing.md,
		backgroundColor: '#FFEBEE',
		borderRadius: cornerRadius,
		borderLeftWidth: 4,
		borderLeftColor: '#E53935',
	},
	zoneErrorText: {
		color: '#C62828',
		fontSize: 13,
	},
	zoneBottomSheetBackground: {
		backgroundColor: colors.surface,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	} as ViewStyle,
	zoneBottomSheetIndicator: {
		backgroundColor: colors.border,
		width: 42,
	} as ViewStyle,
	zoneBottomSheetContent: {
		paddingHorizontal: spacing.lg,
		paddingTop: spacing.sm,
		paddingBottom: spacing.xl,
	} as ViewStyle,
	zoneModalTitle: {
		fontSize: 18,
		color: colors.text,
		marginBottom: spacing.lg,
		textAlign: 'center',
	} as TextStyle,
	zoneDeleteConfirmText: {
		color: colors.muted,
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center',
		marginBottom: spacing.lg,
	} as TextStyle,
	zoneModalLabel: {
		fontSize: 13,
		color: colors.text,
		marginTop: spacing.md,
		marginBottom: spacing.sm,
	} as TextStyle,
	zoneSelectContainer: {
		marginBottom: spacing.lg,
	} as ViewStyle,
	zonePickerContainer: {
		minHeight: 52,
		borderRadius: cornerRadius,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
		overflow: 'hidden',
	} as ViewStyle,
	zonePicker: {
		color: colors.text,
		backgroundColor: colors.surface,
	} as ViewStyle,
	zoneSlider: {
		height: 40,
		marginVertical: spacing.md,
	} as ViewStyle,
	zoneModalButtonContainer: {
		flexDirection: 'row',
		gap: spacing.md,
		marginTop: spacing.lg,
	} as ViewStyle,
	zoneModalCancelButton: {
		flex: 1,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.md,
		borderRadius: cornerRadius,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.primary,
	} as ViewStyle,
	zoneModalCancelButtonText: {
		fontSize: 14,
		color: colors.surface,
	} as TextStyle,
	zoneModalConfirmButton: {
		flex: 1,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.md,
		borderRadius: cornerRadius,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.secondary,
	} as ViewStyle,
	zoneModalConfirmButtonText: {
		fontSize: 14,
		color: colors.surface,
	} as TextStyle,
	zoneDeleteConfirmButton: {
		flex: 1,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.md,
		borderRadius: cornerRadius,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.primary,
	} as ViewStyle,
	zoneDeleteConfirmButtonText: {
		fontSize: 14,
		color: colors.surface,
	} as TextStyle,
	zoneDeleteConfirmCancelButton: {
		flex: 1,
		paddingVertical: spacing.md,
		paddingHorizontal: spacing.md,
		borderRadius: cornerRadius,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.secondary,
	} as ViewStyle,
	zoneModalDisabled: {
		opacity: 0.6,
	} as ViewStyle,
	zoneModalConfirmButtonDisabled: {
		opacity: 0.6,
	} as ViewStyle,
})
