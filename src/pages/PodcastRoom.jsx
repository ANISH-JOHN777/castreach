import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
    Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, Settings,
    Users, MessageSquare, FileText, Globe, Download, Upload,
    Play, Pause, Square, Maximize2, Minimize2, PenTool, Eraser,
    Type, Circle, Trash2, Save, Languages, Volume2, VolumeX, X, UserPlus, Search
} from 'lucide-react';
import './PodcastRoom.css';

const PodcastRoom = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    // Media refs
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const recognitionRef = useRef(null);

    // State management
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [localStream, setLocalStream] = useState(null);
    const [screenStream, setScreenStream] = useState(null);

    // Whiteboard state
    const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
    const [whiteboardTool, setWhiteboardTool] = useState('pen');
    const [whiteboardColor, setWhiteboardColor] = useState('#6366f1');
    const [isDrawing, setIsDrawing] = useState(false);

    // Transcription & Translation
    const [isTranscriptionOn, setIsTranscriptionOn] = useState(false);
    const [transcriptionText, setTranscriptionText] = useState('');
    const [transcriptionHistory, setTranscriptionHistory] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [translationLanguage, setTranslationLanguage] = useState('none');
    const [translatedText, setTranslatedText] = useState('');
    const [liveCaption, setLiveCaption] = useState('');

    // Chat & Participants
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [participants, setParticipants] = useState([
        { id: user?.id, name: user?.name, role: user?.role, isHost: true }
    ]);

    // UI State
    const [activePanel, setActivePanel] = useState('chat'); // chat, transcript, participants
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Recording chunks
    const recordedChunksRef = useRef([]);

    // Initialize media devices
    useEffect(() => {
        initializeMedia();
        return () => {
            cleanup();
        };
    }, []);

    // Recording timer
    useEffect(() => {
        let interval;
        if (isRecording && !isPaused) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording, isPaused]);

    const initializeMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'user'
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000
                }
            });

            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // Initialize audio level monitoring
            initializeAudioMonitoring(stream);

            toast?.success('Media devices initialized');
        } catch (error) {
            console.error('Error accessing media devices:', error);
            toast?.error('Failed to access camera/microphone');
        }
    };

    const initializeAudioMonitoring = (stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        microphone.connect(analyser);
        analyser.fftSize = 256;

        const updateAudioLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(Math.min(100, (average / 255) * 100));
            requestAnimationFrame(updateAudioLevel);
        };

        updateAudioLevel();
        audioContextRef.current = audioContext;
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOn(!isVideoOn);
        }
    };

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsAudioOn(!isAudioOn);
        }
    };

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        cursor: 'always',
                        displaySurface: 'monitor'
                    },
                    audio: true
                });
                setScreenStream(stream);
                setIsScreenSharing(true);
                toast?.success('Screen sharing started');
            } else {
                if (screenStream) {
                    screenStream.getTracks().forEach(track => track.stop());
                    setScreenStream(null);
                }
                setIsScreenSharing(false);
                toast?.success('Screen sharing stopped');
            }
        } catch (error) {
            console.error('Error sharing screen:', error);
            toast?.error('Failed to share screen');
        }
    };

    const startRecording = async () => {
        try {
            const combinedStream = new MediaStream();

            // Add video tracks
            if (localStream) {
                localStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
                localStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
            }

            // Add screen share if active
            if (screenStream) {
                screenStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
            }

            const options = {
                mimeType: 'video/webm;codecs=vp9,opus',
                videoBitsPerSecond: 8000000,
                audioBitsPerSecond: 128000
            };

            const mediaRecorder = new MediaRecorder(combinedStream, options);
            recordedChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                saveRecording();
            };

            mediaRecorder.start(1000); // Collect data every second
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
            setRecordingTime(0);
            toast?.success('Recording started');

            // Start transcription if enabled
            if (isTranscriptionOn) {
                startTranscription();
            }
        } catch (error) {
            console.error('Error starting recording:', error);
            toast?.error('Failed to start recording');
        }
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
                setIsPaused(false);
                toast?.success('Recording resumed');
            } else {
                mediaRecorderRef.current.pause();
                setIsPaused(true);
                toast?.success('Recording paused');
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            stopTranscription();
            toast?.success('Recording stopped');
        }
    };

    const saveRecording = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `podcast-recording-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        toast?.success('Recording saved');
    };

    // Speech Recognition & Transcription
    const startTranscription = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast?.error('Speech recognition not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onresult = async (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';

                    // Add to history
                    const entry = {
                        id: Date.now(),
                        timestamp: new Date().toLocaleTimeString(),
                        speaker: user?.name || 'Speaker',
                        text: transcript,
                        language: selectedLanguage
                    };

                    setTranscriptionHistory(prev => [...prev, entry]);

                    // Translate if enabled
                    if (translationLanguage !== 'none') {
                        await translateText(transcript);
                    }
                } else {
                    interimTranscript += transcript;
                }
            }

            setTranscriptionText(finalTranscript);
            setLiveCaption(interimTranscript || finalTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsTranscriptionOn(true);
        toast?.success('Transcription started');
    };

    const stopTranscription = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setIsTranscriptionOn(false);
            setLiveCaption('');
        }
    };

    const translateText = async (text) => {
        // This is a placeholder for translation API
        // In production, you would use Google Translate API, DeepL, or similar
        try {
            // Mock translation for demonstration
            setTranslatedText(`[${translationLanguage}] ${text}`);
        } catch (error) {
            console.error('Translation error:', error);
        }
    };

    const downloadTranscript = () => {
        const transcript = transcriptionHistory
            .map(entry => `[${entry.timestamp}] ${entry.speaker}: ${entry.text}`)
            .join('\n');

        const blob = new Blob([transcript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `podcast-transcript-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast?.success('Transcript downloaded');
    };

    // Whiteboard functions
    const initWhiteboard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = whiteboardColor;
    };

    const startDrawing = (e) => {
        if (!isWhiteboardOpen) return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing || !isWhiteboardOpen) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = whiteboardTool === 'eraser' ? '#ffffff' : whiteboardColor;
        ctx.lineWidth = whiteboardTool === 'eraser' ? 20 : 3;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearWhiteboard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Fetch available users for invitation
    const fetchAvailableUsers = async () => {
        setLoadingUsers(true);
        try {
            const { supabase, isSupabaseConfigured } = await import('../config/supabase');

            if (isSupabaseConfigured()) {
                // Fetch from Supabase
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, name, role, avatar, bio')
                    .neq('id', user?.id) // Exclude current user
                    .limit(50);

                if (error) throw error;

                // Filter out already added participants
                const participantIds = participants.map(p => p.id);
                const filtered = data.filter(u => !participantIds.includes(u.id));
                setAvailableUsers(filtered);
            } else {
                // Mock data for development
                const mockUsers = [
                    { id: '2', name: 'Sarah Johnson', role: 'guest', avatar: 'https://i.pravatar.cc/150?img=2', bio: 'Tech enthusiast' },
                    { id: '3', name: 'Mike Chen', role: 'guest', avatar: 'https://i.pravatar.cc/150?img=3', bio: 'Developer' },
                    { id: '4', name: 'Emily Davis', role: 'host', avatar: 'https://i.pravatar.cc/150?img=4', bio: 'Podcast host' },
                    { id: '5', name: 'Alex Kumar', role: 'guest', avatar: 'https://i.pravatar.cc/150?img=5', bio: 'Designer' },
                ];

                const participantIds = participants.map(p => p.id);
                const filtered = mockUsers.filter(u => !participantIds.includes(u.id));
                setAvailableUsers(filtered);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast?.error('Failed to load users');
        } finally {
            setLoadingUsers(false);
        }
    };

    // Invite participant to the room
    const inviteParticipant = (userToInvite) => {
        // Add to participants list
        const newParticipant = {
            id: userToInvite.id,
            name: userToInvite.name,
            role: userToInvite.role,
            isHost: false
        };

        setParticipants(prev => [...prev, newParticipant]);

        // Remove from available users
        setAvailableUsers(prev => prev.filter(u => u.id !== userToInvite.id));

        // Send system message
        const message = {
            id: Date.now(),
            sender: 'System',
            text: `${userToInvite.name} has been invited to the room`,
            timestamp: new Date().toLocaleTimeString(),
            isSystem: true
        };
        setChatMessages(prev => [...prev, message]);

        toast?.success(`Invited ${userToInvite.name} to the room`);

        // In a real implementation, you would send a WebSocket/Supabase Realtime invitation here
    };

    // Remove participant from the room
    const removeParticipant = (participantId) => {
        const participant = participants.find(p => p.id === participantId);
        if (!participant) return;

        setParticipants(prev => prev.filter(p => p.id !== participantId));

        // Send system message
        const message = {
            id: Date.now(),
            sender: 'System',
            text: `${participant.name} has left the room`,
            timestamp: new Date().toLocaleTimeString(),
            isSystem: true
        };
        setChatMessages(prev => [...prev, message]);

        toast?.success(`${participant.name} removed from room`);
    };

    const sendMessage = () => {
        if (!chatInput.trim()) return;

        const message = {
            id: Date.now(),
            sender: user?.name || 'Anonymous',
            text: chatInput,
            timestamp: new Date().toLocaleTimeString()
        };

        setChatMessages(prev => [...prev, message]);
        setChatInput('');
    };

    const cleanup = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`podcast-room ${isFullscreen ? 'fullscreen' : ''}`}>
            {/* Header */}
            <div className="room-header">
                <div className="room-info">
                    <h1>Podcast Recording Room</h1>
                    <span className="room-id">Room: {roomId || 'Live Session'}</span>
                </div>

                <div className="recording-status">
                    {isRecording && (
                        <>
                            <div className={`rec-indicator ${isPaused ? 'paused' : 'recording'}`}>
                                <div className="rec-dot"></div>
                                {isPaused ? 'PAUSED' : 'REC'}
                            </div>
                            <span className="recording-time">{formatTime(recordingTime)}</span>
                        </>
                    )}
                </div>

                <button
                    className="btn-icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
            </div>

            {/* Main Content */}
            <div className="room-content">
                {/* Video Area */}
                <div className="video-area">
                    {/* Main Video */}
                    <div className="main-video">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="video-stream"
                        />

                        {/* Live Caption Overlay */}
                        {liveCaption && (
                            <div className="live-caption">
                                <p>{liveCaption}</p>
                                {translatedText && (
                                    <p className="translated-caption">{translatedText}</p>
                                )}
                            </div>
                        )}

                        {/* Whiteboard Overlay */}
                        {isWhiteboardOpen && (
                            <div className="whiteboard-overlay">
                                <canvas
                                    ref={canvasRef}
                                    width={1920}
                                    height={1080}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                            </div>
                        )}

                        {/* Audio Level Indicator */}
                        {isAudioOn && (
                            <div className="audio-level-indicator">
                                <div
                                    className="audio-level-bar"
                                    style={{ width: `${audioLevel}%` }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Screen Share Preview */}
                    {isScreenSharing && screenStream && (
                        <div className="screen-share-preview">
                            <video
                                autoPlay
                                playsInline
                                ref={remoteVideoRef}
                                srcObject={screenStream}
                                className="screen-video"
                            />
                            <span className="screen-label">Screen Share</span>
                        </div>
                    )}
                </div>

                {/* Side Panel */}
                <div className="side-panel">
                    {/* Panel Tabs */}
                    <div className="panel-tabs">
                        <button
                            className={`tab-btn ${activePanel === 'chat' ? 'active' : ''}`}
                            onClick={() => setActivePanel('chat')}
                        >
                            <MessageSquare size={18} />
                            Chat
                        </button>
                        <button
                            className={`tab-btn ${activePanel === 'transcript' ? 'active' : ''}`}
                            onClick={() => setActivePanel('transcript')}
                        >
                            <FileText size={18} />
                            Transcript
                        </button>
                        <button
                            className={`tab-btn ${activePanel === 'participants' ? 'active' : ''}`}
                            onClick={() => setActivePanel('participants')}
                        >
                            <Users size={18} />
                            Participants
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="panel-content">
                        {activePanel === 'chat' && (
                            <div className="chat-panel">
                                <div className="chat-messages">
                                    {chatMessages.map(msg => (
                                        <div key={msg.id} className="chat-message">
                                            <div className="message-header">
                                                <strong>{msg.sender}</strong>
                                                <span className="message-time">{msg.timestamp}</span>
                                            </div>
                                            <p>{msg.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input-area">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <button onClick={sendMessage} className="btn-send">
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}

                        {activePanel === 'transcript' && (
                            <div className="transcript-panel">
                                <div className="transcript-controls">
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="language-select"
                                    >
                                        <option value="en-US">English (US)</option>
                                        <option value="es-ES">Spanish</option>
                                        <option value="fr-FR">French</option>
                                        <option value="de-DE">German</option>
                                        <option value="hi-IN">Hindi</option>
                                        <option value="ja-JP">Japanese</option>
                                        <option value="zh-CN">Chinese</option>
                                    </select>

                                    <select
                                        value={translationLanguage}
                                        onChange={(e) => setTranslationLanguage(e.target.value)}
                                        className="language-select"
                                    >
                                        <option value="none">No Translation</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="hi">Hindi</option>
                                        <option value="ja">Japanese</option>
                                        <option value="zh">Chinese</option>
                                    </select>

                                    <button
                                        onClick={downloadTranscript}
                                        className="btn-icon"
                                        title="Download Transcript"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>

                                <div className="transcript-history">
                                    {transcriptionHistory.map(entry => (
                                        <div key={entry.id} className="transcript-entry">
                                            <div className="entry-header">
                                                <strong>{entry.speaker}</strong>
                                                <span className="entry-time">{entry.timestamp}</span>
                                            </div>
                                            <p>{entry.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activePanel === 'participants' && (
                            <div className="participants-panel">
                                {/* Add Participant Button */}
                                <button
                                    className="btn btn-primary btn-sm add-participant-btn"
                                    onClick={() => {
                                        setShowAddParticipantModal(true);
                                        fetchAvailableUsers();
                                    }}
                                >
                                    <Users size={16} />
                                    Add Participant
                                </button>

                                {/* Participants List */}
                                {participants.map(participant => (
                                    <div key={participant.id} className="participant-item">
                                        <div className="participant-avatar">
                                            {participant.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="participant-info">
                                            <strong>{participant.name}</strong>
                                            <span className="participant-role">{participant.role}</span>
                                        </div>
                                        {participant.isHost && (
                                            <span className="host-badge">Host</span>
                                        )}
                                        {!participant.isHost && user?.role === 'host' && (
                                            <button
                                                className="btn-icon btn-remove"
                                                onClick={() => removeParticipant(participant.id)}
                                                title="Remove participant"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="control-bar">
                {/* Media Controls */}
                <div className="control-group">
                    <button
                        className={`control-btn ${!isVideoOn ? 'danger' : ''}`}
                        onClick={toggleVideo}
                        title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
                    >
                        {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>

                    <button
                        className={`control-btn ${!isAudioOn ? 'danger' : ''}`}
                        onClick={toggleAudio}
                        title={isAudioOn ? 'Mute' : 'Unmute'}
                    >
                        {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>

                    <button
                        className={`control-btn ${isScreenSharing ? 'active' : ''}`}
                        onClick={toggleScreenShare}
                        title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                    >
                        {isScreenSharing ? <MonitorOff size={24} /> : <Monitor size={24} />}
                    </button>
                </div>

                {/* Recording Controls */}
                <div className="control-group">
                    {!isRecording ? (
                        <button
                            className="control-btn record-btn"
                            onClick={startRecording}
                            title="Start Recording"
                        >
                            <Play size={24} />
                            Start Recording
                        </button>
                    ) : (
                        <>
                            <button
                                className="control-btn"
                                onClick={pauseRecording}
                                title={isPaused ? 'Resume' : 'Pause'}
                            >
                                {isPaused ? <Play size={24} /> : <Pause size={24} />}
                            </button>
                            <button
                                className="control-btn danger"
                                onClick={stopRecording}
                                title="Stop Recording"
                            >
                                <Square size={24} />
                                Stop
                            </button>
                        </>
                    )}
                </div>

                {/* Feature Controls */}
                <div className="control-group">
                    <button
                        className={`control-btn ${isWhiteboardOpen ? 'active' : ''}`}
                        onClick={() => {
                            setIsWhiteboardOpen(!isWhiteboardOpen);
                            if (!isWhiteboardOpen) initWhiteboard();
                        }}
                        title="Toggle Whiteboard"
                    >
                        <PenTool size={24} />
                    </button>

                    {isWhiteboardOpen && (
                        <>
                            <div className="whiteboard-tools">
                                <button
                                    className={`tool-btn ${whiteboardTool === 'pen' ? 'active' : ''}`}
                                    onClick={() => setWhiteboardTool('pen')}
                                >
                                    <PenTool size={18} />
                                </button>
                                <button
                                    className={`tool-btn ${whiteboardTool === 'eraser' ? 'active' : ''}`}
                                    onClick={() => setWhiteboardTool('eraser')}
                                >
                                    <Eraser size={18} />
                                </button>
                                <input
                                    type="color"
                                    value={whiteboardColor}
                                    onChange={(e) => setWhiteboardColor(e.target.value)}
                                    className="color-picker"
                                />
                                <button
                                    className="tool-btn"
                                    onClick={clearWhiteboard}
                                    title="Clear Whiteboard"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        className={`control-btn ${isTranscriptionOn ? 'active' : ''}`}
                        onClick={() => {
                            if (isTranscriptionOn) {
                                stopTranscription();
                            } else {
                                startTranscription();
                            }
                        }}
                        title={isTranscriptionOn ? 'Stop Transcription' : 'Start Transcription'}
                    >
                        <Languages size={24} />
                    </button>
                </div>

                {/* Exit Button */}
                <div className="control-group">
                    <button
                        className="control-btn danger"
                        onClick={() => {
                            if (confirm('Are you sure you want to leave the room?')) {
                                cleanup();
                                navigate('/bookings');
                            }
                        }}
                        title="Leave Room"
                    >
                        Exit Room
                    </button>
                </div>
            </div>

            {/* Add Participant Modal */}
            {showAddParticipantModal && (
                <div className="modal-overlay" onClick={() => setShowAddParticipantModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Participant</h2>
                            <button
                                className="btn-icon"
                                onClick={() => setShowAddParticipantModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Search Bar */}
                            <div className="search-bar">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Available Users List */}
                            <div className="available-users-list">
                                {loadingUsers ? (
                                    <div className="loading-state">
                                        <div className="spinner"></div>
                                        <p>Loading users...</p>
                                    </div>
                                ) : (
                                    <>
                                        {availableUsers
                                            .filter(u =>
                                                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                u.role.toLowerCase().includes(searchQuery.toLowerCase())
                                            )
                                            .map(user => (
                                                <div key={user.id} className="available-user-item">
                                                    <div className="user-avatar">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} />
                                                        ) : (
                                                            user.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="user-details">
                                                        <strong>{user.name}</strong>
                                                        <span className="user-role">{user.role}</span>
                                                        {user.bio && <p className="user-bio">{user.bio}</p>}
                                                    </div>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => {
                                                            inviteParticipant(user);
                                                            if (availableUsers.filter(u =>
                                                                u.name.toLowerCase().includes(searchQuery.toLowerCase())
                                                            ).length <= 1) {
                                                                setShowAddParticipantModal(false);
                                                            }
                                                        }}
                                                    >
                                                        <UserPlus size={16} />
                                                        Invite
                                                    </button>
                                                </div>
                                            ))}

                                        {availableUsers.filter(u =>
                                            u.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        ).length === 0 && (
                                                <div className="empty-state">
                                                    <Users size={48} />
                                                    <p>No users found</p>
                                                    <span>Try adjusting your search</span>
                                                </div>
                                            )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowAddParticipantModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PodcastRoom;
