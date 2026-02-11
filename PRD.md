# Product Requirements Document (PRD)

## Scheduling & Planning Backend Service

**Version:** 1.3  
**Last Updated:** February 11, 2025

---

## 1. Executive Summary

This document defines the product requirements, API routes, and implementation logic for a **Scheduling & Planning** backend service. The system manages manufacturing factories, their physical layout (bays, machines), machine types, and inventory, enabling production scheduling and planning workflows.

**Key Updates in v1.3:**

- Implemented and tested Factories, Bays, Machine Types, and Inventory modules
- Fixed query parameter type conversion issues in inventory filtering
- Added comprehensive validation for all entity types
- Verified all CRUD operations working correctly in production

**Key Updates in v1.2:**

- Added database indexes for performance optimization
- Added `updatedAt` timestamps across all models
- Introduced enums for categorical fields (HealthState, Unit)
- Refined validation rules and constraints

---

## 2. Updated Domain Model

### 2.1 Database Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum HealthState {
  OPERATIONAL
  MAINTENANCE
  DOWN
  RETIRED
}

enum Unit {
  G
  KG
  ML
  L
  TSP
  TBSP
  CUP
  FL_OZ
  OZ
  LB
  PINCH
  PIECE
}

model Factory {
  factoryId       Int      @id @default(autoincrement())
  factoryCode     String   @unique
  factoryName     String
  industryType    String
  factoryLocation String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  bays          Bay[]
  machines      Machine[]
  machineTypes  MachineType[]
  inventory     InventoryItem[]

  @@index([factoryCode])
  @@index([industryType])
}

