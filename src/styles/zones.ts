import { StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { colors, spacing, fontSize, radius } from '../constants/theme'
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
		fontSize: fontSize.caption,
		textTransform: 'uppercase',
	},
	mapZoneInfoTitle: {
		color: colors.secondary,
		fontSize: fontSize.bodyLarge,
	},
	mapZoneInfoType: {
		color: colors.muted,
		fontSize: fontSize.caption,
	},
	mapZoneInfoCloseButton: {
		width: 30,
		height: 30,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.secondary,
	},
	mapZoneInfoDeleteIconButton: {
		width: 30,
		height: 30,
		borderRadius: radius.pill,
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
		paddingVertical: spacing.sm,
		paddingHorizontal: 10,
		borderRadius: cornerRadius,
		backgroundColor: colors.splash,
	},
	mapZoneInfoLabel: {
		color: colors.muted,
		fontSize: fontSize.caption,
		textTransform: 'uppercase',
	},
	mapZoneInfoValue: {
		color: colors.text,
		fontSize: fontSize.body,
	},
	mapZoneInfoCoordinates: {
		color: colors.muted,
		fontSize: fontSize.caption,
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
		fontSize: fontSize.body,
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
		fontSize: fontSize.caption,
	},
	mapZoneRecordsErrorText: {
		color: colors.primary,
		fontSize: fontSize.caption,
	},
	mapZoneRecordRow: {
		minHeight: 90,
		paddingVertical: spacing.sm,
		paddingLeft: 14,
		paddingRight: 10,
		borderRadius: cornerRadius,
		backgroundColor: colors.selectedBg,
		borderWidth: 1,
		borderColor: 'transparent',
		marginBottom: 6,
		overflow: 'hidden',
	},
	mapZoneRecordFocusFill: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: colors.selectedBgActive,
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
		fontSize: fontSize.caption,
		fontWeight: '900',
	},
	mapZoneRecordDate: {
		color: colors.text,
		fontSize: fontSize.caption,
	},
	mapZoneRecordAuthor: {
		color: colors.text,
		fontSize: fontSize.caption,
		marginTop: 2,
	},
	mapZoneRecordMeta: {
		color: colors.muted,
		fontSize: fontSize.caption,
		marginTop: 2,
	},
	mapZoneRecordDetailsButton: {
		alignSelf: 'flex-end',
		marginTop: 6,
		paddingHorizontal: 9,
		paddingVertical: 5,
		borderRadius: radius.pill,
		backgroundColor: colors.secondary,
	},
	mapZoneRecordDetailsButtonText: {
		color: colors.surface,
		fontSize: fontSize.caption,
	},
	zoneErrorBanner: {
		marginHorizontal: spacing.md,
		marginVertical: spacing.sm,
		padding: spacing.md,
		backgroundColor: colors.dangerBg,
		borderRadius: cornerRadius,
		borderLeftWidth: 4,
		borderLeftColor: colors.danger,
	},
	zoneErrorText: {
		color: colors.dangerText,
		fontSize: fontSize.body,
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
		fontSize: fontSize.title,
		color: colors.text,
		marginBottom: spacing.lg,
		textAlign: 'center',
	} as TextStyle,
	zoneDeleteConfirmText: {
		color: colors.muted,
		fontSize: fontSize.body,
		lineHeight: 20,
		textAlign: 'center',
		marginBottom: spacing.lg,
	} as TextStyle,
	zoneModalLabel: {
		fontSize: fontSize.body,
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
		fontSize: fontSize.body,
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
		fontSize: fontSize.body,
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
		fontSize: fontSize.body,
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
