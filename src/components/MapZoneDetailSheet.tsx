import React, { useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useMapZoneDetail } from '../contexts/MapZoneDetailContext'
import { Skeleton } from './Skeleton'
import { appStyles } from '../styles/appStyles'
import { countLabel } from '../utils/countLabel'
import { formatDate, formatDateAtTime } from '../utils/recordFormatters'
import { getVisibleMapZoneRecords } from '../utils/mapZoneRecords'
import { shouldCloseOnRelease } from '../utils/sheetClose'
import type { MapZoneRecordRead, MapZoneType } from '../types/api'
import type { RootStackParamList } from '../types/navigation'
import { colors } from '../constants/theme'

function formatZoneType(type: MapZoneType) {
  return i18n.t(type === 'feeding' ? 'map:sheet.typeFeeding' : 'map:sheet.typeNest')
}

function formatZoneDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return formatDate(value)
}

const LOW_SNAP_FRACTION = 0.35
const RECORD_FOCUS_IN_MS = 180
const RECORD_FOCUS_OUT_MS = 450

type ZoneRecordRowProps = {
  record: MapZoneRecordRead
  selected: boolean
  onSelect: (recordId: number) => void
  onOpenDetails: (recordId: number) => void
  onLayout: (recordId: number, event: LayoutChangeEvent) => void
}

function ZoneRecordRow({ record, selected, onSelect, onOpenDetails, onLayout }: ZoneRecordRowProps) {
  const { t } = useTranslation('map')
  const focusValue = useRef(new Animated.Value(selected ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(focusValue, {
      toValue: selected ? 1 : 0,
      duration: selected ? RECORD_FOCUS_IN_MS : RECORD_FOCUS_OUT_MS,
      useNativeDriver: true,
    }).start()
  }, [focusValue, selected])

  // Só opacity: roda no driver nativo (animar backgroundColor obrigaria a thread JS).
  const focusStyle = {
    opacity: focusValue,
  }

  return (
    <View
      onLayout={(event) => onLayout(record.id, event)}
      style={appStyles.mapZoneRecordRow}
    >
      <Animated.View
        pointerEvents="none"
        style={[appStyles.mapZoneRecordFocusFill, focusStyle]}
      />
      <Animated.View style={[appStyles.mapZoneRecordFocusAccent, focusStyle]} />
      <Pressable onPress={() => onSelect(record.id)}
        accessibilityRole="button"
        accessibilityLabel={t('sheet.recordA11y', { id: record.id })}>
        <View style={appStyles.mapZoneRecordMainRow}>
          <Text style={appStyles.mapZoneRecordId}>
            #{String(record.id).padStart(3, '0')}
          </Text>
          <Text style={appStyles.mapZoneRecordDate}>
            {formatDateAtTime(record.date_time)}
          </Text>
        </View>
        <Text numberOfLines={1} style={appStyles.mapZoneRecordAuthor}>
          {record.author_name}
        </Text>
      </Pressable>
      <View style={appStyles.mapZoneRecordFooter}>
        <View style={appStyles.mapZoneRecordChip}>
          <Text style={appStyles.mapZoneRecordChipText}>
            {countLabel(record.ibis_quantity ?? 0)}
          </Text>
        </View>
        <Pressable
          onPress={() => onOpenDetails(record.id)}
          accessibilityRole="button"
          accessibilityLabel={t('sheet.detailsA11y', { id: record.id })}
          hitSlop={8}
          style={appStyles.mapZoneRecordDetailsButton}
        >
          <Text style={appStyles.mapZoneRecordDetailsButtonText}>{t('sheet.details')}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
        </Pressable>
      </View>
    </View>
  )
}

