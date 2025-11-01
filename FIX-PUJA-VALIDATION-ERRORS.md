# Fix: Puja Series Validation Errors

## Problem

After clicking "Create Series" in the puja creation form, validation errors were
occurring preventing the puja series from being saved.

## Root Causes

1. **Backend Validation Issues**:

   - `community_id` validation expected MongoDB ID but we're using Supabase
     UUIDs
   - `type` field was being sent as "regular" but backend only accepts specific
     values

2. **Frontend Form Issues**:
   - Missing puja type selector in the form
   - Missing deity field
   - Hardcoded type value instead of using form input

## Fixes Applied

### Backend Changes (`backend/src/routes/pujas.js`)

```javascript
// BEFORE
body('community_id')
  .isMongoId()
  .withMessage('Valid community ID is required'),

// AFTER
body('community_id')
  .optional()
  .isUUID()
  .withMessage('Valid community ID is required'),
```

### Frontend Changes

#### 1. Added Puja Type Constants (`src/components/pujas/CreatePujaSeriesModal.tsx`)

```javascript
const PUJA_TYPES = [
	{ value: "aarti", label: "Aarti" },
	{ value: "havan", label: "Havan" },
	{ value: "puja", label: "Puja" },
	{ value: "special_ceremony", label: "Special Ceremony" },
	{ value: "festival", label: "Festival" },
	{ value: "other", label: "Other" },
];
```

#### 2. Added Form Fields

- **Puja Type Selector**: Required dropdown with valid options
- **Deity Field**: Optional text input for deity name
- **Updated Validation**: Include type in required field validation

#### 3. Updated Data Transformation (`src/components/pujas/PujasManagement.tsx`)

```javascript
// BEFORE
type: "puja", // Hardcoded

// AFTER
type: formData.type || "puja", // Use form value
```

## Valid Puja Types

The backend validation accepts these puja types:

- `aarti` - Daily aarti ceremonies
- `havan` - Fire ceremonies
- `puja` - General puja ceremonies
- `special_ceremony` - Special religious ceremonies
- `festival` - Festival celebrations
- `other` - Other types of religious events

## Testing the Fix

1. **Setup Database**: Ensure `setup-puja-series-table.sql` has been run
2. **Open Form**: Go to Pujas → Create Puja Series
3. **Fill Required Fields**:
   - Title: "Morning Aarti"
   - Location: "Main Temple"
   - Priest: "Pandit Sharma"
   - Type: "Aarti" (from dropdown)
   - Deity: "Ganesha" (optional)
   - Start Time: "06:00"
4. **Submit**: Click "Create Series"
5. **Verify Success**: Should see loading → success toast → new puja in list

## Expected Behavior

✅ **Before Fix**: Validation errors, creation failed ✅ **After Fix**: Smooth
creation, success feedback, data saved

## Files Modified

- `backend/src/routes/pujas.js` - Fixed UUID validation
- `src/components/pujas/CreatePujaSeriesModal.tsx` - Added type/deity fields
- `src/components/pujas/PujasManagement.tsx` - Fixed data transformation

The validation errors should now be resolved and puja series creation should
work smoothly.
