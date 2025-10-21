// src/api/quarter/middlewares/quarter-populate.js

module.exports = (config, { strapi }) => {
  const populate = {
    // Populate projects (ความสัมพันธ์ Quarter has many Projects)
    projects: {
        populate: {
            // Populate cardImage ภายใน Projects
            cardImage: {
                populate: true, // ดึงข้อมูล Image ทั้งหมด (url, formats, attributes)
            },
        },
    },
  };

  return async (ctx, next) => {
    // กำหนด populate logic ให้กับ Context Query ก่อนดำเนินการ
    ctx.query.populate = populate;
    await next();
  };
};