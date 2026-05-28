import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;
  readonly isConfigured: boolean;

  constructor() {
    this.isConfigured = !!(environment.supabaseUrl && environment.supabaseAnonKey);
    this.client = createClient(
      environment.supabaseUrl  || 'https://placeholder.supabase.co',
      environment.supabaseAnonKey || 'placeholder-key',
    );
  }
}
