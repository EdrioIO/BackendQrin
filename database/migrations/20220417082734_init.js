/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// changes yang mau dilakukan
exports.up = function(knex) {
    return knex.schema.createTable('ms_student', table =>{
        table.increments('student_id'); // id field
        table.string('student_nim').notNullable().unique();
        table.string('student_name').notNullable();
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
  