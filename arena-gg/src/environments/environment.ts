// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

declare global {
  var NG_APP_SUPABASE_URL: string | undefined;
  var NG_APP_SUPABASE_ANON_KEY: string | undefined;
}

export const environment = {
  production: false,
  supabaseUrl: (typeof globalThis !== 'undefined' && (globalThis as any).NG_APP_SUPABASE_URL) ||
               (typeof window !== 'undefined' && (window as any).NG_APP_SUPABASE_URL) ||
               'https://upmsdwyqjmnmdeqiomsh.supabase.co',
  supabaseAnonKey: (typeof globalThis !== 'undefined' && (globalThis as any).NG_APP_SUPABASE_ANON_KEY) ||
                   (typeof window !== 'undefined' && (window as any).NG_APP_SUPABASE_ANON_KEY) ||
                   'sb_publishable_ztWU2BmcL6BlJlQZsu5lEQ_vVyoVrF_',
};
