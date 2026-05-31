import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CustomerGroupRepository } from '../lib/repositories/customerGroupRepository';

// Hot-reload / re-mount sırasında listener leak'i önlemek için referansı dışarıda tut.
let _authSubscription = null;

// Profili çekerken hangi tabloya bakacağımızı belirler.
// surgeon_profiles varsa kullanıcı cerrahtır; yoksa regular profiles'a düşer.
async function fetchProfile(userId) {
  // 1) Önce surgeon_profiles'a bak
  const { data: surgeon, error: surgeonErr } = await supabase
    .from('surgeon_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (!surgeonErr && surgeon) {
    return { profile: surgeon, role: 'surgeon' };
  }

  // 2) Yoksa genel profiles tablosuna düş
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (!profileErr && profile) {
    return { profile, role: 'customer' };
  }

  return { profile: null, role: 'customer' };
}

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  role: null,         // 'admin' | 'surgeon' | 'customer' | null
  customerGroup: null,
  loading: true,

  getCustomerGroupId: () => get().customerGroup?.groupId || null,

  initialize: async () => {
    if (_authSubscription) {
      _authSubscription.unsubscribe();
      _authSubscription = null;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      const user = session?.user || null;
      set({ user, loading: false });

      if (user) {
        const isAdmin = user.app_metadata?.role === 'admin';
        const { profile, role } = await fetchProfile(user.id);
        const customerGroup = await CustomerGroupRepository.getUserGroup(user.id);
        set({ profile, role: isAdmin ? 'admin' : role, customerGroup });
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        const newUser = newSession?.user || null;
        set({ user: newUser, loading: false });

        if (newUser) {
          const isAdmin = newUser.app_metadata?.role === 'admin';
          const { profile, role } = await fetchProfile(newUser.id);
          const customerGroup = await CustomerGroupRepository.getUserGroup(newUser.id);
          set({ profile, role: isAdmin ? 'admin' : role, customerGroup });
        } else {
          set({ profile: null, role: null, customerGroup: null });
        }
      });

      _authSubscription = subscription;
    } catch (error) {
      console.error('Error initializing auth:', error.message);
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  // Regular customer signup: yalnızca auth.users + handle_new_user trigger profiles satırı oluşturur.
  signUp: async (email, password, profileData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: profileData.fullName },
      },
    });
    if (error) throw error;

    // Cerrah başvurusu mu? (hospitalName / specialty geliyorsa)
    if (data?.user && (profileData.hospitalName || profileData.specialty)) {
      const { error: surgeonErr } = await supabase
        .from('surgeon_profiles')
        .insert([{
          id: data.user.id,
          full_name: profileData.fullName,
          hospital_name: profileData.hospitalName,
          specialty: profileData.specialty,
          phone: profileData.phone,
          status: 'pending',
        }]);
      if (surgeonErr) throw surgeonErr;
    }

    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null, role: null, customerGroup: null });
  },
}));

export default useAuthStore;
