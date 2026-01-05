import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockMessages, mockBookings } from '../mock-data/data';
import { Send, MessageCircle } from 'lucide-react';
import './Messages.css';

const Messages = () => {
    const { user } = useAuth();
    const [messages] = useState(mockMessages);
    const [selectedBooking, setSelectedBooking] = useState(mockBookings[0]);
    const [newMessage, setNewMessage] = useState('');

    const bookingMessages = messages.filter(m => m.bookingId === selectedBooking?.id);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        // In a real app, this would send the message to the backend
        console.log('Sending message:', newMessage);
        setNewMessage('');
    };

    return (
        <div className="messages-page">
            <div className="container">
                <h1 className="messages-title">Messages</h1>

                <div className="messages-container">
                    {/* Conversations List */}
                    <div className="conversations-list">
                        <h2 className="conversations-title">Conversations</h2>
                        <div className="conversations">
                            {mockBookings.map(booking => (
                                <div
                                    key={booking.id}
                                    className={`conversation-item ${selectedBooking?.id === booking.id ? 'active' : ''}`}
                                    onClick={() => setSelectedBooking(booking)}
                                >
                                    <div className="conversation-avatar">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${booking.guestName}&background=6366f1&color=fff`}
                                            alt={booking.guestName}
                                        />
                                    </div>
                                    <div className="conversation-info">
                                        <h4 className="conversation-name">{booking.guestName}</h4>
                                        <p className="conversation-preview">{booking.topic}</p>
                                    </div>
                                    <div className="conversation-meta">
                                        <span className="conversation-time">2h ago</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="chat-area">
                        {selectedBooking ? (
                            <>
                                {/* Chat Header */}
                                <div className="chat-header">
                                    <div className="chat-header-info">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${selectedBooking.guestName}&background=6366f1&color=fff`}
                                            alt={selectedBooking.guestName}
                                            className="chat-avatar"
                                        />
                                        <div>
                                            <h3 className="chat-name">{selectedBooking.guestName}</h3>
                                            <p className="chat-subtitle">{selectedBooking.podcastName}</p>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${selectedBooking.status === 'scheduled' ? 'success' : 'warning'}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>

                                {/* Messages */}
                                <div className="messages-list">
                                    {bookingMessages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`message ${message.senderId === user?.id ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-bubble">
                                                <p className="message-text">{message.message}</p>
                                                <span className="message-time">
                                                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="message-input-container">
                                    <input
                                        type="text"
                                        className="message-input"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        <Send size={18} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="empty-state">
                                <MessageCircle className="empty-state-icon" size={64} />
                                <p className="empty-state-title">No conversation selected</p>
                                <p className="empty-state-description">
                                    Select a conversation to start messaging
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
