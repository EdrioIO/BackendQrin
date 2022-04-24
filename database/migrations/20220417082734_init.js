/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// changes yang mau dilakukan
exports.up = function(knex) {
    return knex.schema.createTable('ms_staff', table =>{
        table.increments(); // id field
        table.string('email').notNullable().unique
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.timestamp(true,true);
    })
    .createTable('messages', tbl =>{
      tbl.increments() // id field
      tbl.string('staff_email')
        .notNullable()
        .index()
      tbl.string('staff_first_name')
        .notNullable
      tbl.string('staff_last_name')
        .notNullable()
      tbl.timestamp(true,true)

      tbl.integer('staff_id')
        .unsigned()
        .notNullable
        .references('id')
        .inTable('ms_staff')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  
  //rollback
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('messages').dropMaterializedViewIfExists('ms_staff');
  };
  
  // npx knex migrate:latest --knexfile database/knexfile.js
  