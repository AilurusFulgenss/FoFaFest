/**
 * view-tracker router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::view-tracker.view-tracker');

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/views-tracker/track',
      // ชี้ไปยัง Controller ที่ชื่อ 'view-tracker' และฟังก์ชัน 'trackView'
      handler: 'view-tracker.trackView', 
      config: {
        auth: false // ไม่ต้องการการยืนยันตัวตน
      }
    },
  ],
};