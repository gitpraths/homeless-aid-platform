# Multi-Step Profile Creation Form

Comprehensive guide for the individual registration form with 5 steps.

## 📋 Overview

The profile creation form is a multi-step wizard that guides volunteers through registering new homeless individuals in the system. It includes auto-save, offline support, and mobile-friendly design.

## 🎯 Features

### ✅ Implemented Features

1. **5-Step Wizard**
   - Step 1: Basic Information
   - Step 2: Background
   - Step 3: Health Assessment
   - Step 4: Needs Assessment
   - Step 5: Documents

2. **Progress Tracking**
   - Visual progress bar
   - Step indicators with icons
   - Percentage completion
   - Current step highlighting

3. **Auto-Save**
   - Saves to localStorage every 30 seconds
   - Manual save button available
   - Last saved timestamp displayed
   - Draft recovery on page reload

4. **Form Validation**
   - Real-time validation with React Hook Form
   - Clear error messages
   - Required field indicators
   - Field-specific validation rules

5. **Mobile-Friendly**
   - Large touch targets (44px minimum)
   - Responsive grid layouts
   - Touch-optimized inputs
   - Mobile-first design

6. **Offline Support**
   - Data saved to localStorage
   - Works without internet connection
   - Syncs when online (to be implemented)

7. **GPS Auto-Capture**
   - Automatic location capture
   - Manual recapture option
   - Coordinates display

8. **Photo Upload**
   - Image preview
   - File size validation
   - Multiple format support

9. **Document Management**
   - Multiple file uploads
   - File preview
   - Remove uploaded files
   - File size display

## 📝 Form Steps

### Step 1: Basic Information

**Fields:**
- Name* (required, min 2 characters)
- Age* (required, 0-120)
- Gender* (required, dropdown)
- Contact (optional, phone validation)
- Photo (optional, image upload)
- Location* (required, GPS auto-capture)

**Features:**
- Photo preview
- GPS auto-capture on load
- Manual location recapture
- Real-time validation

### Step 2: Background

**Fields:**
- Education Level* (required, dropdown)
- Work History (optional, textarea)
- Skills (multi-select buttons)
- Family Status (dropdown)
- Number of Dependents (number input)
- Previous Addresses (dynamic list)

**Features:**
- 15+ skill options
- Add/remove addresses
- Selected skills display
- Validation for dependents

### Step 3: Health Assessment

**Fields:**
- Overall Health Status* (required, dropdown)
- Medical Conditions (multi-select)
- Current Medications (dynamic list)
- Disabilities (multi-select)
- Special Needs (textarea)

**Features:**
- 11 common conditions
- 6 common disabilities
- Add/remove medications
- Emergency note display

### Step 4: Needs Assessment

**Fields:**
- Immediate Needs* (multi-select, min 1)
- Long-term Goals (multi-select)
- Preferences (textarea)
- Constraints (textarea)

**Features:**
- 9 immediate need options
- 9 long-term goal options
- Priority assessment display
- Selection counter

### Step 5: Documents

**Fields:**
- ID Proof (optional, single file)
- Medical Records (optional, multiple files)
- Other Documents (optional, multiple files)

**Features:**
- Drag & drop upload
- File preview
- Remove files
- File size display
- Document summary

## 🔧 Technical Implementation

### Technologies Used

```typescript
- React Hook Form: Form state management and validation
- TypeScript: Type safety
- Tailwind CSS: Styling
- Lucide React: Icons
- React Hot Toast: Notifications
```

### Form State Management

```typescript
interface FormData {
  // Basic Information
  name: string
  age: number
  gender: string
  contact?: string
  photo?: File
  location: { lat: number; lon: number }
  
  // Background
  education: string
  workHistory: string
  skills: string[]
  familyStatus: string
  dependents: number
  previousAddresses: string[]
  
  // Health Assessment
  healthStatus: string
  medicalConditions: string[]
  medications: string[]
  disabilities: string[]
  specialNeeds: string
  
  // Needs Assessment
  immediateNeeds: string[]
  longTermGoals: string[]
  preferences: string
  constraints: string
  
  // Documents
  documents: {
    idProof?: File
    medicalRecords?: File[]
    otherDocuments?: File[]
  }
}
```

### Auto-Save Implementation

```typescript
// Auto-save every 30 seconds
useEffect(() => {
  const interval = setInterval(() => {
    saveDraft()
  }, 30000)
  return () => clearInterval(interval)
}, [watch])

// Save to localStorage
const saveDraft = () => {
  const formData = watch()
  const draft = {
    data: formData,
    step: currentStep,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  setLastSaved(new Date())
}
```

### Draft Recovery

