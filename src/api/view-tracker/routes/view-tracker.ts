// src/api/view-tracker/routes/view-tracker.ts

// ไม่ต้อง import factories จาก @strapi/strapi ถ้ามีแค่ Custom Route
export default {
  routes: [
    {
      method: 'POST',
      path: '/views-tracker/track', 
      handler: 'view-tracker.trackView', 
      config: {
        auth: false,
        policies: [],
      }
    },
    // หากต้องการใช้ default routes ของ Content Type ให้สร้างไฟล์อื่น
  ],
};