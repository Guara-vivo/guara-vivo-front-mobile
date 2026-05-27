# Map Zones Feature - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add public circular zones (feeding/nest) to the map, created by users, visible to all, deletable only by creator.

**Architecture:** Backend: `map_zones` table + CRUD routes. Frontend: zone circles on map + modal UI for type/radius selection. Zones are public; creator tracked for permission checks.

**Tech Stack:** FastAPI (backend), SQLAlchemy ORM, React Native/Expo (frontend), react-native-maps, TypeScript.

---

## File Structure

### Backend (API)

- Create: `src/models/map_zone.py` — MapZone model
- Modify: `src/models/__init__.py` — export MapZone
- Modify: `src/schemas.py` — add MapZone schemas
- Create: `src/routes/map_zones.py` — CRUD endpoints
- Modify: `src/main.py` — include map_zones router
- Create: `migrations/versions/20260526_0009_add_map_zones_table.py` — Alembic migration

### Frontend (Mobile)

- Create: `src/components/MapZoneSelectionModal.tsx` — type/radius picker
- Modify: `src/screens/MapsScreen.tsx` — add "Adicionar Área" button, fetch zones
- Modify: `src/components/MapLibreMapView.tsx` — render zone circles
- Create: `src/services/mapZonesApi.ts` — API calls
- Modify: `src/types/api.ts` — add zone types
- Modify: `src/styles/appStyles.ts` — zone styles

---

## Backend Implementation

### Task 1: Create MapZone Model

**Files:**
- Create: `src/models/map_zone.py`
- Modify: `src/models/__init__.py`

- [ ] **Step 1: Create map_zone.py**

Create `src/models/map_zone.py`:

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Literal, Optional
from sqlalchemy import Column, DateTime

ZoneType = Literal["feeding", "nest"]

class MapZone(SQLModel, table=True):
    __tablename__ = "map_zones"

    id: Optional[int] = Field(default=None, primary_key=True)
    type: str = Field(index=True)  # "feeding" or "nest"
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    radius_meters: int = Field(default=50, ge=10, le=5000)
    user_id: int = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False))

    class Config:
        from_attributes = True
```

- [ ] **Step 2: Export in __init__.py**

Modify `src/models/__init__.py` — add at end:

```python
from .map_zone import MapZone
```

---

### Task 2: Create MapZone Schemas

**Files:**
- Modify: `src/schemas.py`

- [ ] **Step 1: Add schemas to schemas.py**

Add before `class RecordBase`:

```python
MapZoneType = Literal["feeding", "nest"]

class MapZoneBase(SQLModel):
    type: MapZoneType
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    radius_meters: int = Field(default=50, ge=10, le=5000)
    user_id: int

class MapZoneCreate(MapZoneBase):
    pass

class MapZoneRead(MapZoneBase):
    id: int
    created_at: datetime

    @field_validator("created_at")
    @classmethod
    def normalize_created_at(cls, value: datetime) -> datetime:
        return normalize_timezone(value)
```

---

### Task 3: Create MapZone Routes

**Files:**
- Create: `src/routes/map_zones.py`

- [ ] **Step 1: Create map_zones.py**

Create `src/routes/map_zones.py`:

```python
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import MapZone, User
from schemas import MapZoneCreate, MapZoneRead
from security import get_current_user

router = APIRouter(prefix="/map-zones", tags=["map-zones"])