export function MapZoneDetailSheet() {
  const { t } = useTranslation('map')
  const ctx = useMapZoneDetail()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const recordScrollRef = useRef<ScrollView>(null)
  const recordRowYByIdRef = useRef<Record<number, number>>({})
  const RECORD_ROW_HEIGHT = 108
  const MAX_VISIBLE_ROWS = 4

  const { height: windowHeight } = useWindowDimensions()
  const snapPoints = [`${LOW_SNAP_FRACTION * 100}%`, '80%']
  const visibleZoneRecords = getVisibleMapZoneRecords(ctx.zoneRecords)

  const handleOpenZoneRecord = useCallback(
    (recordId: number) => {
      navigation.navigate('RecordDetail', { recordId })
    },
    [navigation],
  )

  const handleRecordRowLayout = useCallback(
    (recordId: number, event: LayoutChangeEvent) => {
      recordRowYByIdRef.current[recordId] = event.nativeEvent.layout.y
    },
    [],
  )

  const scrollToRecordRow = useCallback((recordId: number) => {
    const idx = visibleZoneRecords.findIndex((r) => r.id === recordId)
    if (idx >= 0) {
      recordScrollRef.current?.scrollTo({
        y: idx * RECORD_ROW_HEIGHT,
        animated: true,
      })
    }
  }, [visibleZoneRecords])

  useEffect(() => {
    ctx.registerScrollToRecord(scrollToRecordRow)
  }, [ctx, scrollToRecordRow])

  // A altura da lista já nasce com até 4 linhas: enquanto a folha sobe, os registros já aparecem
  // (antes ela só crescia depois de soltar). Na posição baixa, o excesso fica abaixo da tela.
  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) ctx.closeSheet()
    },
    [ctx],
  )

  // Sem `enablePanDownToClose` (a biblioteca fecha por velocidade): a folha só fecha quando o dedo
  // solta bem abaixo da parada baixa (ver utils/sheetClose.ts). A altura aproxima a folha em 35%.
  const handleSheetAnimate = useCallback(
    (fromIndex: number, toIndex: number, fromPosition: number, toPosition: number) => {
      if (
        shouldCloseOnRelease({
          fromIndex,
          toIndex,
          fromPosition,
          toPosition,
          sheetHeight: windowHeight * LOW_SNAP_FRACTION,
        })
      ) {
        bottomSheetRef.current?.close()
      }
    },
    [windowHeight],
  )

  const handleCloseZoneDetail = useCallback(() => {
    if (ctx.isDeleting) return
    ctx.closeSheet()
  }, [ctx])

  const handleDeletePress = useCallback(() => {
    const zoneId = ctx.selectedZone?.id
    if (zoneId === undefined) return
    ctx.openDeleteConfirm(zoneId)
    bottomSheetRef.current?.close()
  }, [ctx])

  return (
    <>
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={false}
      enableOverDrag
      overDragResistanceFactor={1}
      onAnimate={handleSheetAnimate}
      onChange={handleSheetChange}
      backgroundStyle={appStyles.zoneBottomSheetBackground}
      handleIndicatorStyle={appStyles.zoneBottomSheetIndicator}
    >
      <BottomSheetScrollView scrollEnabled={false}>
        <View style={appStyles.zoneBottomSheetContent}>
        {ctx.selectedZone && (
            <>
              <View style={appStyles.mapZoneInfoHeader}>
                <View
                  style={[
                    appStyles.mapZoneInfoBadge,
                    ctx.selectedZone.type === 'nest'
                      ? appStyles.mapZoneInfoBadgeNest
                      : appStyles.mapZoneInfoBadgeFeeding,
                  ]}
                >
                  <Ionicons
                    name={ctx.selectedZone.type === 'nest' ? 'home' : 'restaurant'}
                    size={22}
                    color={ctx.selectedZone.type === 'nest' ? colors.secondary : colors.primary}
                  />
                </View>
                <View style={appStyles.mapZoneInfoHeaderText}>
                  <Text
                    numberOfLines={2}
                    accessibilityRole="header"
                    style={appStyles.mapZoneInfoTitle}
                  >
                    {ctx.selectedZone.name}
                  </Text>
                  <Text style={appStyles.mapZoneInfoType}>
                    {formatZoneType(ctx.selectedZone.type)}
                  </Text>
                </View>
                <View style={appStyles.mapZoneInfoHeaderActions}>
                  {ctx.canManageZones ? (
                    <Pressable
                      onPress={handleDeletePress}
                      accessibilityRole="button"
                      accessibilityLabel={t('sheet.delete')}
                      disabled={ctx.isDeleting}
                      hitSlop={8}
                      style={appStyles.mapZoneInfoDeleteIconButton}
                    >
                      <Ionicons name="trash-outline" size={18} color={colors.dangerText} />
                    </Pressable>
                  ) : null}
                  <Pressable
                    onPress={handleCloseZoneDetail}
                    accessibilityRole="button"
                    accessibilityLabel={t('sheet.close')}
                    disabled={ctx.isDeleting}
                    hitSlop={8}
                    style={appStyles.mapZoneInfoCloseButton}
                  >
                    <Ionicons name="close" size={20} color={colors.muted} />
                  </Pressable>
                </View>
              </View>

              <View style={appStyles.mapZoneInfoGrid}>
                <View style={appStyles.mapZoneInfoMetric}>
                  <Text style={appStyles.mapZoneInfoValue}>
                    {ctx.selectedZone.radius_meters} m
                  </Text>
                  <Text style={appStyles.mapZoneInfoLabel}>{t('sheet.radiusLabel')}</Text>
                </View>
                <View style={appStyles.mapZoneInfoMetric}>
                  {ctx.isZoneRecordsLoading ? (
                    <View style={appStyles.mapZoneInfoValueSkeleton}>
                      <Skeleton width={32} height={26} radius={6} />
                    </View>
                  ) : (
                    <Text style={appStyles.mapZoneInfoValue}>{visibleZoneRecords.length}</Text>
                  )}
                  <Text style={appStyles.mapZoneInfoLabel}>
                    {!ctx.isZoneRecordsLoading && visibleZoneRecords.length === 1
                      ? t('sheet.recordsOne')
                      : t('sheet.recordsMany')}
                  </Text>
                </View>
                <View style={appStyles.mapZoneInfoMetric}>
                  <Text style={appStyles.mapZoneInfoValueSmall}>
                    {formatZoneDate(ctx.selectedZone.created_at)}
                  </Text>
                  <Text style={appStyles.mapZoneInfoLabel}>{t('sheet.createdAt')}</Text>
                </View>
              </View>

              <View style={appStyles.mapZoneInfoCoordinatesRow}>
                <Ionicons name="location-outline" size={16} color={colors.muted} />
                <Text style={appStyles.mapZoneInfoCoordinates}>
                  {ctx.selectedZone.latitude.toFixed(5)},{' '}
                  {ctx.selectedZone.longitude.toFixed(5)}
                </Text>
              </View>

              <View style={appStyles.mapZoneRecordsSection}>
                <Text accessibilityRole="header" style={appStyles.mapZoneRecordsTitle}>
                  {t('sheet.recordsTitle')}
                </Text>
                {ctx.isZoneRecordsLoading ? (
                  <View
                    accessible
                    accessibilityLabel={t('sheet.recordsLoading')}
                    accessibilityLiveRegion="polite"
                  >
                    {[0, 1].map((index) => (
                      <View key={index} style={appStyles.mapZoneRecordRow}>
                        <View style={appStyles.mapZoneRecordMainRow}>
                          <Skeleton width={56} height={18} radius={6} />
                          <Skeleton width={110} height={14} radius={6} />
                        </View>
                        <Skeleton width="45%" height={14} radius={6} />
                        <View style={appStyles.mapZoneRecordFooter}>
                          <Skeleton width={72} height={24} radius={12} />
                          <Skeleton width={92} height={16} radius={6} />
                        </View>
                      </View>
                    ))}
                  </View>
                ) : ctx.zoneRecordsError ? (
                  <Text style={appStyles.mapZoneRecordsErrorText}>
                    {ctx.zoneRecordsError}
                  </Text>
                ) : visibleZoneRecords.length > 0 ? (
                    <View style={{ height: RECORD_ROW_HEIGHT * Math.min(visibleZoneRecords.length, MAX_VISIBLE_ROWS) }}>
                    <ScrollView
                      ref={recordScrollRef}
                      snapToInterval={RECORD_ROW_HEIGHT}
                      decelerationRate="fast"
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled
                    >
                      {visibleZoneRecords.map((record) => (
                        <ZoneRecordRow
                          key={record.id}
                          record={record}
                          selected={ctx.selectedRecordId === record.id}
                          onSelect={(id) => ctx.setSelectedRecordId(id)}
                          onOpenDetails={handleOpenZoneRecord}
                          onLayout={handleRecordRowLayout}
                        />
                      ))}
                    </ScrollView>
                    </View>
                ) : (
                  <Text style={appStyles.mapZoneRecordsStatusText}>
                    {t('sheet.recordsEmpty')}
                  </Text>
                )}
              </View>
            </>
          )}
      </View>
      </BottomSheetScrollView>
    </BottomSheet>
    </>
  )
}
