/**
 * view-tracker service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::view-tracker.view-tracker');

// ตัวอย่างโค้ดใน Strapi Service (service/api/views-tracker/track)

module.exports = {
  async trackView(ctx) {
    const ipAddress = ctx.request.ip; // Strapi มักจะดึง IP มาให้
    const today = new Date().toISOString().split('T')[0]; // เช่น "2025-10-23"

    try {
      // 1. ค้นหา IP ใน ViewTracker
      let tracker = await strapi.db.query('api::view-tracker.view-tracker').findOne({ 
        where: { ipAddress: ipAddress } 
      });

      let shouldCount = false;
      let globalView = await strapi.db.query('api::global-view.global-view').findOne({});

      if (!tracker) {
        // 2a. IP ใหม่: สร้าง Record และนับ
        await strapi.db.query('api::view-tracker.view-tracker').create({
          data: { ipAddress: ipAddress, lastVisitDate: today }
        });
        shouldCount = true;
      } else {
        // 2b. IP เดิม: ตรวจสอบวันที่
        const lastVisit = new Date(tracker.lastVisitDate).toISOString().split('T')[0];
        
        if (lastVisit !== today) {
          // 3. เข้าชมวันใหม่: อัปเดตวันที่และนับ
          await strapi.db.query('api::view-tracker.view-tracker').update({
            where: { id: tracker.id },
            data: { lastVisitDate: today }
          });
          shouldCount = true;
        }
        // else: เข้าชมวันเดิม ไม่ต้องนับ
      }

      if (shouldCount) {
        // 4. เพิ่มยอดรวม GlobalView
        const newViews = (globalView.totalViews || 0) + 1;
        await strapi.db.query('api::global-view.global-view').update({
          where: { id: globalView.id },
          data: { totalViews: newViews }
        });
        globalView.totalViews = newViews; // อัปเดตค่าส่งคืน
      }

      return { totalViews: globalView.totalViews, counted: shouldCount };

    } catch (error) {
      // จัดการข้อผิดพลาด, อาจจะคืนค่า 500
      ctx.body = { error: 'Tracking failed' };
      ctx.response.status = 500;
    }
  }
};