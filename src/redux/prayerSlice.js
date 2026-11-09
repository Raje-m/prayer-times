import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. دالة جلب البيانات بالمدينة مع التخزين المؤقت (Caching)
export const fetchPrayerTimes = createAsyncThunk(
  'prayer/fetchPrayerTimes',
  async (cityData, thunkAPI) => {
    // حماية: إذا كانت القيمة gps لا تنفذ هذا الطلب
    if (!cityData || cityData.value === 'gps') {
      return thunkAPI.rejectWithValue(null);
    }

    try {
      const todayKey = new Date().toISOString().split('T')[0]; // تاريخ اليوم (مثال: 2026-11-09)
      const cityName = cityData.value;
      const cacheKey = `prayer_city_${cityName}_${todayKey}`;

      // أ. التحقق من وجود البيانات مخزنة محلياً لنفس اليوم
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        console.log("تم استرجاع أوقات الصلاة للمدينة من التخزين المؤقت (Cache) بنجاح!");
        return JSON.parse(cachedData);
      }

      // ب. إذا لم تكن مخزنة، جلبها من الـ API عبر Axios
      const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity`, {
        params: { city: cityName, country: cityData.country || 'Saudi Arabia', method: 4 },
      });

      const timings = response.data.data.timings;

      // ج. حفظ البيانات الجديدة في LocalStorage
      localStorage.setItem(cacheKey, JSON.stringify(timings));

      return timings;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        Fajr: "04:45", Sunrise: "06:10", Dhuhr: "12:05", 
        Asr: "15:30", Maghrib: "18:15", Isha: "19:45"
      });
    }
  }
);

// 2. دالة جلب البيانات بالإحداثيات (GPS) مع التخزين المؤقت
export const fetchPrayerTimesByCoords = createAsyncThunk(
  'prayer/fetchPrayerTimesByCoords',
  async ({ latitude, longitude }, thunkAPI) => {
    try {
      // تقريب الإحداثيات لتجنب تكرار التخزين لفروقات دقيقة جداً في المتر الواحد
      const latFixed = Number(latitude).toFixed(2);
      const lngFixed = Number(longitude).toFixed(2);
      const todayKey = new Date().toISOString().split('T')[0];
      const cacheKey = `prayer_gps_${latFixed}_${lngFixed}_${todayKey}`;

      // أ. التحقق من وجود البيانات المخزنة للإحداثيات
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        console.log("تم استرجاع أوقات الصلاة للإحداثيات من التخزين المؤقت (Cache) بنجاح!");
        return JSON.parse(cachedData);
      }

      // ب. جلب البيانات من الـ API
      const response = await axios.get(`https://api.aladhan.com/v1/timings`, {
        params: { latitude, longitude, method: 4 },
      });

      const result = {
        timings: response.data.data.timings,
        cityName: 'الموقع الحالي (GPS)'
      };

      // ج. حفظ البيانات في LocalStorage
      localStorage.setItem(cacheKey, JSON.stringify(result));

      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        timings: { Fajr: "04:45", Sunrise: "06:10", Dhuhr: "12:05", Asr: "15:30", Maghrib: "18:15", Isha: "19:45" },
        cityName: 'الرياض (افتراضي)'
      });
    }
  }
);

// 3. إعداد الـ Slice
const prayerSlice = createSlice({
  name: 'prayer',
  initialState: {
    selectedCity: { name: 'الرياض', value: 'Riyadh', country: 'Saudi Arabia', label: 'الرياض' },
    timings: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // حالات جلب البيانات بالمدينة
      .addCase(fetchPrayerTimes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrayerTimes.fulfilled, (state, action) => {
        state.loading = false;
        state.timings = action.payload;
      })
      .addCase(fetchPrayerTimes.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.timings = action.payload;
          state.error = 'تعذر الاتصال بالخادم، يتم عرض أوقات تقريبية.';
        }
      })
      // حالات جلب البيانات بالإحداثيات (GPS)
      .addCase(fetchPrayerTimesByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrayerTimesByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.timings = action.payload.timings; 
      })
      .addCase(fetchPrayerTimesByCoords.rejected, (state, action) => {
        state.loading = false;
        state.timings = action.payload?.timings || null;
        state.error = 'تعذر الاتصال بالخادم، يتم عرض أوقات تقريبية.';
      });
  },
});

export const { setSelectedCity } = prayerSlice.actions;
export default prayerSlice.reducer;