model Bay {
  bayId              Int     @id @default(autoincrement())
  bayName            String
  maxMachineCapacity Int
  isActive           Boolean @default(true)

  factoryId Int
  factory   Factory @relation(fields: [factoryId], references: [factoryId], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  machineTypes MachineType[]
  machines     Machine[]

  @@index([factoryId])
  @@index([isActive])
}

model MachineType {
  machineTypeId Int    @id @default(autoincrement())
  typeName      String
  capabilities  Json
  constraints   Json

  factoryId Int
  factory   Factory @relation(fields: [factoryId], references: [factoryId], onDelete: Cascade)

  bayId Int
  bay   Bay @relation(fields: [bayId], references: [bayId], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  machines Machine[]

  @@index([factoryId])
  @@index([bayId])
}

model Machine {
  machineId        Int         @id @default(autoincrement())
  modelNumber      String
  installationDate DateTime
  healthState      HealthState @default(OPERATIONAL)
  usageHours       Float       @default(0)
  isAvailable      Boolean     @default(true)

  factoryId Int
  factory   Factory @relation(fields: [factoryId], references: [factoryId], onDelete: Cascade)

  machineTypeId Int
  machineType   MachineType @relation(fields: [machineTypeId], references: [machineTypeId], onDelete: Cascade)

  bayId Int
  bay   Bay @relation(fields: [bayId], references: [bayId], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([factoryId])
  @@index([bayId])
  @@index([machineTypeId])
  @@index([healthState])
  @@index([isAvailable])
}

model InventoryItem {
  inventoryId   Int      @id @default(autoincrement())
  materialName  String
  lotNumber     String
  quantity      Float
  unit          Unit
  sapMaterialId String
  lastSyncTime  DateTime @default(now())

  factoryId Int
  factory   Factory @relation(fields: [factoryId], references: [factoryId], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([factoryId])
  @@index([sapMaterialId])
}
```

### 2.2 Entity Relationships

| Entity            | Description                           | Key Fields                                                                 |
| ----------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| **Factory**       | Root entity—a manufacturing plant     | factoryCode (unique), factoryName, industryType, factoryLocation           |
| **Bay**           | Physical bay/section within a factory | bayName, maxMachineCapacity, isActive                                      |
| **MachineType**   | Type/category of machine              | typeName, capabilities (JSON), constraints (JSON)                          |
| **Machine**       | Individual machine instance           | modelNumber, installationDate, healthState (enum), usageHours, isAvailable |
| **InventoryItem** | Material/inventory per factory        | materialName, lotNumber, quantity, unit (enum), sapMaterialId              |

**Relationship Summary:**

- Factory → Bays, Machines, MachineTypes, InventoryItems (1:N, cascade delete)
- Bay → MachineTypes, Machines (1:N, cascade delete)
- MachineType → Machines (1:N, cascade delete)

---

## 3. Business Logic & Validation Rules

### 3.1 Factory Rules

- `factoryCode` must be **unique** across all factories
- `factoryCode`, `factoryName`, `industryType`, `factoryLocation` are **required**
- Deleting a factory cascades to all related entities (Bays, Machines, MachineTypes, Inventory)

### 3.2 Bay Rules

- `maxMachineCapacity` must be a **positive integer**
- Cannot add machines to a bay if it would **exceed maxMachineCapacity**
- When reducing `maxMachineCapacity`, current machine count must be ≤ new capacity
- `isActive = false` bays should be excluded from scheduling operations
- Deleting a bay cascades to MachineTypes and Machines in that bay

### 3.3 MachineType Rules

- Both `factoryId` and `bayId` must exist and **belong together** (bay must be in the specified factory)
- `capabilities` and `constraints` are stored as **JSON** (flexible schema)
- Deleting a MachineType cascades to all Machines of that type

### 3.4 Machine Rules

- `factoryId`, `bayId`, `machineTypeId` must be **consistent** (all belong to the same factory)
- Cannot add a machine if bay is at **maxMachineCapacity**
- `healthState` is an enum: **OPERATIONAL, MAINTENANCE, DOWN, RETIRED**
- `isAvailable` should be set to `false` when machine is in MAINTENANCE, DOWN, or RETIRED state
- `usageHours` cannot be negative

### 3.5 Inventory Rules

- `quantity` must be **non-negative**
- `unit` is an enum: **G, KG, ML, L, TSP, TBSP, CUP, FL_OZ, OZ, LB, PINCH, PIECE**
- `lastSyncTime` auto-updates when quantity changes
- `sapMaterialId` should be unique per factory (optional enforcement)

---

## 4. API Design Principles

### 4.1 API Standards

- **Base path:** `/api/v1`
- **RESTful conventions:** GET (read), POST (create), PATCH (update), DELETE (delete)
- **Plural nouns:** `/factories`, `/bays`, `/machines`, etc.
- **Nested resources:** Use when retrieving related entities (e.g., `/factories/:id/bays`)

### 4.2 Response Format

**Success Response:**

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "maxMachineCapacity must be a positive integer",
    "details": {
      "field": "maxMachineCapacity",
      "value": -5
    }
  }
}
```

### 4.3 Error Codes

| HTTP Status | Error Code              | Description                        |
| ----------- | ----------------------- | ---------------------------------- |
| 400         | VALIDATION_ERROR        | Request validation failed          |
| 404         | RESOURCE_NOT_FOUND      | Entity does not exist              |
| 409         | CONFLICT                | Unique constraint violation        |
| 422         | BUSINESS_RULE_VIOLATION | Business logic constraint violated |
| 500         | INTERNAL_SERVER_ERROR   | Unexpected server error            |

---

## 5. API Routes Specification

### 5.1 Factory Routes

| Method | Route                          | Description                                    | Auth Required |
| ------ | ------------------------------ | ---------------------------------------------- | ------------- |
| GET    | `/api/v1/factories`            | List all factories with pagination and filters | No            |
| GET    | `/api/v1/factories/:factoryId` | Get single factory with optional relations     | No            |
| POST   | `/api/v1/factories`            | Create a new factory                           | Yes           |
| PATCH  | `/api/v1/factories/:factoryId` | Update factory details                         | Yes           |
| DELETE | `/api/v1/factories/:factoryId` | Delete factory (cascade all relations)         | Yes           |

#### GET /api/v1/factories

**Query Parameters:**

- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `industryType` (string) - Filter by industry
- `factoryLocation` (string) - Filter by location
- `search` (string) - Search in factoryName or factoryCode

**Example Request:**

```
GET /api/v1/factories?industryType=automotive&page=1&limit=10
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "factoryId": 1,
      "factoryCode": "FAC-001",
      "factoryName": "Chennai Auto Plant",
      "industryType": "automotive",
      "factoryLocation": "Chennai, Tamil Nadu",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-02-01T14:20:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

#### GET /api/v1/factories/:factoryId

**Query Parameters:**

- `include` (string[]) - Relations to include: `bays`, `machines`, `machineTypes`, `inventory`

**Example Request:**

```
GET /api/v1/factories/1?include=bays,machines
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "factoryId": 1,
    "factoryCode": "FAC-001",
    "factoryName": "Chennai Auto Plant",
    "industryType": "automotive",
    "factoryLocation": "Chennai, Tamil Nadu",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-02-01T14:20:00Z",
    "bays": [
      {
        "bayId": 1,
        "bayName": "Assembly Bay A",
        "maxMachineCapacity": 10,
        "isActive": true
      }
    ],
    "machines": [
      {
        "machineId": 1,
        "modelNumber": "ROB-500X",
        "healthState": "OPERATIONAL",
        "isAvailable": true
      }
    ]
  }
}
```

#### POST /api/v1/factories

**Request Body:**

```json
{
  "factoryCode": "FAC-002",
  "factoryName": "Mumbai Electronics Plant",
  "industryType": "electronics",
  "factoryLocation": "Mumbai, Maharashtra"
}
```

**Validation:**

- `factoryCode` required, unique, 3-20 characters
- `factoryName` required, 3-100 characters
- `industryType` required
- `factoryLocation` required

**Response:** 201 Created

```json
{
  "success": true,
  "data": {
    "factoryId": 2,
    "factoryCode": "FAC-002",
    "factoryName": "Mumbai Electronics Plant",
    "industryType": "electronics",
    "factoryLocation": "Mumbai, Maharashtra",
    "createdAt": "2025-02-07T08:15:00Z",
    "updatedAt": "2025-02-07T08:15:00Z"
  }
}
```

#### PATCH /api/v1/factories/:factoryId

**Request Body (partial update):**

```json
{
  "factoryName": "Mumbai Electronics Hub",
  "factoryLocation": "Navi Mumbai, Maharashtra"
}
```

**Response:** 200 OK with updated factory

#### DELETE /api/v1/factories/:factoryId

**Response:** 204 No Content

**Note:** Cascades delete to all related Bays, Machines, MachineTypes, and InventoryItems

---

### 5.2 Bay Routes

| Method | Route                               | Description                      | Auth Required |
| ------ | ----------------------------------- | -------------------------------- | ------------- |
| GET    | `/api/v1/bays`                      | List all bays with filters       | No            |
| GET    | `/api/v1/factories/:factoryId/bays` | List bays for a specific factory | No            |
| GET    | `/api/v1/bays/:bayId`               | Get single bay with machines     | No            |
| POST   | `/api/v1/factories/:factoryId/bays` | Create bay in factory            | Yes           |
| PATCH  | `/api/v1/bays/:bayId`               | Update bay details               | Yes           |
| DELETE | `/api/v1/bays/:bayId`               | Delete bay (cascade machines)    | Yes           |

#### GET /api/v1/bays

**Query Parameters:**

- `page`, `limit`
- `factoryId` (number) - Filter by factory
- `isActive` (boolean) - Filter by active status

#### GET /api/v1/factories/:factoryId/bays

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "bayId": 1,
      "bayName": "Assembly Bay A",
      "maxMachineCapacity": 10,
      "isActive": true,
      "factoryId": 1,
      "createdAt": "2025-01-16T09:00:00Z",
      "updatedAt": "2025-01-16T09:00:00Z",
      "_machineCount": 7
    }
  ]
}
```

**Note:** `_machineCount` is a computed field showing current machines in bay

#### POST /api/v1/factories/:factoryId/bays

**Request Body:**

```json
{
  "bayName": "Welding Bay B",
  "maxMachineCapacity": 15,
  "isActive": true
}
```

**Validation:**

- `bayName` required, 2-50 characters
- `maxMachineCapacity` required, positive integer (1-1000)
- `factoryId` must exist

#### PATCH /api/v1/bays/:bayId

**Special Validation:**

- If reducing `maxMachineCapacity`, ensure current machine count ≤ new capacity
- Returns 422 error if validation fails with details about current machine count

**Error Example:**

```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Cannot reduce capacity below current machine count",
    "details": {
      "currentCapacity": 10,
      "requestedCapacity": 5,
      "currentMachineCount": 7
    }
  }
}
```

---

### 5.3 MachineType Routes

| Method | Route                                                    | Description                            | Auth Required |
| ------ | -------------------------------------------------------- | -------------------------------------- | ------------- |
| GET    | `/api/v1/machine-types`                                  | List machine types with filters        | No            |
| GET    | `/api/v1/factories/:factoryId/machine-types`             | List machine types in factory          | No            |
| GET    | `/api/v1/machine-types/:machineTypeId`                   | Get machine type with machines         | No            |
| POST   | `/api/v1/factories/:factoryId/bays/:bayId/machine-types` | Create machine type in bay             | Yes           |
| PATCH  | `/api/v1/machine-types/:machineTypeId`                   | Update machine type                    | Yes           |
| DELETE | `/api/v1/machine-types/:machineTypeId`                   | Delete machine type (cascade machines) | Yes           |

#### GET /api/v1/machine-types

**Query Parameters:**

- `page`, `limit`
- `factoryId` (number)
- `bayId` (number)
- `search` (string) - Search by typeName

#### POST /api/v1/factories/:factoryId/bays/:bayId/machine-types

**Request Body:**

```json
{
  "typeName": "Robotic Welder",
  "capabilities": {
    "maxThroughput": 100,
    "processes": ["spot_welding", "arc_welding"],
    "materials": ["steel", "aluminum"]
  },
  "constraints": {
    "minTemperature": 15,
    "maxTemperature": 40,
    "powerRequirement": "440V 3-phase"
  }
}
```

**Validation:**

- `factoryId` and `bayId` must exist
- `bayId` must belong to `factoryId`
- `typeName` required, 2-100 characters
- `capabilities` and `constraints` must be valid JSON objects

**Example Response:**

```json
{
  "success": true,
  "data": {
    "machineTypeId": 1,
    "typeName": "Robotic Welder",
    "capabilities": { ... },
    "constraints": { ... },
    "factoryId": 1,
    "bayId": 1,
    "createdAt": "2025-02-07T10:00:00Z",
    "updatedAt": "2025-02-07T10:00:00Z"
  }
}
```

---

### 5.4 Machine Routes

| Method | Route                                                                            | Description                | Auth Required |
| ------ | -------------------------------------------------------------------------------- | -------------------------- | ------------- |
| GET    | `/api/v1/machines`                                                               | List machines with filters | No            |
| GET    | `/api/v1/factories/:factoryId/machines`                                          | List machines in factory   | No            |
| GET    | `/api/v1/machines/:machineId`                                                    | Get machine details        | No            |
| POST   | `/api/v1/factories/:factoryId/bays/:bayId/machine-types/:machineTypeId/machines` | Create machine             | Yes           |
| PATCH  | `/api/v1/machines/:machineId`                                                    | Update machine             | Yes           |
| DELETE | `/api/v1/machines/:machineId`                                                    | Delete machine             | Yes           |

#### GET /api/v1/machines

**Query Parameters:**

- `page`, `limit`
- `factoryId` (number)
- `bayId` (number)
- `machineTypeId` (number)
- `healthState` (enum: OPERATIONAL, MAINTENANCE, DOWN, RETIRED)
- `isAvailable` (boolean)

**Example Request:**

```
GET /api/v1/machines?factoryId=1&healthState=OPERATIONAL&isAvailable=true
```

#### POST /api/v1/factories/:factoryId/bays/:bayId/machine-types/:machineTypeId/machines

**Request Body:**

```json
{
  "modelNumber": "ROB-500X-2025-001",
  "installationDate": "2025-01-20T00:00:00Z",
  "healthState": "OPERATIONAL",
  "usageHours": 0,
  "isAvailable": true
}
```

**Validation:**

- Check `factoryId`, `bayId`, `machineTypeId` consistency
- Verify bay has available capacity (current count < maxMachineCapacity)
- `modelNumber` required, 5-50 characters
- `installationDate` required, cannot be in future
- `healthState` defaults to OPERATIONAL
- `usageHours` defaults to 0, must be ≥ 0

**Capacity Check Error:**

```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Bay has reached maximum machine capacity",
    "details": {
      "bayId": 1,
      "maxCapacity": 10,
      "currentCount": 10
    }
  }
}
```

#### PATCH /api/v1/machines/:machineId

**Common Updates:**

```json
{
  "healthState": "MAINTENANCE",
  "isAvailable": false,
  "usageHours": 1250.5
}
```

**Business Logic:**

- When `healthState` changes to MAINTENANCE/DOWN/RETIRED, auto-set `isAvailable` to `false`
- When `healthState` changes to OPERATIONAL, allow setting `isAvailable` to `true`

---

### 5.5 Inventory Routes

| Method | Route                                    | Description                       | Auth Required |
| ------ | ---------------------------------------- | --------------------------------- | ------------- |
| GET    | `/api/v1/inventory`                      | List inventory items with filters | No            |
| GET    | `/api/v1/factories/:factoryId/inventory` | List inventory for factory        | No            |
| GET    | `/api/v1/inventory/:inventoryId`         | Get inventory item                | No            |
| POST   | `/api/v1/factories/:factoryId/inventory` | Create inventory item             | Yes           |
| PATCH  | `/api/v1/inventory/:inventoryId`         | Update inventory (quantity, sync) | Yes           |
| DELETE | `/api/v1/inventory/:inventoryId`         | Delete inventory item             | Yes           |

#### GET /api/v1/inventory

**Query Parameters:**

- `page`, `limit`
- `factoryId` (number)
- `materialName` (string) - Search by material name
- `lowStock` (boolean) - Filter items with quantity < threshold (threshold: 10 units)

#### POST /api/v1/factories/:factoryId/inventory

**Request Body:**

```json
{
  "materialName": "Steel Sheet 2mm",
  "lotNumber": "LOT-2025-001",
  "quantity": 500,
  "unit": "KG",
  "sapMaterialId": "MAT-12345"
}
```

**Validation:**

- `factoryId` must exist
- `materialName` required, 2-100 characters
- `lotNumber` required, 5-50 characters
- `quantity` required, must be ≥ 0
- `unit` required, must be valid enum value
- `sapMaterialId` required, 5-50 characters
- `lastSyncTime` auto-set to current timestamp

#### PATCH /api/v1/inventory/:inventoryId

**Request Body:**

```json
{
  "quantity": 450,
  "lastSyncTime": "2025-02-07T12:30:00Z"
}
```

**Business Logic:**

- When `quantity` is updated, auto-update `lastSyncTime` to current timestamp (unless explicitly provided)

---

## 6. Implementation Status & Roadmap

### ✅ Phase 1: Core Foundation - COMPLETED

**Status:** ✅ DONE (February 11, 2025)

- ✅ Set up project structure with Express
- ✅ Configure Prisma with migrations
- ✅ Implement Factory CRUD routes (all working)
- ✅ Implement Bay CRUD routes (all working)
- ✅ Add request validation (Zod)
- ✅ Set up error handling middleware

**Deliverables Completed:**

- Factory and Bay management working end-to-end
- Basic validation and error responses
- Tested with Postman

### ✅ Phase 2: Equipment Layer - PARTIALLY COMPLETED

**Status:** 🟡 IN PROGRESS

- ✅ Implement MachineType CRUD routes (all working)
- ❌ Implement Machine CRUD routes (PENDING)
- ✅ Add consistency validation (factory-bay-machineType relationships)
- ⏸️ Add capacity validation for bays (ready, pending Machine implementation)

**Deliverables Completed:**

- Machine Type management working
- Business rule enforcement for MachineType
- Validation for nested resource creation

**Next Steps:**

- Implement Machine CRUD operations
- Add bay capacity validation during machine creation
- Test health state auto-updates

### ✅ Phase 3: Inventory Management - COMPLETED

**Status:** ✅ DONE (February 11, 2025)

- ✅ Implement Inventory CRUD routes (all working)
- ✅ Add low-stock filtering
- ✅ SAP integration preparation (sync timestamp tracking)
- ✅ Fixed query parameter type conversion issues

**Deliverables Completed:**

- Inventory tracking operational
- Low stock alerts with configurable threshold
- Auto-update lastSyncTime on quantity changes

### 🔜 Phase 4: Machine Implementation - NEXT

**Status:** 📋 PLANNED
**Priority:** P1 (Critical Path)

- Implement Machine CRUD routes
- Add bay capacity validation (check maxMachineCapacity)
- Add consistency validation (factory-bay-machineType must match)
- Auto-update isAvailable based on healthState
- Health state transitions (OPERATIONAL → MAINTENANCE → DOWN → RETIRED)

**Deliverables:**

- Complete machine lifecycle management
- Capacity enforcement preventing bay overflow
- Health monitoring and availability tracking

### 🔮 Phase 5: Advanced Features - FUTURE

**Status:** 📋 PLANNED
**Priority:** P3 (Future Enhancement)

- Planning endpoints (availability-check, inventory-check)
- Scheduling suggestions based on constraints
- Analytics and reporting endpoints
- WebSocket for real-time machine status updates
- Authentication and authorization
- API documentation (Swagger/OpenAPI)

---

## 7. Technical Stack

### Backend

- **Runtime:** Node.js 20+
- **Framework:** Express.js or Fastify
- **ORM:** Prisma 5+
- **Database:** PostgreSQL 15+
- **Validation:** Zod
- **Testing:** Jest + Supertest

### DevOps

- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Monitoring:** (TBD - Prometheus/Grafana)

### Documentation

- **API Docs:** Swagger/OpenAPI 3.0
- **Code Docs:** TSDoc

---

## 8. Testing Strategy

### Unit Tests

- Validation schemas (Zod)
- Business logic functions (capacity checks, consistency validation)
- Service layer methods

### Integration Tests

- API endpoints (all CRUD operations)
- Database operations (Prisma queries)
- Error handling flows

### Test Coverage Target

- Minimum 80% code coverage
- 100% coverage for business logic

---

## 9. Security Considerations

### Authentication & Authorization

- **Phase 1:** No auth (development only)
- **Phase 2:** JWT-based authentication
- **Phase 3:** Role-based access control (Admin, Manager, Operator)

### Data Validation

- All inputs validated with Zod schemas
- SQL injection prevention via Prisma (parameterized queries)
- XSS prevention via input sanitization

### Rate Limiting

- API rate limiting: 100 requests/minute per IP
- Implement in Phase 2

---

## 10. Appendix

### 10.1 Query Parameters Reference

| Endpoint           | Supported Params                                                                     |
| ------------------ | ------------------------------------------------------------------------------------ |
| GET /factories     | `page`, `limit`, `industryType`, `factoryLocation`, `search`                         |
| GET /bays          | `page`, `limit`, `factoryId`, `isActive`                                             |
| GET /machine-types | `page`, `limit`, `factoryId`, `bayId`, `search`                                      |
| GET /machines      | `page`, `limit`, `factoryId`, `bayId`, `machineTypeId`, `healthState`, `isAvailable` |
| GET /inventory     | `page`, `limit`, `factoryId`, `materialName`, `lowStock`                             |

### 10.2 Enum Values Reference

**HealthState:**

- `OPERATIONAL` - Machine is working normally
- `MAINTENANCE` - Machine is under maintenance
- `DOWN` - Machine is broken/not working
- `RETIRED` - Machine is decommissioned

**Unit:**

- Weight: `G`, `KG`, `OZ`, `LB`
- Volume: `ML`, `L`, `TSP`, `TBSP`, `CUP`, `FL_OZ`
- Other: `PINCH`, `PIECE`

### 10.3 Implemented & Tested Endpoints (v1.3)

#### ✅ Factory Endpoints

| Method | Endpoint                | Status     | Notes                             |
| ------ | ----------------------- | ---------- | --------------------------------- |
| GET    | `/api/v1/factories`     | ✅ Working | Supports filtering and pagination |
| GET    | `/api/v1/factories/:id` | ✅ Working | Supports `include` query param    |
| POST   | `/api/v1/factories`     | ✅ Working | Creates factory with validation   |
| PATCH  | `/api/v1/factories/:id` | ✅ Working | Partial updates supported         |
| DELETE | `/api/v1/factories/:id` | ✅ Working | Cascades to all related entities  |

#### ✅ Bay Endpoints

| Method | Endpoint                            | Status     | Notes                                              |
| ------ | ----------------------------------- | ---------- | -------------------------------------------------- |
| GET    | `/api/v1/bays`                      | ✅ Working | Global bay listing                                 |
| GET    | `/api/v1/factories/:factoryId/bays` | ✅ Working | Returns `_machineCount`                            |
| GET    | `/api/v1/bays/:id`                  | ✅ Working | Includes machines and types                        |
| POST   | `/api/v1/factories/:factoryId/bays` | ✅ Working | Validates capacity limits                          |
| PATCH  | `/api/v1/bays/:id`                  | ✅ Working | Prevents capacity reduction below current machines |
| DELETE | `/api/v1/bays/:id`                  | ✅ Working | Cascades to machines and types                     |

#### ✅ MachineType Endpoints

| Method | Endpoint                                                 | Status     | Notes                               |
| ------ | -------------------------------------------------------- | ---------- | ----------------------------------- |
| GET    | `/api/v1/machine-types`                                  | ✅ Working | Supports filtering by factory/bay   |
| GET    | `/api/v1/factories/:factoryId/machine-types`             | ✅ Working | Factory-specific listing            |
| GET    | `/api/v1/machine-types/:id`                              | ✅ Working | Includes related machines           |
| POST   | `/api/v1/factories/:factoryId/bays/:bayId/machine-types` | ✅ Working | Validates factory-bay relationship  |
| PATCH  | `/api/v1/machine-types/:id`                              | ✅ Working | Updates capabilities/constraints    |
| DELETE | `/api/v1/machine-types/:id`                              | ✅ Working | Prevents deletion if machines exist |

#### ✅ Inventory Endpoints

| Method | Endpoint                                       | Status     | Notes                                        |
| ------ | ---------------------------------------------- | ---------- | -------------------------------------------- |
| GET    | `/api/v1/inventory`                            | ✅ Working | Supports low-stock filtering                 |
| GET    | `/api/v1/inventory?factoryId=3`                | ✅ Fixed   | Type conversion issue resolved               |
| GET    | `/api/v1/inventory?lowStock=true&threshold=50` | ✅ Working | Configurable threshold                       |
| GET    | `/api/v1/factories/:factoryId/inventory`       | ✅ Working | Factory-specific inventory                   |
| GET    | `/api/v1/inventory/:id`                        | ✅ Working | Single item details                          |
| POST   | `/api/v1/factories/:factoryId/inventory`       | ✅ Working | Auto-sets lastSyncTime                       |
| PATCH  | `/api/v1/inventory/:id`                        | ✅ Working | Auto-updates lastSyncTime on quantity change |
| DELETE | `/api/v1/inventory/:id`                        | ✅ Working | Hard delete                                  |

#### ⏸️ Machine Endpoints (Pending Implementation)

| Method | Endpoint                                                                  | Status     | Notes                            |
| ------ | ------------------------------------------------------------------------- | ---------- | -------------------------------- |
| GET    | `/api/v1/machines`                                                        | ⏸️ Pending | Planned with extensive filtering |
| POST   | `/api/v1/factories/:factoryId/bays/:bayId/machine-types/:typeId/machines` | ⏸️ Pending | Will include capacity validation |
| PATCH  | `/api/v1/machines/:id`                                                    | ⏸️ Pending | Will auto-update availability    |
| DELETE | `/api/v1/machines/:id`                                                    | ⏸️ Pending | Planned                          |

### 10.4 Common Response Formats

**Success Response:**

```json
{
  "success": true,
  "data": {
    /* entity or array */
  },
  "meta": {
    /* pagination info if applicable */
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": {
      /* specific error details */
    }
  }
}
```

---

## 11. Revision History

| Version | Date       | Changes                                                                                                                                                                    |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2025-02-07 | Initial PRD based on Prisma schema                                                                                                                                         |
| 1.1     | 2025-02-07 | Removed SapSystem; updated schema and PRD                                                                                                                                  |
| 1.2     | 2025-02-07 | Added indexes, updatedAt, enums; refined validation rules and API routes                                                                                                   |
| 1.3     | 2025-02-11 | Updated implementation status: Factories ✅, Bays ✅, MachineTypes ✅, Inventory ✅; Fixed inventory query parameter type conversion; Updated roadmap with actual progress |

---

## 12. Implementation Notes & Lessons Learned

### Known Issues Fixed

1. **Inventory Query Parameter Type Conversion** (v1.3)
   - Issue: Query parameters passed as strings instead of numbers to Prisma
   - Fix: Added explicit type conversion in service layer: `parseInt()` and `parseFloat()`
   - Affected routes: GET /inventory with factoryId filter

### Best Practices Established

1. **Type Safety**: Always convert query parameters to expected types before passing to Prisma
2. **Validation**: Use Zod schemas for request validation at route level
3. **Error Handling**: Implement consistent error responses with specific error codes
4. **Auto-timestamps**: Leverage `lastSyncTime` auto-update when quantity changes in inventory

### Testing Checklist

- ✅ Factories: All CRUD operations tested and working
- ✅ Bays: All CRUD operations tested and working
- ✅ MachineTypes: All CRUD operations tested and working
- ✅ Inventory: All CRUD operations tested and working
- ⏸️ Machines: Pending implementation

---

## 13. Open Questions & Future Considerations

1. **Authentication:** When to implement JWT auth? (Recommended: before Phase 2)
2. **Soft Delete:** Should we implement soft delete instead of hard delete? (Recommended: Yes for audit trail)
3. **Audit Logs:** Track who made changes and when? (Recommended: Phase 4)
4. **File Uploads:** Will machines need manuals/documents attached? (Future consideration)
5. **Multi-tenancy:** Support multiple organizations in single deployment? (Future consideration)
6. **Real-time Updates:** WebSocket for live machine status? (Phase 4)

---

**Document Owner:** Development Team  
**Last Review:** February 11, 2025  
**Next Review:** March 11, 2025  
**Implementation Status:** 75% Complete (4/5 modules implemented)
