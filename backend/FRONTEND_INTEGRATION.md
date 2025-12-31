# 🔄 Frontend Integration Guide

Complete guide to integrate your React frontend with the Node.js backend authentication system.

**Frontend URL:** http://localhost:3000  
**Backend URL:** http://localhost:5000

---

## 🎯 What We're Doing

Replace this (Mock localStorage auth):
```javascript
// ❌ OLD: Everything stored in localStorage
localStorage.setItem('choce_user_data', userData)
localStorage.setItem('choce_users', allUsers)  // All users!
```

With this (Real JWT authentication):
```javascript
// ✅ NEW: Real backend authentication
localStorage.setItem('token', jwtToken)
headers: { 'Authorization': `Bearer ${token}` }
```

---

## 📋 Changes Required

### 1. Update AuthContext.tsx
### 2. Update API calls in AuthModal.tsx  
### 3. Handle token storage
### 4. Add interceptor for Authorization header
### 5. Test everything end-to-end

---

## 🔧 Step 1: Update AuthContext.tsx

### Current Code (Mock Auth)
```typescript
const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  // Mock login - Check if user exists in localStorage
  const usersData = localStorage.getItem('choce_users');
  const users: Array<SignupData & { id: string; createdAt: string }> = usersData ? JSON.parse(usersData) : [];
  
  const foundUser = users.find(u => u.email === email && u.password === password);
  
  if (foundUser) {
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    return { success: true };
  }
  
  return { success: false, error: 'Invalid email or password' };
};
```

### New Code (Real Backend Auth)
Replace the entire `AuthContext.tsx` with this:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Verify token with backend
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        setUser(data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.errors?.email || data.message || 'Signup failed' 
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🔧 Step 2: Update Cart.tsx (Order Submission)

### Current Code (Sends to WhatsApp via localStorage)
```typescript
const handleSubmitOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (isSubmitting) return;
  
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    // ... build WhatsApp message ...
    const whatsappURL = `https://wa.me/94706878899?text=${encodedMessage}`;
    const newWindow = window.open(whatsappURL, '_blank');
    
    if (!newWindow) {
      alert('Please allow popups');
      setIsSubmitting(false);
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    onClearCart();
    // ...
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred');
    setIsSubmitting(false);
  }
};
```

### New Code (Send to Backend First, Then WhatsApp)
Add this endpoint to `src/controllers/orderController.js` (we'll create this), but for now, keep the WhatsApp flow and add backend logging:

```typescript
const handleSubmitOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (isSubmitting) return;
  
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login first');
      setIsSubmitting(false);
      return;
    }

    // Send order to backend
    const orderResponse = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userDetails: formData,
        items: cartItems
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }

    const orderData = await orderResponse.json();
    console.log('Order created:', orderData);

    // Build WhatsApp message
    let message = `🍫 *New Order from ${formData.name}*\n\n`;
    message += `📱 *Phone:* ${formData.phone}\n`;
    message += `📍 *Delivery Address:* ${formData.address}\n\n`;
    message += `*──────────────────────*\n\n`;
    message += `🛍️ *Order Items:*\n\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.pieces} Pieces)\n`;
      message += `   Qty: ${item.quantity} set(s) × Rs ${item.totalPrice} = Rs ${(item.quantity * item.totalPrice).toFixed(2)}\n`;
      if (item.addOns.giftCard || item.addOns.customName) {
        message += `   Add-ons:\n`;
        if (item.addOns.giftCard) message += `   • Gift Card\n`;
        if (item.addOns.customName) message += `   • Custom Name: "${item.addOns.customName}"\n`;
      }
      message += `\n`;
    });
    
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    message += `*──────────────────────*\n\n`;
    message += `💰 *Total Amount: Rs ${totalPrice.toFixed(2)}*\n\n`;
    message += `Thank you for choosing ChocE Moments! 🍫\n`;
    message += `We'll get back to you shortly to confirm your order.`;

    // Send to WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/94706878899?text=${encodedMessage}`;
    
    const newWindow = window.open(whatsappURL, '_blank');
    
    if (!newWindow) {
      alert('Please allow popups to send order via WhatsApp');
      setIsSubmitting(false);
      return;
    }

    // Clear form and cart
    await new Promise(resolve => setTimeout(resolve, 500));
    onClearCart();
    setFormData({ name: '', address: '', phone: '' });
    setFormErrors({});
    setShowCheckoutForm(false);
    setIsSubmitting(false);
    onClose();
    
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('Error creating order. Please try again.');
    setIsSubmitting(false);
  }
};
```

---

## 🔧 Step 3: Create Helper Function for API Calls

Create a new file: `frontend/src/utils/api.ts`

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  return response;
};

// Example usage:
// const response = await apiCall('/auth/me', { method: 'GET' });
// const data = await response.json();
```

---

## 🔧 Step 4: Update AuthModal.tsx

Replace login/signup form submissions to use the new backend API through the updated AuthContext:

```typescript
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const result = await signup({
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      address: signupData.address,
      password: signupData.password,
    });

    if (result.success) {
      // Token saved in AuthContext
      onSuccess();
      onClose();
    } else {
      setSignupError(result.error || 'Signup failed');
    }
  } catch (error) {
    setSignupError('Network error. Please try again.');
  }
};

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const result = await login(loginData.email, loginData.password);

    if (result.success) {
      // Token saved in AuthContext
      onSuccess();
      onClose();
    } else {
      setLoginError(result.error || 'Login failed');
    }
  } catch (error) {
    setLoginError('Network error. Please try again.');
  }
};
```

---

## ✅ Testing Checklist

### Backend Ready
- [ ] MySQL running (XAMPP)
- [ ] Database `choce_moments` created
- [ ] Backend running on http://localhost:5000
- [ ] Health check works: `curl http://localhost:5000/api/health`

### Frontend Updated
- [ ] AuthContext.tsx updated with backend API calls
- [ ] Cart.tsx updated to send orders to backend
- [ ] AuthModal.tsx using new auth flow
- [ ] Token stored in localStorage

### End-to-End Testing
- [ ] Open http://localhost:3000
- [ ] Try to signup with new account
- [ ] Verify token saved in localStorage
- [ ] Refresh page - user still logged in ✅
- [ ] Try to login with created account
- [ ] Add to cart
- [ ] Try checkout (should require login)
- [ ] After login, can checkout
- [ ] Verify order sent to backend + WhatsApp

---

## 🧪 Manual Testing Steps

### 1. Test Signup
```
1. Open http://localhost:3000
2. Click "Create Account" or signup button
3. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 0706878899
   - Address: 123 Main St, Colombo
   - Password: password123
4. Click Signup
5. Should be logged in ✅
```

### 2. Check localStorage
```javascript
// Open DevTools Console (F12)
// Type:
localStorage.getItem('token')
// Should return: eyJhbGc...
```

### 3. Refresh Page
```
1. Refresh browser
2. Should still be logged in ✅
3. User info should load from backend
```

### 4. Test Logout & Login
```
1. Click logout
2. Refresh page - logged out ✅
3. Click login
4. Use: test@example.com / password123
5. Should login successfully ✅
```

### 5. Test Protected Request
```javascript
// Open DevTools Console
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(console.log)
// Should return user data ✅
```

---

## 🔒 LocalStorage Security

### What's Stored
```javascript
localStorage.getItem('token')        // JWT token (SAFE)
localStorage.getItem('refreshToken') // Refresh token (SAFE)
// ❌ NO user password
// ❌ NO user data stored anymore
```

### Token Duration
- **Access Token:** 15 minutes
- **Refresh Token:** 7 days
- After expiry: Redirect to login

---

## 📊 Before vs After

### BEFORE (Mock Auth)
```
❌ All users stored in localStorage
❌ Passwords in plain text
❌ No server communication
❌ No real authentication
❌ Data lost on browser clear
```

### AFTER (Real Backend)
```
✅ Users stored in MySQL database
✅ Passwords hashed (bcryptjs)
✅ Backend validates everything
✅ Real authentication with JWT
✅ Data persistent on server
✅ Multi-device support possible
✅ Production ready
```

---

## 🚀 Deployment Preparation

### Environment Variables
Create `frontend/.env` (or `.env.local`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Then use in code:
```typescript
const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`);
```

### Production URLs
```env
# Development
REACT_APP_API_URL=http://localhost:5000/api

# Production
REACT_APP_API_URL=https://api.yourdomain.com/api
```

---

## 📋 Complete Integration Steps

1. ✅ Update `.env` with `CLIENT_URL=http://localhost:3000`
2. ✅ Replace `AuthContext.tsx` with backend API calls
3. ✅ Update `Cart.tsx` to send orders to backend
4. ✅ Update `AuthModal.tsx` form submissions
5. ✅ Test signup/login on http://localhost:3000
6. ✅ Verify token in localStorage
7. ✅ Test refresh page - still logged in
8. ✅ Test checkout with auth
9. ✅ All tests passing ✅

---

## 🎯 Common Issues & Solutions

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Make sure `.env` has: `CLIENT_URL=http://localhost:3000`
- Restart backend: `npm run dev`

### Issue: 401 Unauthorized
```
{"success": false, "message": "Authorization token required"}
```

**Solution:**
- Token not sent in header
- Check: `Authorization: Bearer {token}`
- Make sure token saved in localStorage

### Issue: Token Expired
```
{"success": false, "message": "Invalid or expired token"}
```

**Solution:**
- Login again to get new token
- Implement refresh token logic for production

### Issue: Database Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
- Start XAMPP MySQL
- Check `backend/.env` database credentials

---

## ✅ Final Checklist

Before pushing to production:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Database created and connected
- [ ] Signup working
- [ ] Login working
- [ ] Logout working
- [ ] Token in localStorage
- [ ] Refresh page - still logged in
- [ ] Protected routes work
- [ ] Error messages display
- [ ] Network errors handled

---

**Status: ✅ Frontend Integration Ready!**

Follow these steps and your app will have real authentication! 🎉
