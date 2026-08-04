import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Trash2, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, type Message } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetch = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const markRead = async (id: string) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', id);
    setMessages(ms => ms.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('messages').delete().eq('id', id);
    toast.success('Deleted');
    setSelected(null);
    fetch();
  };

  return (
    <AdminLayout title="Messages">
      <div className="grid lg:grid-cols-5 gap-5 h-[calc(100vh-140px)]">
        {/* List */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-neutral-100">
            <p className="text-sm font-medium text-neutral-700">{messages.filter(m => !m.is_read).length} unread</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {loading ? Array.from({length: 5}).map((_, i) => <div key={i} className="p-4"><div className="skeleton h-12 rounded-lg" /></div>) :
              messages.map(m => (
                <button key={m.id} onClick={() => { setSelected(m); if (!m.is_read) markRead(m.id); }} className={`w-full text-left p-4 hover:bg-neutral-50 transition-colors ${selected?.id === m.id ? 'bg-primary-50' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-medium ${!m.is_read ? 'text-neutral-900' : 'text-neutral-600'}`}>{m.name}</p>
                    {!m.is_read && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{m.subject || m.message}</p>
                  <p className="text-xs text-neutral-300 mt-1">{new Date(m.created_at).toLocaleDateString()}</p>
                </button>
              ))
            }
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 card p-6">
          {selected ? (
            <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-heading font-bold text-xl text-neutral-900">{selected.name}</h2>
                  <p className="text-neutral-500 text-sm mt-0.5">{selected.subject || 'No subject'}</p>
                </div>
                <button onClick={() => del(selected.id)} className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-4 mb-5">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-sm text-primary-600 hover:underline"><Mail size={14} />{selected.email}</a>
                {selected.phone && <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-sm text-primary-600 hover:underline"><Phone size={14} />{selected.phone}</a>}
              </div>
              <div className="bg-neutral-50 rounded-xl p-5">
                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <p className="text-xs text-neutral-400 mt-4">{new Date(selected.created_at).toLocaleString()}</p>
              <div className="mt-5">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`} className="btn-primary">Reply via Email</a>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <Eye size={40} className="text-neutral-200 mx-auto mb-3" />
                <p className="text-neutral-400">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
