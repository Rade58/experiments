### **`allowImportingTsExtensions` Requires Specific Conditions**

```json
// apps/habits/tsconfig.json
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,  // ❌ Won't work with NodeNext!
    "moduleResolution": "NodeNext"       // Inherited from root
  }
}
```

**The Problem:**

`allowImportingTsExtensions` **only works with**:
- `moduleResolution: "bundler"` **OR**
- `noEmit: true`

**Your situation:**
- Root has `moduleResolution: "NodeNext"` ✅
- Root has `noEmit: true` ✅
- But `tsconfig.build.json` sets `noEmit: false` ❌

**This will cause errors when building!**

---

### this only working with moduleResolution: 'bundler'? so why is it here?"

```json
"allowImportingTsExtensions": true  // Your question
```

**Answer:** YES! It conflicts with your setup.

**`allowImportingTsExtensions` only works with:**

1. **`moduleResolution: "bundler"`**
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler",  // ✅ Works
       "allowImportingTsExtensions": true
     }
   }
   ```

2. **OR `noEmit: true`**
   ```json
   {
     "compilerOptions": {
       "noEmit": true,  // ✅ Works (type-checking only)
       "allowImportingTsExtensions": true
     }
   }
   ```

**Your setup:**
- `moduleResolution: "NodeNext"` (inherited) ❌
- `tsconfig.build.json` sets `noEmit: false` ❌
- **Result:** Won't work when building!

**Solution:** Remove `allowImportingTsExtensions`

---