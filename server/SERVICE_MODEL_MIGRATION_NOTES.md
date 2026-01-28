# 📝 Service Model Update - Migration Notes

## 🎯 Overview

The Service model has been updated to support the new **Category reference system** and **Figma design requirements** while maintaining **100% backward compatibility** with existing services.

---

## ✅ New Fields Added

### **1. categoryId** (Category Reference)
```javascript
categoryId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
  required: false,  // Optional for backward compatibility
  default: null
}
```

**Purpose**: Reference to Category model for hierarchical organization  
**Migration**: Existing services can continue using the old `category` string field  
**Future**: New services should use `categoryId`

---

### **2. bodyContent** (Card Description)
```javascript
bodyContent: {
  type: String,
  default: '',
  maxlength: 1000
}
```

**Purpose**: Description text shown on service card (from Figma)  
**Example**: "We create the most elegant bridal looks! Contact us to book yours today."  
**Default**: Empty string (for existing services)

---

### **3. ctaContent** (Call-to-Action Button)
```javascript
ctaContent: {
  type: String,
  enum: ['Add', 'Enquire Now'],
  default: 'Add'
}
```

**Purpose**: Button text on service card (from Figma)  
**Options**: "Add" or "Enquire Now"  
**Default**: "Add" (for existing services)

---

### **4. cardType** (Card Layout)
```javascript
cardType: {
  type: String,
  enum: ['Vertical', 'Horizontal'],
  default: 'Vertical'
}
```

**Purpose**: Card layout type (from Figma)  
**Options**: "Vertical" or "Horizontal"  
**Default**: "Vertical" (for existing services)

---

### **5. imagePublicIds** (For Image Deletion)
```javascript
imagePublicIds: [{
  type: String,
  trim: true
}]
```

**Purpose**: Store Cloudinary/S3 public IDs for image deletion  
**Default**: Empty array (for existing services)

---

## 🔄 Backward Compatibility

### **Existing Services (No Migration Needed)**

All existing services will continue to work without any changes:

✅ **Old `category` field** still works (string: 'Regular', 'Premium', etc.)  
✅ **No `categoryId`** is fine (validation allows either category or categoryId)  
✅ **New fields have defaults**:
- `bodyContent`: '' (empty)
- `ctaContent`: 'Add'
- `cardType`: 'Vertical'
- `imagePublicIds`: []

### **New Services (Recommended Approach)**

New services should use:

✅ **`categoryId`** (reference to Category model)  
✅ **`bodyContent`** (card description)  
✅ **`ctaContent`** (button text)  
✅ **`cardType`** (layout type)  
✅ **`imagePublicIds`** (for proper image management)

---

## 📊 Field Comparison

| Field | Old Services | New Services |
|-------|--------------|--------------|
| `category` | ✅ String ('Regular') | ⚠️ Optional (use categoryId instead) |
| `categoryId` | ❌ Not set (null) | ✅ ObjectId reference |
| `bodyContent` | ❌ Not set ('') | ✅ Card description text |
| `ctaContent` | ❌ Not set ('Add') | ✅ 'Add' or 'Enquire Now' |
| `cardType` | ❌ Not set ('Vertical') | ✅ 'Vertical' or 'Horizontal' |
| `imagePublicIds` | ❌ Not set ([]) | ✅ Array of public IDs |

---

## 🔧 Migration Strategies

### **Option A: No Migration (Recommended)**

**Approach**: Leave existing services as-is, use new fields for new services only

**Pros**:
- ✅ Zero downtime
- ✅ No data migration needed
- ✅ Existing services work unchanged

**Cons**:
- ⚠️ Mixed data (some services have categoryId, some have category string)

---

### **Option B: Gradual Migration**

**Approach**: Migrate services one by one when they're edited

**Steps**:
1. When admin updates a service, assign proper `categoryId`
2. Set `category` to null
3. Add `bodyContent`, `ctaContent`, `cardType`

**Implementation**: Handle in update service controller

---

### **Option C: Bulk Migration (If Needed)**

**Approach**: Run a migration script to update all services at once

