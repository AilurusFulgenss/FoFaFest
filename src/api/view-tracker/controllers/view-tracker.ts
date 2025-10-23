// src/api/view-tracker/controllers/view-tracker.ts

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::view-tracker.view-tracker', ({ strapi }) => ({
  // ฟังก์ชัน Custom Logic ต้องถูกวางไว้ใน Object ที่ return
  async trackView(ctx) {
    const ipAddress = ctx.request.ip; 
    const today = new Date().toISOString().split('T')[0]; 

    if (!ipAddress) {
        return ctx.badRequest('Unable to resolve IP address.');
    }
    
    try {
        let tracker = await strapi.db.query('api::view-tracker.view-tracker').findOne({ 
            where: { ipAddress: ipAddress } 
        });

        let shouldCount = false;
        // ใช้ findOne() โดยไม่มี where เพื่อดึง Single Type
        let globalView = await strapi.db.query('api::global-view.global-view').findOne({});
        const globalViewId = globalView?.id;

        if (!tracker) {
            await strapi.db.query('api::view-tracker.view-tracker').create({
                data: { ipAddress: ipAddress, lastVisitDate: today }
            });
            shouldCount = true;
        } else {
            const lastVisit = new Date(tracker.lastVisitDate).toISOString().split('T')[0];
            
            if (lastVisit !== today) {
                await strapi.db.query('api::view-tracker.view-tracker').update({
                    where: { id: tracker.id },
                    data: { lastVisitDate: today }
                });
                shouldCount = true;
            }
        }

        if (shouldCount && globalViewId) {
            const newViews = (globalView.totalViews || 0) + 1;
            await strapi.db.query('api::global-view.global-view').update({
                where: { id: globalViewId },
                data: { totalViews: newViews }
            });
            globalView.totalViews = newViews; 
        }
        
        // Strapi V5 Controller ควร return Object ที่มี key เป็น 'data' 
        return { data: { totalViews: globalView.totalViews, counted: shouldCount } };

    } catch (error) {
      console.error("Error in trackView:", error);
      return ctx.internalServerError('Tracking failed due to server error. Check database connections and permissions.');
    }
  }
}));