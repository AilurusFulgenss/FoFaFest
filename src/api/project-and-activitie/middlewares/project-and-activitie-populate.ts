/**
 * `project-and-activitie-populate` middleware
 */

import type { Core } from '@strapi/strapi';

const populate = {
  Card: {
    on: {
      "blocks.activity-card": {
        populate: {
          Title: true,
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




export default (_config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In project-and-activitie-populate middleware.');
    ctx.query.populate = populate;
    await next();
  };
};
