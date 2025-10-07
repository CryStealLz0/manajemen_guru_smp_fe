import { useState, useEffect } from 'react';
import { useAuth } from '../../../app/auth/AuthProvider';
import { AdminApi } from '../../../services/apiClient';

export function useProfile() {
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Fetch profil lengkap
    async function fetchProfile() {
        if (!currentUser?.id) return;
        try {
            setLoading(true);
            const res = await AdminApi.getUserById(currentUser.id);
            // backend mengembalikan { ok, msg, user }
            setProfile(res.user || res.data || null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Update profil + refetch agar field lengkap tetap ada
    async function updateProfile(payload) {
        if (!currentUser?.id) return;
        try {
            setSaving(true);
            await AdminApi.updateUser(currentUser.id, payload);
            await fetchProfile(); // refetch agar role, nip, phone tetap konsisten
        } catch (err) {
            console.error(err);
            setError(err.message);
            throw err;
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, [currentUser?.id]);

    return { profile, loading, error, updateProfile, saving };
}
