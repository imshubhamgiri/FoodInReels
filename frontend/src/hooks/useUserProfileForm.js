import { useCallback, useEffect, useMemo, useState } from 'react';
import { profileAPI } from '../services/api';
import { useAppContext } from '../context/AppContext';

const mapProfile = (profile = {}) => ({
  name: profile?.name || '',
  email: profile?.email || '',
  phone: profile?.phone || '',
  gender: profile?.gender || '',
});

export default function useUserProfileForm(seedUser) {
  const { user, setUser, userProfile, setUserProfile, isProfileLoaded, fetchUserProfile } = useAppContext();
  const [formData, setFormData] = useState(mapProfile(userProfile || seedUser));
  const [initialData, setInitialData] = useState(mapProfile(userProfile || seedUser));
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const synced = mapProfile(userProfile || seedUser);
    setFormData(synced);
    setInitialData(synced);
  }, [seedUser, userProfile]);

  const setField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const buildChangedPayload = useCallback((fields = null) => {
    const keys = fields || Object.keys(formData);
    return keys.reduce((acc, key) => {
      if (formData[key] !== initialData[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});
  }, [formData, initialData]);

  const resetFields = useCallback((fields) => {
    setFormData((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        next[field] = initialData[field];
      });
      return next;
    });
  }, [initialData]);

  const fetchProfile = useCallback(async (force = false) => {
    if (!force && isProfileLoaded && userProfile) {
      const mapped = mapProfile(userProfile);
      setFormData(mapped);
      setInitialData(mapped);
      return mapped;
    }

    setIsLoadingProfile(true);
    setErrorMessage('');

    try {
      const data = await fetchUserProfile(force);
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid profile response');
      }

      const mapped = mapProfile(data);
      setFormData(mapped);
      setInitialData(mapped);
      return mapped;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to fetch profile';
      setErrorMessage(message);
      console.log('Error fetching profile:', error);
      return null;
    } finally {
      setIsLoadingProfile(false);
    }
  }, [fetchUserProfile, isProfileLoaded, userProfile]);

  const saveProfile = useCallback(async (fields = null) => {
    const payload = buildChangedPayload(fields);
    if (Object.keys(payload).length === 0) {
      return { ok: true, skipped: true, payload };
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      await profileAPI.updateMe(payload);
      setInitialData((prev) => ({ ...prev, ...payload }));
      if (setUserProfile) {
        setUserProfile((prev) => ({ ...prev, ...payload }));
      }
      if (setUser) {
        setUser((prev) => ({ ...prev, ...payload }));
      }
      return { ok: true, skipped: false, payload };
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to update profile';
      setErrorMessage(message);
      return { ok: false, skipped: false, payload, message };
    } finally {
      setIsSaving(false);
    }
  }, [buildChangedPayload, setUser, setUserProfile]);

  const hasUnsavedChanges = useMemo(() => {
    return Object.keys(formData).some((key) => formData[key] !== initialData[key]);
  }, [formData, initialData]);

  return {
    formData,
    initialData,
    isLoadingProfile,
    isSaving,
    errorMessage,
    hasUnsavedChanges,
    setField,
    resetFields,
    fetchProfile,
    saveProfile,
    buildChangedPayload,
  };
}
