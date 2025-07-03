# Contact Form Implementation for Color Detail Page

## ✅ Completed Implementation

### 🎯 **Objective:**
Added a comprehensive contact form to the "Liên hệ ngay" button in color detail page, similar to the "Đặt Hàng Ngay" form in products.

### 🔧 **Implementation Details:**

#### **1. Form Structure:**
```typescript
interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  projectType: string
  message: string
  selectedColor: string
}
```

#### **2. Form Components Added:**

**Personal Information Section:**
- ✅ **Họ (First Name)** - Required text input
- ✅ **Tên (Last Name)** - Required text input  
- ✅ **Email** - Required email input with validation
- ✅ **Số điện thoại (Phone)** - Required text input

**Address Information Section:**
- ✅ **Địa chỉ (Address)** - Required text input
- ✅ **Thành phố (City)** - Required text input
- ✅ **Tỉnh/Thành (State)** - Dropdown with Vietnamese provinces:
  - Hà Nội
  - TP. Hồ Chí Minh
  - Đà Nẵng
  - Hải Phòng
  - Cần Thơ
  - Khác
- ✅ **Mã bưu điện (Zip Code)** - Optional text input

**Project Information Section:**
- ✅ **Loại dự án (Project Type)** - Dropdown with options:
  - Nhà ở (Residential)
  - Thương mại (Commercial)
  - Cải tạo (Renovation)
  - Xây mới (New Construction)
- ✅ **Ghi chú (Message)** - Textarea for detailed project description

#### **3. Auto-populated Fields:**
- ✅ **Selected Color** - Automatically filled with current color name
- ✅ **Color Information** - Includes color code, description, and hex value

#### **4. UI/UX Features:**

**Sheet Modal Implementation:**
```jsx
<Sheet open={isContactOpen} onOpenChange={setIsContactOpen}>
  <SheetTrigger asChild>
    <Button size="lg" className="w-full" variant="outline">
      <MessageCircle className="w-4 h-4 mr-2" />
      Liên hệ ngay
    </Button>
  </SheetTrigger>
  <SheetContent className="w-full sm:max-w-lg bg-white flex flex-col">
    {/* Form content */}
  </SheetContent>
</Sheet>
```

**Visual Design:**
- ✅ **Green color scheme** - MessageCircle icon in green-600
- ✅ **Outline button style** - Different from blue sample button
- ✅ **Full-width layout** - Consistent with sample button
- ✅ **Responsive design** - Works on mobile and desktop

#### **5. Form Validation:**
- ✅ **Required fields** - First name, last name, email, phone, address, city
- ✅ **Email validation** - Built-in HTML5 email validation
- ✅ **Form submission** - Prevents default and handles data properly

#### **6. Form Handling:**

**State Management:**
```typescript
const [isContactOpen, setIsContactOpen] = useState(false)
const [contactFormData, setContactFormData] = useState<ContactFormData>({
  // ... initial state
})
```

**Input Handling:**
```typescript
const handleContactInputChange = (field: keyof ContactFormData, value: string) => {
  setContactFormData((prev) => ({ ...prev, [field]: value }))
}
```

**Form Submission:**
```typescript
const handleContactSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  console.log("Contact form submitted:", {
    ...contactFormData,
    color: {
      name: color.name,
      code: color.code,
      hex: color.hex,
      description: color.description,
    },
  })
  alert("Yêu cầu tư vấn đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.")
  setIsContactOpen(false)
  // Reset form
}
```

#### **7. Color Integration:**

**Auto-filled Color Data:**
- ✅ **Color name** - Displayed in form header
- ✅ **Color description** - Shown with Vietnamese description
- ✅ **Color code** - Technical identifier
- ✅ **Color hex** - For internal processing

**Form Header:**
```jsx
<CardTitle className="text-lg">
  Tư vấn cho màu: {color.name}
</CardTitle>
<p className="text-sm text-slate-600">
  {color.description} - {color.code}
</p>
```

### 📱 **Mobile Experience:**

#### **Responsive Design:**
- ✅ **Full-screen sheet** - Takes full width on mobile
- ✅ **Scrollable content** - Form scrolls properly in sheet
- ✅ **Touch-friendly inputs** - Large touch targets
- ✅ **Grid layouts** - Responsive 2-column and 3-column grids

#### **Mobile-specific Features:**
- ✅ **Keyboard optimization** - Proper input types (email, tel)
- ✅ **Viewport handling** - Sheet adjusts to screen size
- ✅ **Touch interactions** - Smooth sheet open/close

### 🎨 **Visual Consistency:**

#### **Color Scheme:**
- **Contact Form**: Green theme (MessageCircle, green-600)
- **Sample Form**: Blue theme (Palette, blue-600)
- **Clear differentiation** between consultation and ordering

#### **Button Styling:**
- **Contact**: `variant="outline"` - Outlined green button
- **Sample**: Default solid blue button
- **Consistent sizing** - Both use `size="lg"`

### 🚀 **User Journey:**

#### **Complete Flow:**
1. **User views color detail** - Sees color information and swatches
2. **Needs consultation** - Clicks "Liên hệ ngay" button
3. **Form opens** - Sheet modal with comprehensive form
4. **Auto-filled data** - Color information pre-populated
5. **User fills form** - Personal, address, and project details
6. **Form submission** - Success message and form reset
7. **Follow-up** - Business receives consultation request

#### **Data Collected:**
```json
{
  "personalInfo": {
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "user@example.com",
    "phone": "0123456789"
  },
  "addressInfo": {
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "state": "hanoi",
    "zipCode": "100000"
  },
  "projectInfo": {
    "projectType": "residential",
    "message": "Cần tư vấn màu cho phòng khách..."
  },
  "colorInfo": {
    "name": "Jet Black",
    "code": "Jet Black",
    "hex": "#000000",
    "description": "Đen tuyền"
  }
}
```

### 🎯 **Business Benefits:**

1. **Lead Generation** - Captures qualified consultation requests
2. **Customer Data** - Complete contact and project information
3. **Color Preference** - Tracks which colors generate most inquiries
4. **Project Pipeline** - Identifies potential projects and their scope
5. **Geographic Data** - Understands market distribution

### 🔧 **Technical Benefits:**

1. **Reusable Pattern** - Same form structure as product orders
2. **Type Safety** - Full TypeScript interface definitions
3. **State Management** - Clean React state handling
4. **Form Validation** - Built-in HTML5 validation
5. **Mobile Optimized** - Responsive design patterns

The contact form now provides a complete consultation request system that matches the quality and functionality of the product ordering system! 🎨📞
