// Initialize Supabase client for the browser
// Requires that window.SUPABASE_URL and window.SUPABASE_ANON_KEY are set (see README / .env.example)
(function(global){
  if (typeof supabase === 'undefined') {
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      console.warn('SUPABASE_URL and SUPABASE_ANON_KEY not found on window — supabase client will not be initialized');
      global.supabaseClient = null;
      return;
    }
    global.supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }
})(window);
