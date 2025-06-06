/**
 * project-and-activitie router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::project-and-activitie.project-and-activitie',{
    config: {
        find: {
            middlewares: ["api::project-and-activitie.project-and-activitie-populate"]
        }
    }
});
    
