import { Injectable, signal, computed } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { ToastService } from '../toast/toast.service';
import { UserProfile } from '../../data/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<UserProfile | null>(null);
  private readonly _tokens = signal(0);

  readonly user      = this._user.asReadonly();
  readonly tokens    = this._tokens.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isAdmin    = computed(() => this._user()?.isAdmin === true);

  constructor(private supabase: SupabaseService, private toast: ToastService) {
    if (this.supabase.isConfigured) {
      this.supabase.client.auth.getSession().then(({ data }) => {
        if (data.session?.user) this._loadProfile(data.session.user.id);
      });
      this.supabase.client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          this._loadProfile(session.user.id);
        } else {
          this._user.set(null);
          this._tokens.set(0);
        }
      });
    }
  }

  // ── Mock login (sin Supabase) ──────────────────────────────────
  mockLogin(email: string, nick: string, isNew: boolean) {
    const bonus = isNew ? 500 : 0;
    const profile: UserProfile = {
      nick, email,
      initials: nick.slice(0, 2).toUpperCase(),
      tokens: isNew ? bonus : 3250,
      bonus: isNew ? bonus : 0,
    };
    this._user.set(profile);
    this._tokens.set(profile.tokens);
    if (isNew && bonus > 0) {
      setTimeout(() => this.toast.push({ title: '¡Bienvenido!', body: `+${bonus} tokens de regalo`, tone: 'gold', duration: 5000 }), 800);
    }
  }

  // ── Supabase login / register ─────────────────────────────────
  async login(email: string, password: string) {
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async register(email: string, password: string, nick: string) {
    const { error } = await this.supabase.client.auth.signUp({
      email, password,
      options: { data: { nick } },
    });
    if (error) throw error;
  }

  async loginWithOAuth(provider: 'discord' | 'twitch'): Promise<void> {
    if (this.supabase.isConfigured) {
      const { error } = await this.supabase.client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin + '/' },
      });
      if (error) throw error;
      // Browser redirects away — no further action needed
    } else {
      const nick = provider === 'discord' ? 'discord_player' : 'twitch_streamer';
      this.mockLogin(`${nick}@${provider}.mock`, nick, false);
    }
  }

  async logout() {
    if (this.supabase.isConfigured) {
      await this.supabase.client.auth.signOut();
    }
    this._user.set(null);
    this._tokens.set(0);
  }

  spendTokens(amount: number) {
    this._tokens.update(t => Math.max(0, t - amount));
    const user = this._user();
    if (user) this._user.set({ ...user, tokens: this._tokens() });
  }

  addTokens(amount: number) {
    this._tokens.update(t => t + amount);
    const user = this._user();
    if (user) this._user.set({ ...user, tokens: this._tokens() });
  }

  private async _loadProfile(userId: string) {
    const { data } = await this.supabase.client
      .from('profiles').select('*').eq('id', userId).single();

    if (data) {
      this._user.set({
        id: userId,
        nick: data['nick'],
        email: '',
        initials: (data['nick'] as string).slice(0, 2).toUpperCase(),
        tokens: data['tokens'],
        isAdmin: data['is_admin'] === true,
      });
      this._tokens.set(data['tokens']);
    } else {
      // OAuth user without a profiles row — derive identity from provider metadata
      const { data: { user } } = await this.supabase.client.auth.getUser();
      if (!user) return;
      const meta = user.user_metadata ?? {};
      const nick: string =
        meta['full_name'] ||
        meta['name'] ||
        meta['preferred_username'] ||
        meta['user_name'] ||
        user.email?.split('@')[0] ||
        'player';
      this._user.set({
        id: userId,
        nick,
        email: user.email ?? '',
        initials: nick.slice(0, 2).toUpperCase(),
        tokens: 500,
      });
      this._tokens.set(500);
      setTimeout(() =>
        this.toast.push({ title: '¡Bienvenido!', body: '+500 tokens de regalo', tone: 'gold', duration: 5000 }), 800
      );
    }
  }
}