**Script** (server/src/scripts/migrateServicesToCategories.js):
```javascript
import Service from '../models/service.model.js';
import Category from '../models/category.model.js';
import mongoose from 'mongoose';

async function migrateServices() {
  // Connect to DB
  await mongoose.connect(process.env.MONGO_URI);
  
  // Get all services with old category string
  const services = await Service.find({ category: { $ne: null } });
  
  console.log(`Found ${services.length} services to migrate`);
  
  for (const service of services) {
    // Map old category to new Category
    let categoryName = service.category; // 'Regular', 'Premium', etc.
    
    // Find or create matching category
    let category = await Category.findOne({ 
      name: { $regex: new RegExp(categoryName, 'i') }
    });
    
    if (category) {
      service.categoryId = category._id;
      console.log(`✅ Migrated "${service.name}" to category "${category.name}"`);
    } else {
      console.log(`⚠️ No matching category found for "${categoryName}"`);
    }
    
    await service.save();
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrateServices().catch(console.error);
```

**Run**:
```bash
node server/src/scripts/migrateServicesToCategories.js
```

---

## 🎯 Validation Logic

### **Pre-save Validation**

```javascript
// Ensures at least one category field is set
if (!this.categoryId && !this.category) {
  throw Error('Either categoryId or category is required');
}
```

**This allows**:
- ✅ Services with only `category` (old services)
- ✅ Services with only `categoryId` (new services)
- ✅ Services with both (during migration)
- ❌ Services with neither (validation error)

---

## 📋 Updated Service Schema

### **Complete Field List**:

```javascript
{
  // Basic Info
  name: String (required),
  description: String (required),
  
  // Pricing
  price: Number (required),
  taxIncluded: Boolean,
  
  // Service Details
  duration: String,
  
  // Category (dual support)
  categoryId: ObjectId (ref: Category) [NEW],
  category: String (legacy),
  
  // Service Type
  serviceType: String (enum),
  
  // Media
  image: [String] (required),
  imagePublicIds: [String] [NEW],
  
  // Figma Design Fields
  bodyContent: String [NEW],
  ctaContent: String (enum: Add/Enquire Now) [NEW],
  cardType: String (enum: Vertical/Horizontal) [NEW],
  
  // Status
  isActive: Boolean,
  isAvailable: Boolean,
  
  // Admin Info
  createdBy: ObjectId,
  updatedBy: ObjectId,
  
  // Metadata
  tags: [String],
  popularity: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔍 Query Examples

### **Find by Category (Legacy)**
```javascript
const services = await Service.find({ category: 'Regular' });
```

### **Find by Category ID (New)**
```javascript
const services = await Service.find({ categoryId: categoryObjectId });
// or
const services = await Service.findByCategoryId(categoryObjectId);
```

### **Find with Category Populated**
```javascript
const services = await Service.find({ categoryId: { $ne: null } })
  .populate('categoryId', 'name slug image');
```

---

## ✅ Backward Compatibility Checklist

- ✅ Existing services work unchanged
- ✅ Old `category` field still functional
- ✅ New fields have defaults
- ✅ No breaking changes to existing APIs
- ✅ Frontend can handle both old and new services
- ✅ No data migration required immediately

---

## 🚀 Recommended Approach

**For Your App**:

1. ✅ **Keep existing services as-is** (no migration needed)
2. ✅ **Create new services with categoryId** (use new system)
3. ✅ **Gradually migrate** existing services when editing them
4. ✅ **Frontend handles both** (checks if categoryId exists, falls back to category)

**Benefits**:
- Zero downtime
- No risky data migration
- Smooth transition
- Services work during migration period

---

## 📊 Impact Analysis

### **No Impact On**:
- ✅ Existing bookings (services embedded in bookings)
- ✅ Existing cart items
- ✅ Existing orders
- ✅ Frontend service display
- ✅ Current service APIs

### **New Capabilities**:
- ✅ Hierarchical category organization
- ✅ Service cards with custom body content
- ✅ Flexible CTA buttons
- ✅ Vertical/Horizontal card layouts
- ✅ Better image management (with public IDs)

---

## 🎯 Next: Step 4 (Service Management APIs)

With the updated model, we can now build:
- Create service (with categoryId, bodyContent, ctaContent, cardType)
- Update service (with image upload/replacement)
- List services by category
- Service analytics

---

**Migration Status**: ✅ **COMPLETE & BACKWARD COMPATIBLE**

**No action required for existing services!**

---

**Last Updated**: January 12, 2026
