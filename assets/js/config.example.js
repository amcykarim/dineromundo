// Copy only these browser-safe public settings to config.js.
// Never add a service_role/secret key, database password, JWT secret or SMTP credential.
window.DINEROMUNDO_CONFIG={
  environment:'production',
  productionOrigin:'https://dineromundo.com/',
  supabaseUrl:'https://YOUR_PROJECT_REF.supabase.co',
  supabaseAnonKey:'YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY',
  enablePlanTesting:false
};
