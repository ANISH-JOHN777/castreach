import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export const useMessages = (conversationId) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const usingSupabase = isSupabaseConfigured();

    useEffect(() => {
        if (!conversationId || !usingSupabase) {
            setLoading(false);
            return;
        }

        // Load initial messages
        loadMessages();

        // Subscribe to new messages
        const subscription = supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    setMessages(prev =>
                        prev.map(msg => msg.id === payload.new.id ? payload.new : msg)
                    );
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [conversationId, usingSupabase]);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:profiles!sender_id(id, name, avatar)
                `)
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setMessages(data || []);
        } catch (err) {
            setError(err.message);
            console.error('Error loading messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content) => {
        if (!usingSupabase) {
            // Mock mode
            const newMessage = {
                id: Date.now(),
                conversation_id: conversationId,
                sender_id: user.id,
                content,
                read: false,
                created_at: new Date().toISOString(),
                sender: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                }
            };
            setMessages(prev => [...prev, newMessage]);
            return newMessage;
        }

        try {
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content,
                })
                .select(`
                    *,
                    sender:profiles!sender_id(id, name, avatar)
                `)
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            setError(err.message);
            console.error('Error sending message:', err);
            throw err;
        }
    };

    const markAsRead = async (messageId) => {
        if (!usingSupabase) return;

        try {
            const { error } = await supabase
                .from('messages')
                .update({ read: true })
                .eq('id', messageId);

            if (error) throw error;
        } catch (err) {
            console.error('Error marking message as read:', err);
        }
    };

    return {
        messages,
        loading,
        error,
        sendMessage,
        markAsRead,
        refreshMessages: loadMessages,
    };
};

export const useConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const usingSupabase = isSupabaseConfigured();

    useEffect(() => {
        if (!user || !usingSupabase) {
            setLoading(false);
            return;
        }

        loadConversations();
    }, [user, usingSupabase]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    participant1:profiles!participant1_id(id, name, avatar, role),
                    participant2:profiles!participant2_id(id, name, avatar, role),
                    messages(id, content, created_at, read, sender_id)
                `)
                .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            // Get the other participant and last message for each conversation
            const formattedConversations = data.map(conv => {
                const otherParticipant = conv.participant1.id === user.id
                    ? conv.participant2
                    : conv.participant1;

                const lastMessage = conv.messages?.[conv.messages.length - 1];
                const unreadCount = conv.messages?.filter(
                    m => !m.read && m.sender_id !== user.id
                ).length || 0;

                return {
                    ...conv,
                    otherParticipant,
                    lastMessage,
                    unreadCount,
                };
            });

            setConversations(formattedConversations);
        } catch (err) {
            setError(err.message);
            console.error('Error loading conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    const createConversation = async (otherUserId) => {
        if (!usingSupabase) {
            // Mock mode
            return {
                id: Date.now(),
                participant1_id: user.id,
                participant2_id: otherUserId,
            };
        }

        try {
            // Check if conversation already exists
            const { data: existing } = await supabase
                .from('conversations')
                .select('id')
                .or(
                    `and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),` +
                    `and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`
                )
                .single();

            if (existing) return existing;

            // Create new conversation
            const { data, error } = await supabase
                .from('conversations')
                .insert({
                    participant1_id: user.id,
                    participant2_id: otherUserId,
                })
                .select()
                .single();

            if (error) throw error;
            await loadConversations();
            return data;
        } catch (err) {
            setError(err.message);
            console.error('Error creating conversation:', err);
            throw err;
        }
    };

    return {
        conversations,
        loading,
        error,
        createConversation,
        refreshConversations: loadConversations,
    };
};
