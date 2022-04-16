/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// changes yang mau dilakukan
exports.up = function(knex) {
  return knex.schema.createTable('ms_staff', table =>{
      table.increments('staff_id');
      table.string('email').notNullable().unique
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.timestamp(true,true);// auto update time
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//rollback
exports.down = function(knex) {
  return knex.schema.dropTable('ms_staff');
};
