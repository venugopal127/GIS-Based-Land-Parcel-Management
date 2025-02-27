const supabase = require("./models/db");  // Import the supabase client

(async () => {
  try {
    // First, select rows from the users table
    const { data: usersData, error: selectError } = await supabase
      .from('users')  // Replace with the actual table name
      .select('*');    // Select all rows, or you can specify columns like ['id', 'name', 'email']

    if (selectError) {
      throw selectError;  // If there's an error selecting data
    }

    console.log("Selected rows from users table:", usersData);

    // Sample data to insert (make sure this is valid for your table structure)
    const data = {
      id: 2,  // You might want to avoid inserting an id if it's auto-incremented
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '2jkb3jb2',
      role: 'user',
      created_at: '2025-01-26T10:54:35.854506',
      DID: 'some string',  // Replace with actual value
      privateshare: 'some string',  // Replace with actual value
    };

    // Insert data into the table
    const { data: insertedData, error: insertError } = await supabase
      .from('users')  // Replace with the actual table name
      .insert([data]);

    if (insertError) {
      throw insertError;  // If there's an error inserting data
    }

    console.log("Record inserted successfully:", insertedData);

  } catch (err) {
    console.error("Error during operation:", err);
  }
})();