@router.get("/", response_model=list[MapZoneRead])
async def read_map_zones(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=1000, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all public map zones."""
    result = await db.execute(
        select(MapZone)
        .order_by(MapZone.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.post("/", response_model=MapZoneRead)
async def create_map_zone(
    zone: MapZoneCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new map zone. User ID must match authenticated user."""
    if zone.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    db_zone = MapZone(
        type=zone.type,
        latitude=zone.latitude,
        longitude=zone.longitude,
        radius_meters=zone.radius_meters,
        user_id=zone.user_id,
        created_at=datetime.now(timezone.utc),
    )
    db.add(db_zone)
    await db.commit()
    await db.refresh(db_zone)
    return db_zone

@router.delete("/{zone_id}")
async def delete_map_zone(
    zone_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a map zone. Only creator can delete."""
    result = await db.execute(select(MapZone).where(MapZone.id == zone_id))
    zone = result.scalar_one_or_none()

    if zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")

    if zone.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    await db.delete(zone)
    await db.commit()
    return {"detail": "Zone deleted successfully"}
```

- [ ] **Step 2: Include router in main.py**

Modify `src/main.py` — update imports:

```python
from routes import user, record, analysis, ibis, map_zones
```

Add before `if __name__ == "__main__":`:

```python
app.include_router(map_zones.router)
```

---

### Task 4: Create Alembic Migration

**Files:**
- Create: `migrations/versions/20260526_0009_add_map_zones_table.py`

- [ ] **Step 1: Create migration file**

Create `migrations/versions/20260526_0009_add_map_zones_table.py`:

```python
"""add map_zones table

Revision ID: 20260526_0009
Revises: 20260520_0008
Create Date: 2026-05-26 00:00:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "20260526_0009"
down_revision: Union[str, None] = "20260520_0008"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "map_zones",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("radius_meters", sa.Integer(), nullable=False, server_default="50"),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_map_zones_type", "map_zones", ["type"], unique=False)
    op.create_index("ix_map_zones_user_id", "map_zones", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_map_zones_user_id", table_name="map_zones")
    op.drop_index("ix_map_zones_type", table_name="map_zones")
    op.drop_table("map_zones")
```

- [ ] **Step 2: Apply migration**

Run from API directory:

```bash
alembic upgrade head
```

Expected: Migration applied successfully.

---

## Frontend Implementation

### Task 5: Add Zone API Types

**Files:**
- Modify: `src/types/api.ts`

- [ ] **Step 1: Add zone types**

Modify `src/types/api.ts` — add before `export type RecordRead`:

```typescript
export type MapZoneType = 'feeding' | 'nest'

export type MapZoneRead = {
	id: number
	type: MapZoneType
	latitude: number
	longitude: number
	radius_meters: number
	user_id: number
	created_at: string
}
```

---

### Task 6: Create Map Zones API Service

**Files:**
- Create: `src/services/mapZonesApi.ts`

- [ ] **Step 1: Create mapZonesApi.ts**

Create `src/services/mapZonesApi.ts`:

```typescript
import { apiFetch } from './apiClient'
import type { MapZoneRead, MapZoneType } from '../types/api'

export async function getMapZones(
	token: string,
	signal?: AbortSignal,
): Promise<MapZoneRead[]> {
	const response = await apiFetch('/map-zones', {
		headers: { Authorization: `Bearer ${token}` },
		signal,
	})
	return response.json() as Promise<MapZoneRead[]>
}

export async function createMapZone(
	token: string,
	zone: {
		type: MapZoneType
		latitude: number
		longitude: number
		radius_meters: number
		user_id: number
	},
	signal?: AbortSignal,
): Promise<MapZoneRead> {
	const response = await apiFetch('/map-zones', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(zone),
		signal,
	})
	return response.json() as Promise<MapZoneRead>
}

export async function deleteMapZone(
	token: string,
	zoneId: number,
	signal?: AbortSignal,
): Promise<void> {
	await apiFetch(`/map-zones/${zoneId}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` },
		signal,
	})
}

