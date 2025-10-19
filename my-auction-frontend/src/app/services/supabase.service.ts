import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const supabaseClient: SupabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey
); 

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase = supabaseClient;

  constructor() {
    //this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async uploadFile(file: File): Promise<string | null> {
    const path = `auctions/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await this.supabase.storage
      .from('my-auction-storage')
      .upload(path, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = this.supabase.storage.from('my-auction-storage').getPublicUrl(path);

  return data.publicUrl || null;
  }
}
