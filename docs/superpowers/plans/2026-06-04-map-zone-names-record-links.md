# Map Zone Names And Record Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically name map zones by type and show inherited record areas in history and detail.

**Architecture:** Backend owns naming, overlap validation, and record-area linking. Frontend treats names and linked areas as API data and only renders fallbacks.

**Tech Stack:** FastAPI, SQLModel, SQLAlchemy async, Alembic, React Native, Expo, TypeScript.

---

### Task 1: Backend Helpers And Tests

**Files:**
- Create: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-api/src/services/map_zone_service.py`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-api/tests/test_review_fixes.py`

- [ ] Add tests for `index_to_zone_suffix`, `format_zone_name`, `distance_meters`, `zones_overlap`, and `find_smallest_free_sequence_index`.
- [ ] Run `python -m unittest tests.test_review_fixes` and confirm the new tests fail because helpers do not exist.
- [ ] Implement helpers with zero-based indexes: `0 -> A`, `25 -> Z`, `26 -> AA`, `27 -> AB`.
- [ ] Run `python -m unittest tests.test_review_fixes` and confirm tests pass.

### Task 2: Backend Models, Schemas, And Migration

**Files:**
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-api/src/models/map_zone.py`
- Create: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-api/src/models/record_map_zone.py`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-api/src/models/__init__.py`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-api/src/schemas.py`
- Create: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-api/migrations/versions/20260604_0011_add_zone_names_and_record_links.py`

- [ ] Add `name` and `sequence_index` fields to `MapZone`.
- [ ] Add `RecordMapZone` join model with cascade foreign keys.
- [ ] Add `LinkedMapZoneRead` schema and `map_zones` lists on record read schemas.
- [ ] Add migration that backfills existing map zone names by type and does not link old records.

### Task 3: Backend Routes

**Files:**
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-api/src/routes/map_zones.py`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-api/src/routes/record.py`

- [ ] Generate names on `POST /map-zones` using smallest free index by type.
- [ ] Reject same-type overlaps with HTTP 422.
- [ ] Link created records to matching areas.
- [ ] Serialize linked areas for record list, summary, detail, and single-record responses.
- [ ] Invalidate record cache when zones are created or deleted.

### Task 4: Frontend Types And Rendering

**Files:**
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-front-end/src/types/api.ts`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-front-end/src/services/recordsApi.ts`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-front-end/src/types/records.ts`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-front-end/src/components/HistoryRecordCard.tsx`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-front-end/src/screens/MapsScreen.tsx`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-front-end/src/screens/RecordDetailScreen.tsx`
- Modify: `C:/Users/Vinicius Leal/Desktop/pi_namorada_linda/guara-vivo-front-end/src/styles/appStyles.ts`

- [ ] Extend API and record types with `map_zones`.
- [ ] Preserve `map_zones` in record mappers.
- [ ] Show area names in map selected-area card.
- [ ] Show `Sem área` or joined zone names in history cards.
- [ ] Show an `ÁREAS` row in record detail.

### Task 5: Verification

**Files:**
- Verify backend and frontend repositories.

- [ ] Run backend tests: `python -m unittest tests.test_review_fixes`.
- [ ] Run frontend tests: `npm test -- --runInBand`.
- [ ] Run frontend typecheck: `npm run typecheck`.
- [ ] Run frontend lint: `npm run lint`.
- [ ] Run Expo doctor and report any pre-existing Metro warning.

## Self-Review

Spec coverage: naming, name reuse, overlap blocking, record inheritance, deletion fallback, backfill scope, and frontend display are covered. No placeholders. Types are consistently named `map_zones` and `RecordMapZone`.
