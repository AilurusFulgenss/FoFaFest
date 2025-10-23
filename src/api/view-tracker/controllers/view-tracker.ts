/**
 * view-tracker controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::view-tracker.view-tracker');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::view-tracker.view-tracker', ({ strapi }) => ({
  async trackView(ctx) {
    const ipAddress = ctx.request.ip; 
    const today = new Date().toISOString().split('T')[0]; 

    if (!ipAddress) {
        return ctx.badRequest('Unable to resolve IP address.');
    }

    try {
      // 1. ค้นหา IP
      let tracker = await strapi.db.query('api::view-tracker.view-tracker').findOne({ 
        where: { ipAddress: ipAddress } 
      });

      let shouldCount = false;
      let globalView = await strapi.db.query('api::global-view.global-view').findOne({});
      const globalViewId = globalView?.id;

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
      }

      if (shouldCount && globalViewId) {
        // 4. เพิ่มยอดรวม GlobalView
        const newViews = (globalView.totalViews || 0) + 1;
        await strapi.db.query('api::global-view.global-view').update({
          where: { id: globalViewId },
          data: { totalViews: newViews }
        });
        globalView.totalViews = newViews; 
      }
      
      // 5. ส่งผลลัพธ์กลับไป 
      return { data: { totalViews: globalView.totalViews, counted: shouldCount } };

    } catch (error) {
      console.error("Error in trackView:", error);
      return ctx.internalServerError('Tracking failed due to server error.');
    }
  }
}));