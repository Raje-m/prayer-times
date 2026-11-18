import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// دالة تنظيف تلقائية لحذف مواقيت الأيام السابقة مع الحفاظ على المدينة المختارة
const cleanOldPrayerCache = () => {
  try {
    const todayKey = new Date().toISOString().split('T')[0]; // تاريخ اليوم (مثال: 2026-11-17)
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // استهداف مفاتيح مواقيت الصلاة اليومية فقط (للمدن أو الـ GPS)
      if (key && (key.startsWith('prayer_city_') || key.startsWith('prayer_gps_'))) {
        if (!key.endsWith(`_${todayKey}`)) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('خطأ أثناء تنظيف ذاكرة التخزين المؤقت:', error);
  }
};

// دالة مساعدة لجلب المدينة المحفوظة أو العودة للافتراضي
const getSavedCity = () => {
  cleanOldPrayerCache();
  const defaultCity = {
    label: "دمشق - سوريا",
    value: "Damascus, Syria",
    city: "Damascus",
    country: "Syria"
  };

  try {
    const saved = localStorage.getItem('user_selected_city');
    return saved ? JSON.parse(saved) : defaultCity;
  } catch (error) {
    return defaultCity;
  }
};

// 1. دالة جلب البيانات بالمدينة مع الربط الذكي بالكاش الشهري (30 يوماً أوفلاين)
export const fetchPrayerTimes = createAsyncThunk(
  'prayer/fetchPrayerTimes',
  async (cityData, thunkAPI) => {
    // حماية: إذا كانت القيمة gps لا تنفذ هذا الطلب
    if (!cityData || cityData.value === 'gps') {
      return thunkAPI.rejectWithValue(null);
    }

    try {
      const now = new Date();
      const todayKey = now.toISOString().split('T')[0];
      const currentDay = now.getDate();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const cityName = cityData.value;
      const dailyCacheKey = `prayer_city_${cityName}_${todayKey}`;
      const monthlyCacheKey = `monthly_prayer_${cityName}_${currentYear}_${currentMonth}`;

      // أ. التحقق من وجود البيانات مخزنة محلياً لنفس اليوم
      const cachedDaily = localStorage.getItem(dailyCacheKey);
      if (cachedDaily) {
        return JSON.parse(cachedDaily);
      }

      // ب. البحث في كاش التقويم الشهري واستخراج مواقيت اليوم منه (يعمل أوفلاين لـ 30 يوماً)
      const cachedMonthly = localStorage.getItem(monthlyCacheKey);
      if (cachedMonthly) {
        const monthArray = JSON.parse(cachedMonthly);
        const todayEntry = monthArray.find(
          (item) => Number(item.date.gregorian.day) === currentDay
        );

        if (todayEntry && todayEntry.timings) {
          localStorage.setItem(dailyCacheKey, JSON.stringify(todayEntry.timings));
          return todayEntry.timings;
        }
      }

      // ج. إذا لم يتوفر أي كاش محلي، جلب الشهر كاملاً بطلب واحد وتخزينه لـ 30 يوماً
      const response = await axios.get(
        `https://api.aladhan.com/v1/calendarByCity/${currentYear}/${currentMonth}`,
        {
          params: {
            city: cityName,
            country: cityData.country || 'Saudi Arabia',
            method: 4,
          },
        }
      );

      const monthData = response.data.data;
      // حفظ جدول الشهر كاملاً في localStorage ليستفيد منه التقويم الشهري والأيام القادمة
      localStorage.setItem(monthlyCacheKey, JSON.stringify(monthData));

      const todayData = monthData.find(
        (item) => Number(item.date.gregorian.day) === currentDay
      );
      const timings = todayData ? todayData.timings : monthData[0].timings;

      localStorage.setItem(dailyCacheKey, JSON.stringify(timings));
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
      const latFixed = Number(latitude).toFixed(2);
      const lngFixed = Number(longitude).toFixed(2);
      const todayKey = new Date().toISOString().split('T')[0];
      const cacheKey = `prayer_gps_${latFixed}_${lngFixed}_${todayKey}`;

      // أ. التحقق من وجود البيانات المخزنة للإحداثيات
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
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
        cityName: 'دمشق (افتراضي)'
      });
    }
  }
);

// 3. إعداد الـ Slice
const prayerSlice = createSlice({
  name: 'prayer',
  initialState: {
    selectedCity: getSavedCity(), // القراءة من التخزين المحلي عند بدء التشغيل
    timings: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
      // حفظ المدينة المختارة (بما في ذلك خيار GPS) في localStorage فوراً
      try {
        localStorage.setItem('user_selected_city', JSON.stringify(action.payload));
      } catch (error) {
        console.error('تعذر حفظ المدينة في التخزين المحلي:', error);
      }
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