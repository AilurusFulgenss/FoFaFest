/**
 * `activity-vdo-populate` middleware
 */

import type { Core } from '@strapi/strapi';

const populate = {
    YoutubeBlocks:{
      on:{
        "blocks.section-youtube":{
          populate:{
            Clip: true,
        }
      }
    }
  }
}


export default (_config, { strapi }: { strapi: Core.Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In activity-vdo-populate middleware.');
    ctx.query.populate = populate;
    await next();
  };
};

