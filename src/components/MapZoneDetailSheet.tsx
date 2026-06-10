import React, { useCallback, useEffect, useRef } from 'react'
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { useMapZoneDetail } from '../contexts/MapZoneDetailContext'
import { MapZoneDeleteConfirmSheet } from './MapZoneDeleteConfirmSheet'
import { appStyles } from '../styles/appStyles'
import { formatDate, formatTime } from '../utils/recordFormatters'
import { getVisibleMapZoneRecords } from '../utils/mapZoneRecords'
import type { MapZoneRecordRead, MapZoneType } from '../types/api'
import type { RootStackParamList } from '../types/navigation'

function formatZoneType(type: MapZoneType) {
  return type === 'feeding' ? 'Alimentação' : 'Ninho'
}

function formatZoneDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

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
  const focusValue = useRef(new Animated.Value(selected ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(focusValue, {
      toValue: selected ? 1 : 0,
      duration: selected ? RECORD_FOCUS_IN_MS : RECORD_FOCUS_OUT_MS,
      useNativeDriver: false,
    }).start()
  }, [focusValue, selected])

  const animatedStyle = {
    backgroundColor: focusValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#F3F7FF', '#EAF2FF'],
    }),
  }

  const focusAccentStyle = {
    opacity: focusValue,
  }

  return (
    <Animated.View
      onLayout={(event) => onLayout(record.id, event)}
      style={[appStyles.mapZoneRecordRow, animatedStyle]}
    >
      <Animated.View style={[appStyles.mapZoneRecordFocusAccent, focusAccentStyle]} />
      <Pressable onPress={() => onSelect(record.id)}>
        <View style={appStyles.mapZoneRecordMainRow}>
          <Text style={appStyles.mapZoneRecordId}>
            #{String(record.id).padStart(3, '0')}
          </Text>
          <Text style={appStyles.mapZoneRecordDate}>
            {formatDate(record.date_time)} às {formatTime(record.date_time)}
          </Text>
        </View>
        <Text style={appStyles.mapZoneRecordAuthor}>{record.author_name}</Text>
        <Text style={appStyles.mapZoneRecordMeta}>
          {record.ibis_quantity ?? 0}{' '}
          {(record.ibis_quantity ?? 0) === 1 ? 'Guará' : 'Guarás'}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onOpenDetails(record.id)}
        style={appStyles.mapZoneRecordDetailsButton}
      >
        <Text style={appStyles.mapZoneRecordDetailsButtonText}>VER DETALHES</Text>
      </Pressable>
    </Animated.View>
  )
}

export function MapZoneDetailSheet() {
  const ctx = useMapZoneDetail()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const recordScrollRef = useRef<ScrollView>(null)
  const recordRowYByIdRef = useRef<Record<number, number>>({})
  const RECORD_ROW_HEIGHT = 108

  const snapPoints = ['35%', '80%']
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

  useEffect(() => {
    if (ctx.selectedZone) {
      bottomSheetRef.current?.snapToIndex(0)
    } else {
      bottomSheetRef.current?.close()
    }
  }, [ctx.selectedZone])

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) ctx.closeSheet()
    },
    [ctx],
  )

  const handleCloseZoneDetail = useCallback(() => {
    if (ctx.isDeleting) return
    ctx.closeSheet()
  }, [ctx])

  const handleDeletePress = useCallback(() => {
    ctx.openDeleteConfirm()
  }, [ctx])

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await ctx.deleteZone()
    } catch {
      // Error displayed by MapsScreen
    }
  }, [ctx])

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        onChange={handleSheetChange}
        backgroundStyle={appStyles.zoneBottomSheetBackground}
        handleIndicatorStyle={appStyles.zoneBottomSheetIndicator}
      >
        <BottomSheetScrollView scrollEnabled={false}>
          <View style={appStyles.zoneBottomSheetContent}>
            {ctx.selectedZone && (
              <>
                <View style={appStyles.mapZoneInfoHeader}>
                  <View>
                    <Text style={appStyles.mapZoneInfoEyebrow}>Área selecionada</Text>
                    <Text style={appStyles.mapZoneInfoTitle}>{ctx.selectedZone.name}</Text>
                    <Text style={appStyles.mapZoneInfoType}>
                      {formatZoneType(ctx.selectedZone.type)}
                    </Text>
                  </View>
                  <View style={appStyles.mapZoneInfoHeaderActions}>
                    <Pressable
                      onPress={handleDeletePress}
                      disabled={ctx.isDeleting}
                      hitSlop={8}
                      style={appStyles.mapZoneInfoDeleteIconButton}
                    >
                      <Ionicons name="trash-outline" size={17} color="#FFFFFF" />
                    </Pressable>
                    <Pressable
                      onPress={handleCloseZoneDetail}
                      disabled={ctx.isDeleting}
                      hitSlop={8}
                      style={appStyles.mapZoneInfoCloseButton}
                    >
                      <Ionicons name="close" size={18} color="#FFFFFF" />
                    </Pressable>
                  </View>
                </View>

                <View style={appStyles.mapZoneInfoGrid}>
                  <View style={appStyles.mapZoneInfoMetric}>
                    <Text style={appStyles.mapZoneInfoLabel}>Raio</Text>
                    <Text style={appStyles.mapZoneInfoValue}>
                      {ctx.selectedZone.radius_meters} m
                    </Text>
                  </View>
                  <View style={appStyles.mapZoneInfoMetric}>
                    <Text style={appStyles.mapZoneInfoLabel}>Criada</Text>
                    <Text style={appStyles.mapZoneInfoValue}>
                      {formatZoneDate(ctx.selectedZone.created_at)}
                    </Text>
                  </View>
                </View>

                <Text style={appStyles.mapZoneInfoCoordinates}>
                  {ctx.selectedZone.latitude.toFixed(5)},{' '}
                  {ctx.selectedZone.longitude.toFixed(5)}
                </Text>

                <View style={appStyles.mapZoneRecordsSection}>
                  <View style={appStyles.mapZoneRecordsHeader}>
                    <Text style={appStyles.mapZoneInfoLabel}>Registros na área</Text>
                    <Text style={appStyles.mapZoneRecordsCount}>
                      {visibleZoneRecords.length}
                    </Text>
                  </View>
                  {ctx.isZoneRecordsLoading ? (
                    <View style={appStyles.mapZoneRecordsStatusRow}>
                      <ActivityIndicator size="small" color="#125ED0" />
                      <Text style={appStyles.mapZoneRecordsStatusText}>
                        Carregando registros...
                      </Text>
                    </View>
                  ) : ctx.zoneRecordsError ? (
                    <Text style={appStyles.mapZoneRecordsErrorText}>
                      {ctx.zoneRecordsError}
                    </Text>
                  ) : visibleZoneRecords.length > 0 ? (
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
                  ) : (
                    <Text style={appStyles.mapZoneRecordsStatusText}>
                      Nenhum registro com guarás identificados nesta área.
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      {ctx.showDeleteConfirm && (
        <MapZoneDeleteConfirmSheet
          onConfirm={handleDeleteConfirm}
          onCancel={ctx.closeDeleteConfirm}
          isDeleting={ctx.isDeleting}
        />
      )}
    </Portal>
  )
}
