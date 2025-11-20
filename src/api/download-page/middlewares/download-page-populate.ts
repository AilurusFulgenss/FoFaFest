/**
 * `download-page-populate` middleware
 */

import type { Core } from '@strapi/strapi';
import { createDecipheriv } from 'crypto';

const populate = {
  LoadBlocks: {
    on: {
      "blocks.activity-card": {
        populate: {
          // 1. ส่วน Title (ถูกต้องแล้ว)
          Title: {
            populate: "*"
          },
          // 2. ส่วน Card (ลบ title: true ออก)
          Card: {
            populate: {
              cardImage: {
                fields: ["alternativeText", "url"]
              }
            }
          }
        }
      }
    }
  }
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In download-page-populate middleware.');
    ctx.query.populate = populate;
    await next();
  };
};