export default {
	getMapZones,
	createMapZone,
	deleteMapZone,
}
```

---

### Task 7: Create Zone Selection Modal

**Files:**
- Create: `src/components/MapZoneSelectionModal.tsx`

- [ ] **Step 1: Create MapZoneSelectionModal.tsx**

Create `src/components/MapZoneSelectionModal.tsx`:

```typescript
import React, { useState } from 'react'
import { Modal, Pressable, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { appStyles } from '../styles/appStyles'
import { colors } from '../constants/theme'
import type { MapZoneType } from '../types/api'
import Button from './Button'

type Props = {
	visible: boolean
	latitude: number
	longitude: number
	onConfirm: (type: MapZoneType, radius: number) => void
	onCancel: () => void
	isLoading: boolean
}

export function MapZoneSelectionModal({
	visible,
	latitude,
	longitude,
	onConfirm,
	onCancel,
	isLoading,
}: Props) {
	const [selectedType, setSelectedType] = useState<MapZoneType>('feeding')
	const [radius, setRadius] = useState('50')

	const handleConfirm = () => {
		const radiusNum = Math.max(10, Math.min(5000, parseInt(radius) || 50))
		onConfirm(selectedType, radiusNum)
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
		>
			<View style={appStyles.modalOverlay}>
				<View style={appStyles.mapZoneModal}>
					<View style={appStyles.mapZoneModalHeader}>
						<Text style={appStyles.mapZoneModalTitle}>Nova Área</Text>
						<Pressable
							onPress={onCancel}
							disabled={isLoading}
							hitSlop={8}
						>
							<Ionicons name="close" size={24} color={colors.text} />
						</Pressable>
					</View>

					<View style={appStyles.mapZoneModalContent}>
						<Text style={appStyles.mapZoneModalLabel}>Tipo</Text>
						<View style={appStyles.mapZoneTypeRow}>
							{(['feeding', 'nest'] as const).map((type) => (
								<Pressable
									key={type}
									onPress={() => setSelectedType(type)}
									disabled={isLoading}
									style={[
										appStyles.mapZoneTypeButton,
										selectedType === type &&
											appStyles.mapZoneTypeButtonActive,
									]}
								>
									<Ionicons
										name={type === 'feeding' ? 'fish' : 'home'}
										size={20}
										color={
											selectedType === type
												? colors.surface
												: colors.text
										}
									/>
									<Text
										style={[
											appStyles.mapZoneTypeButtonLabel,
											selectedType === type &&
												appStyles.mapZoneTypeButtonLabelActive,
										]}
									>
										{type === 'feeding'
											? 'Alimentação'
											: 'Ninho'}
									</Text>
								</Pressable>
							))}
						</View>

						<Text style={[appStyles.mapZoneModalLabel, { marginTop: 16 }]}>
							Raio (metros)
						</Text>
						<TextInput
							value={radius}
							onChangeText={setRadius}
							keyboardType="number-pad"
							maxLength={4}
							editable={!isLoading}
							style={appStyles.mapZoneRadiusInput}
							placeholder="50"
						/>
						<Text style={appStyles.mapZoneCoordinates}>
							Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
						</Text>
					</View>

					<View style={appStyles.mapZoneModalActions}>
						<Pressable
							style={appStyles.mapZoneModalCancelButton}
							onPress={onCancel}
							disabled={isLoading}
						>
							<Text style={appStyles.mapZoneModalCancelButtonText}>
								Cancelar
							</Text>
						</Pressable>
						<Button
							label="Salvar"
							onPress={handleConfirm}
							disabled={isLoading}
						/>
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default MapZoneSelectionModal
```

---

### Task 8: Update MapLibreMapView to Render Zones

**Files:**
- Modify: `src/components/MapLibreMapView.tsx`

- [ ] **Step 1: Update imports and props**

Modify `src/components/MapLibreMapView.tsx` — update type Props (after line 9):

```typescript
type Props = {
	selectedLayer: MapLayerId
	records: MapRecord[]
	zones: Array<{
		id: number
		type: 'feeding' | 'nest'
		latitude: number
		longitude: number
		radius_meters: number
		user_id: number
	}>
	onMapPress?: (latitude: number, longitude: number) => void
}
```

- [ ] **Step 2: Update function signature**

Modify function signature (line 14):

```typescript
export function MapLibreMapView({
	selectedLayer,
	records,
	zones,
	onMapPress,
}: Props) {
```

- [ ] **Step 3: Add zone circles rendering**

Before `return (` statement (around line 119), add:

```typescript
	// Filter zones by selected layer
	const visibleZones = zones.filter((zone) => {
		if (selectedLayer === 'all') return true
		if (selectedLayer === 'feeding') return zone.type === 'feeding'
		return zone.type === 'nest'
	})

	// Create zone circles
	const zoneCircles = visibleZones.map((zone) => {
		const circleColor = zone.type === 'feeding' ? '#E53935' : '#2F6FE4'
		const circleOpacity = 0.15

		return (
			<Circle
				key={`zone-${zone.id}`}
				center={{
					latitude: zone.latitude,
					longitude: zone.longitude,
				}}
				radius={zone.radius_meters}
				strokeColor={circleColor}
				strokeWidth={2}
				fillColor={`${circleColor}${Math.round(circleOpacity * 255)
					.toString(16)
					.padStart(2, '0')}`}
			/>
		)
	})
```

- [ ] **Step 4: Add Circle import**

Update imports (line 1):

```typescript
import MapView, { Marker, Circle } from 'react-native-maps'
```

- [ ] **Step 5: Update MapView onPress handler**

Find MapView component and add onPress handler:

```typescript
			<MapView
				style={styles.mapView}
				showsPointsOfInterest={false}
				showsIndoors={false}
				showsBuildings={false}
				customMapStyle={mapStyle}
				initialRegion={{
					latitude: mapCenter.lat,
					longitude: mapCenter.lng,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
				onPress={(e) => {
					if (onMapPress) {
						onMapPress(
							e.nativeEvent.coordinate.latitude,
							e.nativeEvent.coordinate.longitude,
						)
					}
				}}
			>
				{zoneCircles}
				{markers}
			</MapView>
```

---

### Task 9: Update MapsScreen to Manage Zones

**Files:**
- Modify: `src/screens/MapsScreen.tsx`

- [ ] **Step 1: Update imports**

Modify `src/screens/MapsScreen.tsx` — update imports (lines 1-8):

```typescript
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View, Alert } from 'react-native'
import Header from '../components/Header'
import { ScreenCard } from '../components/common'
import { MapLibreMapView } from '../components/MapLibreMapView'
import { MapZoneSelectionModal } from '../components/MapZoneSelectionModal'
import { appStyles } from '../styles/appStyles'
import { MAP_RECORDS } from '../config/map'
import { getMapZones, createMapZone, deleteMapZone } from '../services/mapZonesApi'
import { getToken } from '../services/authService'
import type { ScreenId } from '../types/navigation'
import type { MapZoneRead } from '../types/api'
```

- [ ] **Step 2: Add state and handlers**

Replace component body (after opening braces on line 13):

```typescript
export function MapsScreen({
	onNavigate,
}: {
	onNavigate: (screen: ScreenId) => void
}) {
	const [selectedLayer, setSelectedLayer] = useState<
		'all' | 'feeding' | 'nests'
	>('all')
	const [zones, setZones] = useState<MapZoneRead[]>([])
	const [showModal, setShowModal] = useState(false)
	const [selectedPoint, setSelectedPoint] = useState<{
		latitude: number
		longitude: number
	} | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [isAddingMode, setIsAddingMode] = useState(false)

	useEffect(() => {
		loadZones()
	}, [])

	const loadZones = async () => {
		try {
			const token = await getToken()
			if (token) {
				const data = await getMapZones(token)
				setZones(data)
			}
		} catch (error) {
			console.error('Failed to load zones:', error)
		}
	}

	const handleMapPress = (latitude: number, longitude: number) => {
		if (isAddingMode) {
			setSelectedPoint({ latitude, longitude })
			setShowModal(true)
		}
	}

	const handleZoneConfirm = async (type: 'feeding' | 'nest', radius: number) => {
		if (!selectedPoint) return

		setIsLoading(true)
		try {
			const token = await getToken()
			if (!token) {
				Alert.alert('Erro', 'Token não encontrado')
				return
			}

			const userId = await getUserId()
			if (!userId) {
				Alert.alert('Erro', 'Usuário não autenticado')
				return
			}

			await createMapZone(token, {
				type,
				latitude: selectedPoint.latitude,
				longitude: selectedPoint.longitude,
				radius_meters: radius,
				user_id: userId,
			})

			await loadZones()
			setShowModal(false)
			setSelectedPoint(null)
			setIsAddingMode(false)
			Alert.alert('Sucesso', 'Área criada com sucesso')
		} catch (error) {
			Alert.alert('Erro', 'Falha ao criar área')
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleZoneDelete = async (zoneId: number, userId: number) => {
		try {
			const token = await getToken()
			if (!token) return

			const currentUserId = await getUserId()
			if (currentUserId !== userId) {
				Alert.alert('Erro', 'Você não pode deletar esta zona')
				return
			}

			Alert.alert('Confirmar', 'Deletar esta área?', [
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Deletar',
					style: 'destructive',
					onPress: async () => {
						try {
							await deleteMapZone(token, zoneId)
							await loadZones()
							Alert.alert('Sucesso', 'Área deletada')
						} catch {
							Alert.alert('Erro', 'Falha ao deletar área')
						}
					},
				},
			])
		} catch (error) {
			console.error(error)
		}
	}

	const layerButtons: { id: 'all' | 'feeding' | 'nests'; label: string; icon: IoniconName }[] = [
		{ id: 'all' as const, label: 'TODOS', icon: 'layers-outline' },
		{ id: 'feeding' as const, label: 'ALIMENTAÇÃO', icon: 'fish' },
		{ id: 'nests' as const, label: 'NINHOS', icon: 'home' },
	]

	return (
		<View style={appStyles.mapsScreen}>
			<Header title="Mapas" />
			<View style={[appStyles.screen, appStyles.mapsContent]}>
				<ScreenCard style={appStyles.mapsFilterCard}>
					<View style={appStyles.mapsFilterTitleRow}>
						<Ionicons name="layers-outline" size={18} color="#125ED0" />
						<Text style={appStyles.sectionTitle}>CAMADA</Text>
					</View>

					<View style={appStyles.mapsFilterRow}>
						{layerButtons.map((item) => {
							const active = selectedLayer === item.id

							return (
								<Pressable
									key={item.id}
									onPress={() => setSelectedLayer(item.id)}
									style={[
										appStyles.mapsFilterButton,
										active && appStyles.mapsFilterButtonActive,
									]}
								>
									{item.id === 'feeding' ? (
										<View
											style={[
												appStyles.mapsFilterButtonIcon,
												{
													width: 9,
													height: 9,
													borderRadius: 9,
													backgroundColor: active ? '#FFFFFF' : '#E53935',
												},
											]}
										/>
									) : (
										<Ionicons
											name={item.icon}
											size={15}
											color={active ? '#FFFFFF' : '#2F6FE4'}
											style={appStyles.mapsFilterButtonIcon}
										/>
									)}
									<Text
										style={[
											appStyles.mapsFilterButtonLabel,
											active && appStyles.mapsFilterButtonLabelActive,
										]}
									>
										{item.label}
									</Text>
								</Pressable>
							)
						})}
					</View>
				</ScreenCard>

				<View style={appStyles.mapsAddAreaContainer}>
					<Pressable
						onPress={() => {
							setIsAddingMode(!isAddingMode)
							setShowModal(false)
							setSelectedPoint(null)
						}}
						style={[
							appStyles.mapsAddAreaButton,
							isAddingMode && appStyles.mapsAddAreaButtonActive,
						]}
					>
						<Ionicons
							name="add-circle"
							size={20}
							color={isAddingMode ? '#FFFFFF' : '#2F6FE4'}
						/>
						<Text
							style={[
								appStyles.mapsAddAreaButtonText,
								isAddingMode && appStyles.mapsAddAreaButtonTextActive,
							]}
						>
							{isAddingMode ? 'Clique no Mapa' : 'Adicionar Área'}
						</Text>
					</Pressable>
				</View>

				<ScreenCard style={appStyles.mapsMapCard}>
					<MapLibreMapView
						selectedLayer={selectedLayer}
						records={MAP_RECORDS}
						zones={zones}
						onMapPress={handleMapPress}
					/>
				</ScreenCard>
			</View>

			<MapZoneSelectionModal
				visible={showModal}
				latitude={selectedPoint?.latitude || 0}
				longitude={selectedPoint?.longitude || 0}
				onConfirm={handleZoneConfirm}
				onCancel={() => {
					setShowModal(false)
					setSelectedPoint(null)
				}}
				isLoading={isLoading}
			/>
		</View>
	)
}
```

- [ ] **Step 3: Add helper function**

Add before `export default MapsScreen`:

```typescript
async function getUserId(): Promise<number | null> {
	try {
		const token = await getToken()
		if (!token) return null

		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8001'}/users/me`,
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		)
		if (!response.ok) return null

		const user = await response.json()
		return user.id || null
	} catch {
		return null
	}
}
```

---

### Task 10: Add Styles

**Files:**
- Modify: `src/styles/appStyles.ts`

- [ ] **Step 1: Add zone styles**

Add to appStyles.ts before `mapsScreen`:

```typescript
	mapZoneModal: {
		backgroundColor: colors.surface,
		borderRadius: cornerRadius,
		padding: spacing.lg,
		marginHorizontal: spacing.md,
		...unifiedShadow,
	},
	mapZoneModalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: spacing.md,
	},
	mapZoneModalTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: colors.text,
	},
	mapZoneModalContent: {
		marginBottom: spacing.lg,
	},
	mapZoneModalLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.text,
		marginBottom: spacing.sm,
	},
	mapZoneTypeRow: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	mapZoneTypeButton: {
		flex: 1,
		minHeight: 48,
		borderRadius: cornerRadius,
		borderWidth: 1.5,
		borderColor: colors.border,
		backgroundColor: colors.surface,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
	},
	mapZoneTypeButtonActive: {
		backgroundColor: colors.primary,
		borderColor: colors.primary,
	},
	mapZoneTypeButtonLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.text,
	},
	mapZoneTypeButtonLabelActive: {
		color: colors.surface,
	},
	mapZoneRadiusInput: {
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: cornerRadius,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		fontSize: 14,
		color: colors.text,
		marginBottom: spacing.sm,
	},
	mapZoneCoordinates: {
		fontSize: 12,
		color: colors.muted,
		marginTop: spacing.sm,
	},
	mapZoneModalActions: {
		flexDirection: 'row',
		gap: spacing.md,
	},
	mapZoneModalCancelButton: {
		flex: 1,
		minHeight: 44,
		borderRadius: cornerRadius,
		borderWidth: 1,
		borderColor: colors.border,
		alignItems: 'center',
		justifyContent: 'center',
	},
	mapZoneModalCancelButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.text,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	mapsAddAreaContainer: {
		marginBottom: spacing.md,
	},
	mapsAddAreaButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing.sm,
		minHeight: 44,
		borderRadius: cornerRadius,
		borderWidth: 1.5,
		borderColor: colors.primary,
		backgroundColor: colors.surface,
		...unifiedShadow,
	},
	mapsAddAreaButtonActive: {
		backgroundColor: colors.primary,
	},
	mapsAddAreaButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: colors.primary,
	},
	mapsAddAreaButtonTextActive: {
		color: colors.surface,
	},
```

---

## Validation Checklist

- [ ] API creates zones with all required fields
- [ ] API lists all zones (public)
- [ ] API deletes only own zones
- [ ] Frontend fetches zones on MapsScreen mount
- [ ] Frontend renders zone circles on map
- [ ] Frontend shows "Adicionar Área" button
- [ ] Frontend modal selects type and radius
- [ ] Frontend saves zone and reloads list
- [ ] Zone circles filter by selected layer

---

## Plan complete and saved to `docs/superpowers/plans/2026-05-26-map-zones-implementation.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** - Fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session with checkpoints

**Which approach?**
