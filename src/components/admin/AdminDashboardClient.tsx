'use client';

import React, { useState } from 'react';
import {
  updateAppSettingAction,
  toggleUserSuspensionAction,
  updateReportStatusAction,
  deleteSpamMessageAction,
  deleteUserAccountAction,
  updateAdminPasswordAction,
  updateUserTreeSignatureAction,
} from '@/app/actions/admin';
import {
  Users,
  TreePine,
  Mail,
  Eye,
  Shield,
  Search,
  Lock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  BadgeCheck,
  Activity,
  Sliders,
} from 'lucide-react';

interface AdminDashboardClientProps {
  stats: {
    totalUsers: number;
    totalTrees: number;
    totalMessages: number;
    dailyVisits: number;
  };
  users: Array<{
    id: string;
    username: string;
    display_name: string;
    is_admin: boolean;
    is_suspended: boolean;
    created_at: string;
    admin_signature: { note: string; signed_at: string } | null;
  }>;
  settings: Record<string, string>;
  reports: Array<{
    id: string;
    tree_id: string;
    message_id: string;
    reason: string;
    status: string;
    created_at: string;
  }>;
  logs: Array<{
    id: string;
    action: string;
    details: any;
    created_at: string;
  }>;
}

export function AdminDashboardClient({
  stats,
  users: initialUsers,
  settings: initialSettings,
  reports: initialReports,
  logs,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings' | 'reports' | 'logs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(initialUsers);
  const [settings, setSettings] = useState(initialSettings);
  const [reports, setReports] = useState(initialReports);
  const [unlockDateInput, setUnlockDateInput] = useState(
    initialSettings['message_unlock_date']?.substring(0, 10) || '2026-12-25'
  );
  const [msg, setMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');
  const [adminPasswordLoading, setAdminPasswordLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [signatureTarget, setSignatureTarget] = useState<AdminDashboardClientProps['users'][number] | null>(null);
  const [signatureNote, setSignatureNote] = useState('');
  const [savingSignature, setSavingSignature] = useState(false);

  const showNotification = (text: string, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleAdminPasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (adminPassword.length < 8) {
      showNotification('Yeni şifre en az 8 karakter olmalıdır.', true);
      return;
    }
    if (adminPassword !== adminPasswordConfirm) {
      showNotification('Şifreler eşleşmiyor.', true);
      return;
    }

    setAdminPasswordLoading(true);
    const res = await updateAdminPasswordAction(adminPassword);
    setAdminPasswordLoading(false);
    if (res.success) {
      setAdminPassword('');
      setAdminPasswordConfirm('');
      showNotification('Yönetici şifresi güncellendi.');
    } else {
      showNotification(res.error || 'Şifre değiştirilemedi.', true);
    }
  };

  const handleToggleSuspension = async (userId: string, currentStatus: boolean) => {
    const res = await toggleUserSuspensionAction(userId, !currentStatus);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_suspended: !currentStatus } : u))
      );
      showNotification(
        !currentStatus ? 'Kullanıcı askıya alındı.' : 'Kullanıcı askıdan çıkarıldı.'
      );
    } else {
      showNotification(res.error || 'İşlem başarısız.', true);
    }
  };

  const handleDeleteUser = async (
    userId: string,
    username: string,
    displayName: string
  ) => {
    const confirmed = window.confirm(
      `@${username} (${displayName}) hesabını kalıcı olarak silmek istiyor musunuz? Bu kullanıcının hesabı, ağacı, süsleri ve mesajları silinir. Bu işlem geri alınamaz.`
    );
    if (!confirmed) return;

    setDeletingUserId(userId);
    try {
      const res = await deleteUserAccountAction(userId);
      if (res.success) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        showNotification(`@${username} ve ilişkili verileri silindi.`);
      } else {
        showNotification(res.error || 'Kullanıcı silinemedi.', true);
      }
    } catch {
      showNotification('Kullanıcı silinemedi. Lütfen tekrar deneyin.', true);
    } finally {
      setDeletingUserId(null);
    }
  };

  const openTreeSignature = (user: AdminDashboardClientProps['users'][number]) => {
    setSignatureTarget(user);
    setSignatureNote(user.admin_signature?.note || '');
  };

  const handleSaveTreeSignature = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signatureTarget) return;

    const note = signatureNote.trim();
    if (note.length < 3 || note.length > 200) {
      showNotification('İmza notu 3 ile 200 karakter arasında olmalıdır.', true);
      return;
    }

    setSavingSignature(true);
    try {
      const result = await updateUserTreeSignatureAction(signatureTarget.id, note);
      if (!result.success) {
        showNotification(result.error || 'Ağaç imzalanamadı.', true);
        return;
      }

      const signedAt = result.signedAt || new Date().toISOString();
      setUsers((prev) =>
        prev.map((user) =>
          user.id === signatureTarget.id
            ? { ...user, admin_signature: { note, signed_at: signedAt } }
            : user
        )
      );
      setSignatureTarget(null);
      setSignatureNote('');
      showNotification(`@${signatureTarget.username} ağacına Eternal imzası eklendi.`);
    } catch {
      showNotification('İmza kaydedilemedi. Lütfen tekrar deneyin.', true);
    } finally {
      setSavingSignature(false);
    }
  };

  const handleRemoveTreeSignature = async () => {
    if (!signatureTarget) return;
    setSavingSignature(true);
    try {
      const result = await updateUserTreeSignatureAction(signatureTarget.id, null);
      if (!result.success) {
        showNotification(result.error || 'Ağaç imzası kaldırılamadı.', true);
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === signatureTarget.id ? { ...user, admin_signature: null } : user
        )
      );
      setSignatureTarget(null);
      setSignatureNote('');
      showNotification(`@${signatureTarget.username} ağacının imzası kaldırıldı.`);
    } catch {
      showNotification('İmza kaldırılamadı. Lütfen tekrar deneyin.', true);
    } finally {
      setSavingSignature(false);
    }
  };

  const handleSaveUnlockDate = async () => {
    const isoString = new Date(`${unlockDateInput}T00:00:00.000Z`).toISOString();
    const res = await updateAppSettingAction('message_unlock_date', isoString);
    if (res.success) {
      setSettings((prev) => ({ ...prev, message_unlock_date: isoString }));
      showNotification('Mesaj açılış tarihi güncellendi.');
    } else {
      showNotification(res.error || 'Güncelleme hatası.', true);
    }
  };

  const handleToggleSetting = async (key: string, current: string) => {
    const nextVal = current === 'true' ? 'false' : 'true';
    const res = await updateAppSettingAction(key, nextVal);
    if (res.success) {
      setSettings((prev) => ({ ...prev, [key]: nextVal }));
      showNotification(`Ayar güncellendi: ${key} = ${nextVal}`);
    } else {
      showNotification(res.error || 'Güncelleme hatası.', true);
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    const res = await updateReportStatusAction(reportId, status);
    if (res.success) {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
      showNotification(`Şikâyet durumu: ${status}`);
    } else {
      showNotification(res.error || 'İşlem hatası.', true);
    }
  };

  const handleDeleteSpam = async (messageId: string, reportId?: string) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    const res = await deleteSpamMessageAction(messageId);
    if (res.success) {
      if (reportId) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
        );
      }
      showNotification('Spam mesaj ve süsü silindi.');
    } else {
      showNotification(res.error || 'Silinemedi.', true);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-forest/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-snow flex items-center gap-2">
            <Shield className="h-6 w-6 text-gold" />
            Yönetici Kontrol Paneli
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Platform istatistiklerini izleyin, kullanıcıları ve güvenlik ayarlarını denetleyin.
          </p>
        </div>

        {msg && (
          <div
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg ${
              msg.isError
                ? 'bg-red-950/80 border border-red-500 text-red-200'
                : 'bg-forest border border-gold/40 text-gold-light'
            }`}
          >
            {msg.isError ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <span>{msg.text}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Genel Bakış', icon: Activity },
          { id: 'users', label: 'Kullanıcılar', icon: Users },
          { id: 'settings', label: 'Platform Ayarları', icon: Sliders },
          { id: 'reports', label: 'Şikâyetler', icon: AlertTriangle },
          { id: 'logs', label: 'İşlem Kayıtları', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gold text-background shadow-md'
                  : 'bg-surface hover:bg-forest/50 text-snow border border-forest/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-forest border border-gold/30 flex items-center justify-center text-gold">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-muted block">Toplam Kullanıcı</span>
                <span className="text-2xl font-serif font-bold text-snow">{stats.totalUsers}</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-forest border border-gold/30 flex items-center justify-center text-gold">
                <TreePine className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-muted block">Toplam Ağaç</span>
                <span className="text-2xl font-serif font-bold text-snow">{stats.totalTrees}</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-forest border border-gold/30 flex items-center justify-center text-gold">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-muted block">Toplam Mesaj</span>
                <span className="text-2xl font-serif font-bold text-snow">{stats.totalMessages}</span>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-forest border border-gold/30 flex items-center justify-center text-gold">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-muted block">Bugünkü Ziyaret</span>
                <span className="text-2xl font-serif font-bold text-snow">{stats.dailyVisits}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-serif font-bold text-snow flex items-center gap-2">
                <Lock className="h-4 w-4 text-gold" />
                Mesaj Açılış Tarihi Durumu
              </h3>
              <p className="text-xs text-muted">
                Kullanıcıların mesaj içeriklerini okuyabileceği tarih:
              </p>
              <div className="text-lg font-serif font-bold text-gold">
                {new Date(settings['message_unlock_date'] || '2026-12-25').toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-serif font-bold text-snow flex items-center gap-2">
                <Sliders className="h-4 w-4 text-gold" />
                Sistem Durumu
              </h3>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-forest/40">
                  <span className="text-muted">Kayıt Sistemi:</span>
                  <span className={settings['allow_registration'] !== 'false' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                    {settings['allow_registration'] !== 'false' ? 'Açık' : 'Kapalı'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted">Bakım Modu:</span>
                  <span className={settings['maintenance_mode'] === 'true' ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                    {settings['maintenance_mode'] === 'true' ? 'Aktif' : 'Devre Dışı'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 glass-panel p-3 rounded-2xl">
            <Search className="h-4 w-4 text-muted shrink-0 ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kullanıcı adı veya isim ile ara..."
              className="w-full bg-transparent text-xs sm:text-sm text-snow focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-forest/60">
            <table className="w-full text-left text-xs text-snow">
              <thead className="bg-surface text-muted uppercase text-[10px] tracking-wider border-b border-forest/60">
                <tr>
                  <th className="px-4 py-3">Kullanıcı</th>
                  <th className="px-4 py-3">Görünen İsim</th>
                  <th className="px-4 py-3">Yetki</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3">Ağaç İmzası</th>
                  <th className="px-4 py-3">Kayıt Tarihi</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/40 bg-surface/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-forest/20">
                    <td className="px-4 py-3 font-mono font-medium text-gold">@{user.username}</td>
                    <td className="px-4 py-3">{user.display_name}</td>
                    <td className="px-4 py-3">
                      {user.is_admin ? (
                        <span className="px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/40 text-[10px] font-bold">
                          Admin
                        </span>
                      ) : (
                        <span className="text-muted text-[10px]">Üye</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_suspended ? (
                        <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/40 text-[10px]">
                          Askıda
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-green-950/60 text-green-400 border border-green-500/40 text-[10px]">
                          Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.admin_signature ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-1 text-[10px] font-semibold text-gold-light">
                          <BadgeCheck className="h-3 w-3" />
                          İmzalı
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted">İmza yok</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(user.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openTreeSignature(user)}
                          className="px-3 py-1 rounded-lg text-[11px] font-semibold text-gold-light bg-gold/10 border border-gold/30 hover:bg-gold/20"
                        >
                          {user.admin_signature ? 'Notu Düzenle' : 'İmzala'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSuspension(user.id, user.is_suspended)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                            user.is_suspended
                              ? 'bg-green-900/60 text-green-300 hover:bg-green-800'
                              : 'bg-red-950/60 text-red-300 hover:bg-red-900'
                          }`}
                        >
                          {user.is_suspended ? 'Aktifleştir' : 'Askıya Al'}
                        </button>
                        {user.is_admin ? (
                          <span className="px-2 py-1 text-[10px] text-muted">Yönetici korunuyor</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id, user.username, user.display_name)}
                            disabled={deletingUserId === user.id}
                            className="px-3 py-1 rounded-lg text-[11px] font-semibold text-red-200 bg-red-950/60 hover:bg-red-900 disabled:opacity-50"
                          >
                            {deletingUserId === user.id ? 'Siliniyor…' : 'Sil'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel-gold rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-snow flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" />
              Mesaj Açılış Tarihini Belirle
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Bu tarihten önce hiçbir kullanıcı sunucu üzerinden mesaj içeriğini görüntüleyemez.
            </p>

            <div className="space-y-2">
              <input
                type="date"
                value={unlockDateInput}
                onChange={(e) => setUnlockDateInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-forest-dark border border-forest focus:border-gold text-snow text-xs sm:text-sm"
              />
              <button
                onClick={handleSaveUnlockDate}
                className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs transition-colors"
              >
                Tarihi Güncelle & Uygula
              </button>
            </div>
          </div>

          <div className="glass-panel-gold rounded-2xl p-6 space-y-5">
            <h3 className="font-serif font-bold text-snow flex items-center gap-2">
              <Sliders className="h-5 w-5 text-gold" />
              Sistem Anahtarları
            </h3>

            <div className="p-4 rounded-xl bg-surface border border-forest flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-snow block">Kayıt Sistemi</span>
                <span className="text-[11px] text-muted block">Yeni kullanıcı kayıtlarına izin ver</span>
              </div>
              <button
                onClick={() => handleToggleSetting('allow_registration', settings['allow_registration'] || 'true')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  settings['allow_registration'] !== 'false'
                    ? 'bg-green-900/60 text-green-300 border border-green-500/40'
                    : 'bg-red-950/60 text-red-300 border border-red-500/40'
                }`}
              >
                {settings['allow_registration'] !== 'false' ? 'Açık' : 'Kapalı'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-forest flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-snow block">Bakım Modu</span>
                <span className="text-[11px] text-muted block">Platformu genel erişime kapat</span>
              </div>
              <button
                onClick={() => handleToggleSetting('maintenance_mode', settings['maintenance_mode'] || 'false')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  settings['maintenance_mode'] === 'true'
                    ? 'bg-red-950/60 text-red-300 border border-red-500/40'
                    : 'bg-forest text-snow border border-forest-light'
                }`}
              >
                {settings['maintenance_mode'] === 'true' ? 'Aktif' : 'Pasif'}
              </button>
            </div>
          </div>

          <div className="glass-panel-gold rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-snow flex items-center gap-2">
              <Lock className="h-5 w-5 text-gold" />
              Yönetici Giriş Bilgileri
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Giriş adı sabittir: <strong className="text-snow">destek@eternalproduction.net</strong>.
              Buradan yönetici şifreni değiştirebilirsin.
            </p>
            <form onSubmit={handleAdminPasswordChange} className="space-y-3">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                required
                placeholder="Yeni şifre (en az 8 karakter)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-forest-dark border border-forest focus:border-gold text-snow text-sm"
              />
              <input
                type="password"
                value={adminPasswordConfirm}
                onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                required
                placeholder="Yeni şifreyi tekrar yaz"
                className="w-full px-3.5 py-2.5 rounded-xl bg-forest-dark border border-forest focus:border-gold text-snow text-sm"
              />
              <button
                type="submit"
                disabled={adminPasswordLoading}
                className="w-full py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs disabled:opacity-50"
              >
                {adminPasswordLoading ? 'Güncelleniyor...' : 'Yönetici Şifresini Değiştir'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-forest/60">
            <table className="w-full text-left text-xs text-snow">
              <thead className="bg-surface text-muted uppercase text-[10px] tracking-wider border-b border-forest/60">
                <tr>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">Gerekçe</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/40 bg-surface/50">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted">
                      Henüz herhangi bir şikâyet kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-forest/20">
                      <td className="px-4 py-3 text-muted">
                        {new Date(rep.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 max-w-xs break-words">{rep.reason}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rep.status === 'resolved'
                              ? 'bg-green-950/60 text-green-400'
                              : rep.status === 'dismissed'
                              ? 'bg-gray-800 text-gray-400'
                              : 'bg-yellow-950/60 text-yellow-400'
                          }`}
                        >
                          {rep.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {rep.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleDeleteSpam(rep.message_id, rep.id)}
                              className="px-2.5 py-1 rounded bg-red-950/60 text-red-300 hover:bg-red-900 text-[11px]"
                              title="Mesajı Sil"
                            >
                              <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                              Sil
                            </button>
                            <button
                              onClick={() => handleResolveReport(rep.id, 'dismissed')}
                              className="px-2.5 py-1 rounded bg-surface hover:bg-forest text-muted text-[11px]"
                            >
                              Reddet
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {signatureTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tree-signature-title"
        >
          <div className="w-full max-w-lg space-y-5 rounded-3xl border border-gold/40 bg-surface p-6 shadow-2xl shadow-gold/10">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 id="tree-signature-title" className="font-serif text-lg font-bold text-snow">
                  Eternal ekip imzası
                </h2>
                <p className="mt-1 text-xs text-muted">
                  @{signatureTarget.username} ağacında herkese görünecek kısa bir not yazın.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveTreeSignature} className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label htmlFor="tree-signature-note" className="text-xs font-semibold text-snow/90">
                    İmza notu
                  </label>
                  <span className="text-[10px] text-muted">{signatureNote.length} / 200</span>
                </div>
                <textarea
                  id="tree-signature-note"
                  required
                  minLength={3}
                  maxLength={200}
                  rows={4}
                  autoFocus
                  value={signatureNote}
                  onChange={(e) => setSignatureNote(e.target.value)}
                  placeholder="Bu ağacın yılbaşı ruhu Eternal ekibi tarafından onaylandı..."
                  className="w-full resize-none rounded-xl border border-forest/80 bg-forest-dark px-3.5 py-3 text-sm text-snow outline-none transition-colors focus:border-gold"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <div className="flex gap-2">
                  {signatureTarget.admin_signature && (
                    <button
                      type="button"
                      onClick={handleRemoveTreeSignature}
                      disabled={savingSignature}
                      className="rounded-xl border border-red-500/30 px-4 py-2.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-950/50 disabled:opacity-50"
                    >
                      İmzayı Kaldır
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSignatureTarget(null);
                      setSignatureNote('');
                    }}
                    disabled={savingSignature}
                    className="rounded-xl border border-forest px-4 py-2.5 text-xs font-semibold text-snow/80 transition-colors hover:bg-forest/50 disabled:opacity-50"
                  >
                    İptal
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={savingSignature || signatureNote.trim().length < 3}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold text-background transition-colors hover:bg-gold-light disabled:opacity-50"
                >
                  {savingSignature ? 'Kaydediliyor…' : 'İmzayı Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="overflow-x-auto rounded-2xl border border-forest/60">
          <table className="w-full text-left text-xs text-snow">
            <thead className="bg-surface text-muted uppercase text-[10px] tracking-wider border-b border-forest/60">
              <tr>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">İşlem</th>
                <th className="px-4 py-3">Detaylar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/40 bg-surface/50 font-mono text-[11px]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted font-sans">
                    Henüz yönetici işlem kaydı bulunmuyor.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-forest/20">
                    <td className="px-4 py-3 text-muted">
                      {new Date(log.created_at).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 text-gold font-bold">{log.action}</td>
                    <td className="px-4 py-3 text-snow/80">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
