// DONE: Configure routes for this app with page.js, by registering each URL your app can handle,
// linked to a a single controller function to handle it:
page('/', articlesController.index);
page('/about', aboutController.index);
page('/admin', adminController.index);

// DONE: Activate page.js!
page();
