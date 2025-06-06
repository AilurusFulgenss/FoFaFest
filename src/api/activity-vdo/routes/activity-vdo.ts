/**
 * activity-vdo router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::activity-vdo.activity-vdo',{
    config: {
        find: {
            middlewares: ["api::activity-vdo.activity-vdo-populate"]
        }
    }
});