```typescript
// Load draft on mount
useEffect(() => {
  const draft = localStorage.getItem(DRAFT_KEY)
  if (draft) {
    const parsedDraft = JSON.parse(draft)
    reset(parsedDraft.data)
    setCurrentStep(parsedDraft.step)
    setLastSaved(new Date(parsedDraft.timestamp))
    toast.success('Draft loaded')
  }
}, [reset])
```

### GPS Capture

```typescript
const captureLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('location', {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        toast.success('Location captured')
      },
      (error) => {
        toast.error('Failed to capture location')
      }
    )
  }
}
```

## 🎨 UI Components

### Progress Bar

```tsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div
    className="bg-primary-600 h-2 rounded-full transition-all"
    style={{ width: `${progress}%` }}
  />
</div>
```

### Step Indicators

```tsx
{steps.map((step) => (
  <button
    onClick={() => goToStep(step.id)}
    className={`w-12 h-12 rounded-full ${
      isActive ? 'bg-primary-600 text-white' :
      isCompleted ? 'bg-green-500 text-white' :
      'bg-gray-200 text-gray-500'
    }`}
  >
    {isCompleted ? <Check /> : <Icon />}
  </button>
))}
```

### Multi-Select Buttons

```tsx
<button
  onClick={() => toggleSkill(skill)}
  className={`px-4 py-2 rounded-lg ${
    selected ? 'bg-primary-600 text-white' :
    'bg-gray-100 text-gray-700'
  }`}
>
  {skill}
</button>
```

## 📱 Mobile Optimization

### Touch Targets

All interactive elements have minimum 44px × 44px touch targets:

```css
.btn {
  @apply min-h-touch min-w-touch;
}

/* min-h-touch and min-w-touch = 44px */
```

### Responsive Grids

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### Large Input Fields

```css
.input {
  @apply w-full px-4 py-2 min-h-touch;
}
```

## 🔐 Validation Rules

### Name
- Required
- Minimum 2 characters
- Maximum 100 characters

### Age
- Required
- Minimum 0
- Maximum 120

### Contact
- Optional
- Phone number format validation

### Location
- Required
- Valid GPS coordinates

### Education
- Required
- Dropdown selection

### Health Status
- Required
- Dropdown selection

### Immediate Needs
- Required
- At least 1 selection

## 💾 Data Persistence

### LocalStorage Structure

```json
{
  "data": {
    "name": "John Doe",
    "age": 35,
    "gender": "male",
    ...
  },
  "step": 3,
  "timestamp": "2024-11-10T10:30:00Z"
}
```

### Clear Draft

```typescript
const clearDraft = () => {
  localStorage.removeItem(DRAFT_KEY)
  setLastSaved(null)
}
```

## 🚀 Usage

### Access the Form

```
/dashboard/add-individual
```

### Navigation

- **Next**: Proceed to next step
- **Previous**: Go back to previous step
- **Save Draft**: Manually save current progress
- **Submit**: Complete registration (final step only)

### Keyboard Shortcuts

- **Enter**: Add item to list (addresses, medications)
- **Tab**: Navigate between fields

## 🎯 Best Practices

### For Volunteers

1. **Start with GPS**: Capture location first
2. **Save Frequently**: Use manual save for important data
3. **Complete All Steps**: Even optional fields help
4. **Upload Documents**: ID proof speeds up placement
5. **Be Thorough**: More information = better assistance

### For Developers

1. **Validate Early**: Use React Hook Form validation
2. **Save Often**: 30-second auto-save is good
3. **Handle Errors**: Show clear error messages
4. **Test Offline**: Ensure localStorage works
5. **Optimize Images**: Compress before upload

## 🐛 Troubleshooting

### Draft Not Loading

- Check browser localStorage
- Clear cache and reload
- Check console for errors

### GPS Not Working

- Enable location permissions
- Use HTTPS (required for geolocation)
- Try manual entry as fallback

### File Upload Issues

- Check file size (max 10MB)
- Verify file format (PDF, JPG, PNG)
- Clear browser cache

### Form Not Submitting

- Check all required fields
- Verify validation errors
- Check network connection
- Review console logs

## 📊 Analytics

Track form completion:
- Step completion rates
- Average time per step
- Drop-off points
- Field error rates

## 🔄 Future Enhancements

- [ ] Sync with backend API
- [ ] Image compression
- [ ] Signature capture
- [ ] Voice notes
- [ ] QR code scanning
- [ ] Biometric data
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Advanced validation
- [ ] Progress analytics

## 📚 Related Documentation

- [Volunteer Dashboard](./VOLUNTEER_DASHBOARD.md)
- [API Integration](./README.md)
- [Component Library](./COMPONENTS.md)

---

For support, contact the development team or check the main README.
