'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Upload, Settings, Plus, Trash2, Edit2, Download, Circle, Square, Triangle, Star, Heart, Zap, Sun, Moon, Cloud, Flame } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type FrameRate = 24 | 30;

interface CuePointType {
    id: string;
    name: string;
    color: string;
    key: string; // Keyboard key (0-9)
    icon: string; // Lucide icon name
}

interface CuePoint {
    id: string;
    typeId: string;
    time: number;
    timecode: string;
    name?: string;
}

interface AudioTrack {
    id: string;
    file: File;
    name: string;
    dataUrl?: string; // For persistence
    cuePoints: CuePoint[]; // Store cue points with the track
    cuePointTypes: CuePointType[]; // Store cue types with the track
}

const DEFAULT_COLORS = [
    '#ff6b9d', '#ffa06b', '#ffd96b', '#c0f06b', '#6bffb4',
    '#6bdfff', '#6b9dff', '#a06bff', '#ff6be5', '#ff6b6b',
];

const DEFAULT_ICONS = [
    'Circle', 'Square', 'Triangle', 'Star', 'Heart',
    'Zap', 'Sun', 'Moon', 'Cloud', 'Flame',
];

const DEFAULT_CUE_TYPES = [
    { name: 'Lighting', icon: 'Sun', color: '#ffd96b' },
    { name: 'Sound', icon: 'Zap', color: '#6bdfff' },
    { name: 'Audio', icon: 'Circle', color: '#ff6b9d' },
    { name: 'Video', icon: 'Star', color: '#a06bff' },
    { name: 'Direction', icon: 'Triangle', color: '#6bffb4' },
];

const KEYBOARD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const STORAGE_KEYS = {
    FRAME_RATE: 'pointcue-frame-rate',
    AUDIO_TRACKS: 'pointcue-audio-tracks',
    CURRENT_TRACK: 'pointcue-current-track',
} as const;

// Icon map for dynamic rendering
const ICON_MAP: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>> = {
    Circle, Square, Triangle, Star, Heart,
    Zap, Sun, Moon, Cloud, Flame,
};

export default function Page() {
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [frameRate, setFrameRate] = useState<FrameRate>(24);
    const [isMobile, setIsMobile] = useState(false);

    // Get current track's cue point types
    const currentTrack = audioTracks.find(t => t.id === currentTrackId);
    const cuePointTypes = useMemo(() => currentTrack?.cuePointTypes || [], [currentTrack?.cuePointTypes]);

    // Load from localStorage on mount
    useEffect(() => {
        // Check if user is on mobile
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor;
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(isMobileDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const loadData = async () => {
            try {
                const savedFrameRate = localStorage.getItem(STORAGE_KEYS.FRAME_RATE);
                const savedTracks = localStorage.getItem(STORAGE_KEYS.AUDIO_TRACKS);

                if (savedFrameRate) {
                    setFrameRate(JSON.parse(savedFrameRate));
                }
                if (savedTracks) {
                    const tracksData = JSON.parse(savedTracks);
                    // Convert data URLs back to File objects
                    const tracks = await Promise.all(
                        tracksData.map(async (track: AudioTrack) => {
                            if (track.dataUrl) {
                                const response = await fetch(track.dataUrl);
                                const blob = await response.blob();
                                const file = new File([blob], track.name, { type: blob.type });
                                return { ...track, file };
                            }
                            return track;
                        })
                    );
                    setAudioTracks(tracks);
                    
                    // Load the last opened track
                    const savedCurrentTrack = localStorage.getItem(STORAGE_KEYS.CURRENT_TRACK);
                    if (savedCurrentTrack && tracks.length > 0) {
                        const trackId = JSON.parse(savedCurrentTrack);
                        const track = tracks.find(t => t.id === trackId);
                        if (track) {
                            setCurrentTrackId(track.id);
                            setAudioFile(track.file);
                        } else {
                            // If saved track not found, load the first track
                            setCurrentTrackId(tracks[0].id);
                            setAudioFile(tracks[0].file);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        };

        loadData();

        // Prevent browser pinch-to-zoom globally on this page (except on waveform)
        const preventBrowserZoom = (e: WheelEvent) => {
            // Allow zoom on the waveform container
            if (waveformRef.current?.contains(e.target as Node)) {
                return;
            }
            
            if (e.ctrlKey) {
                e.preventDefault();
            }
        };

        const preventGestureZoom = (e: Event) => {
            // Allow gestures on the waveform container
            if (waveformRef.current?.contains(e.target as Node)) {
                return;
            }
            
            e.preventDefault();
        };

        document.addEventListener('wheel', preventBrowserZoom, { passive: false });
        document.addEventListener('gesturestart', preventGestureZoom, { passive: false });
        document.addEventListener('gesturechange', preventGestureZoom, { passive: false });
        document.addEventListener('gestureend', preventGestureZoom, { passive: false });

        return () => {
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('wheel', preventBrowserZoom);
            document.removeEventListener('gesturestart', preventGestureZoom);
            document.removeEventListener('gesturechange', preventGestureZoom);
            document.removeEventListener('gestureend', preventGestureZoom);
        };
    }, []);

    // Save frame rate to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.FRAME_RATE, JSON.stringify(frameRate));
        } catch (error) {
            console.error('Error saving frame rate to localStorage:', error);
        }
    }, [frameRate]);

    // Save audio tracks to localStorage
    useEffect(() => {
        const saveTracks = async () => {
            try {
                const tracksData = await Promise.all(
                    audioTracks.map(async (track) => {
                        // Convert File to data URL if not already done
                        if (!track.dataUrl && track.file) {
                            const dataUrl = await new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.readAsDataURL(track.file);
                            });
                            return { ...track, dataUrl };
                        }
                        return track;
                    })
                );
                // Store without the File objects
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const serializableTracks = tracksData.map(({ file, ...rest }) => rest);
                localStorage.setItem(STORAGE_KEYS.AUDIO_TRACKS, JSON.stringify(serializableTracks));
            } catch (error) {
                console.error('Error saving tracks to localStorage:', error);
            }
        };

        if (audioTracks.length > 0) {
            saveTracks();
        } else {
            localStorage.removeItem(STORAGE_KEYS.AUDIO_TRACKS);
        }
    }, [audioTracks]);

    // Save current track to localStorage
    useEffect(() => {
        try {
            if (currentTrackId) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_TRACK, JSON.stringify(currentTrackId));
            } else {
                localStorage.removeItem(STORAGE_KEYS.CURRENT_TRACK);
            }
        } catch (error) {
            console.error('Error saving current track to localStorage:', error);
        }
    }, [currentTrackId]);

    // Format time to timecode (HH:MM:SS:FF)
    const formatTimecode = (timeInSeconds: number, fps: FrameRate): string => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        const frames = Math.floor((timeInSeconds % 1) * fps);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
    };

    // Initialize WaveSurfer
    useEffect(() => {
        if (waveformRef.current && audioFile) {
            // Destroy existing instance
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }

            // Create new WaveSurfer instance
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#ffffff60',
                progressColor: '#ffffff20',
                cursorColor: '#ffffff',
                cursorWidth: 1,
                barWidth: 2,
                barGap: 1,
                height: 120,
                normalize: true,
                minPxPerSec: 1,
                dragToSeek: true,
            });

            wavesurferRef.current = wavesurfer;

            // Load audio file
            const url = URL.createObjectURL(audioFile);
            wavesurfer.load(url);

            // Event listeners
            wavesurfer.on('ready', () => {
                setDuration(wavesurfer.getDuration());
            });

            wavesurfer.on('audioprocess', () => {
                setCurrentTime(wavesurfer.getCurrentTime());
            });

            wavesurfer.on('interaction', () => {
                setCurrentTime(wavesurfer.getCurrentTime());
            });

            wavesurfer.on('seeking', () => {
                setCurrentTime(wavesurfer.getCurrentTime());
            });

            wavesurfer.on('play', () => {
                setIsPlaying(true);
            });

            wavesurfer.on('pause', () => {
                setIsPlaying(false);
            });

            wavesurfer.on('finish', () => {
                setIsPlaying(false);
            });

            return () => {
                wavesurfer.destroy();
                URL.revokeObjectURL(url);
            };
        }
    }, [audioFile]);

    // Add audio tracks
    const addAudioTracks = useCallback((files: File[]) => {
        const newTracks: AudioTrack[] = files.map(file => {
            // Create default cue types for new tracks
            const defaultTypes: CuePointType[] = DEFAULT_CUE_TYPES.map((defaultType, index) => ({
                id: crypto.randomUUID(),
                name: defaultType.name,
                color: defaultType.color,
                key: KEYBOARD_KEYS[index],
                icon: defaultType.icon,
            }));

            return {
                id: crypto.randomUUID(),
                file,
                name: file.name,
                cuePoints: [], // Initialize with empty cue points array
                cuePointTypes: defaultTypes, // Initialize with default cue point types
            };
        });

        setAudioTracks(prev => [...prev, ...newTracks]);
        
        // If no track is currently selected, select the first new track
        if (!currentTrackId && newTracks.length > 0) {
            switchToTrack(newTracks[0].id, newTracks[0].file);
        }
    }, [currentTrackId]);

    // Handle file drop
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const audioFiles = files.filter(file => 
            file.type === 'audio/mpeg' || 
            file.type === 'audio/wav' || 
            file.type === 'audio/flac' ||
            file.type === 'audio/x-wav' ||
            file.type === 'audio/x-flac'
        );

        if (audioFiles.length > 0) {
            addAudioTracks(audioFiles);
        }
    }, [addAudioTracks]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    // Handle file input
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            addAudioTracks(Array.from(files));
        }
    };

    // Switch to a different track
    const switchToTrack = (trackId: string, file: File) => {
        setCurrentTrackId(trackId);
        setAudioFile(file);
        setCurrentTime(0);
        setIsPlaying(false);
    };

    // Remove a track
    const removeTrack = (trackId: string) => {
        // Remove the track from the list (cue points are stored with the track)
        setAudioTracks(prev => prev.filter(t => t.id !== trackId));
        
        if (currentTrackId === trackId) {
            const remaining = audioTracks.filter(t => t.id !== trackId);
            if (remaining.length > 0) {
                switchToTrack(remaining[0].id, remaining[0].file);
            } else {
                setCurrentTrackId(null);
                setAudioFile(null);
            }
        }
    };

    // Play/Pause toggle
    const togglePlayPause = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
        }
    };

    // Add cue point type
    const addCuePointType = () => {
        if (!currentTrack) return;
        if (cuePointTypes.length >= 10) return;
        
        const availableKey = KEYBOARD_KEYS.find(
            key => !cuePointTypes.some(type => type.key === key)
        );
        
        if (!availableKey) return;

        const newType: CuePointType = {
            id: crypto.randomUUID(),
            name: `Cue Type ${cuePointTypes.length + 1}`,
            color: DEFAULT_COLORS[cuePointTypes.length % DEFAULT_COLORS.length],
            key: availableKey,
            icon: DEFAULT_ICONS[cuePointTypes.length % DEFAULT_ICONS.length],
        };

        setAudioTracks(prev => prev.map(track =>
            track.id === currentTrack.id
                ? { ...track, cuePointTypes: [...track.cuePointTypes, newType] }
                : track
        ));
    };

    // Update cue point type
    const updateCuePointType = (id: string, updates: Partial<CuePointType>) => {
        if (!currentTrack) return;
        setAudioTracks(prev => prev.map(track =>
            track.id === currentTrack.id
                ? { 
                    ...track, 
                    cuePointTypes: track.cuePointTypes.map(type => 
                        type.id === id ? { ...type, ...updates } : type
                    )
                }
                : track
        ));
    };

    // Delete cue point type
    const deleteCuePointType = (id: string) => {
        if (!currentTrack) return;
        setAudioTracks(prev => prev.map(track =>
            track.id === currentTrack.id
                ? { 
                    ...track, 
                    cuePointTypes: track.cuePointTypes.filter(type => type.id !== id),
                    cuePoints: track.cuePoints.filter(point => point.typeId !== id)
                }
                : track
        ));
    };

    // Drop a cue point
    const dropCuePoint = useCallback((typeId: string) => {
        if (!wavesurferRef.current || !currentTrackId) return;

        const time = wavesurferRef.current.getCurrentTime();
        const newCuePoint: CuePoint = {
            id: crypto.randomUUID(),
            typeId,
            time,
            timecode: formatTimecode(time, frameRate),
        };

        // Add cue point to the current track
        setAudioTracks(prev => prev.map(track =>
            track.id === currentTrackId
                ? { ...track, cuePoints: [...track.cuePoints, newCuePoint].sort((a, b) => a.time - b.time) }
                : track
        ));
    }, [frameRate, currentTrackId]);

    // Delete cue point
    const deleteCuePoint = useCallback((id: string) => {
        // Remove cue point from the current track
        setAudioTracks(prev => prev.map(track =>
            track.id === currentTrackId
                ? { ...track, cuePoints: track.cuePoints.filter(point => point.id !== id) }
                : track
        ));
    }, [currentTrackId]);

    // Update cue point
    const updateCuePoint = (id: string, updates: Partial<CuePoint>) => {
        // Update cue point in the current track
        setAudioTracks(prev => prev.map(track =>
            track.id === currentTrackId
                ? { ...track, cuePoints: track.cuePoints.map(point =>
                    point.id === id ? { ...point, ...updates } : point
                )}
                : track
        ));
    };

    // Export cue points to EOS ASCII format
    const exportToEOS = (typeId?: string) => {
        const currentTrack = audioTracks.find(t => t.id === currentTrackId);
        if (!currentTrack) return;

        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
        
        let output = `Ident 3:0
Manufacturer ETC
Console Eos
$$Format 3.00
`;

        if (typeId) {
            // Export single type to one cuelist
            const type = cuePointTypes.find(t => t.id === typeId);
            if (!type) return;

            const filteredPoints = currentTrack.cuePoints
                .filter(p => p.typeId === typeId)
                .sort((a, b) => a.time - b.time);

            output += `$CueList 1
	Text ${type.name} ${timestamp}
	$$Data TimeCode 0

`;
            // Add cues
            filteredPoints.forEach((point, index) => {
                output += `Cue ${index + 1} 1
	Text ${point.name || ''}

`;
            });

            // Add SMPTE list
            output += `$SCList 1 2 ! SMPTE
	Text ${type.name}
	$$FirstFrame  00:00:00:00
	$$LastFrame   ${formatTimecode(duration, frameRate)}
	$$FramesPerSecond ${frameRate}

`;
            // Add timecode entries
            filteredPoints.forEach((point, index) => {
                output += `$TimeCode  ${point.timecode}
	Text ${point.name || ''}
	$$SCData C 1/${index + 1}

`;
            });

        } else {
            // Export all types to separate cuelists
            cuePointTypes.forEach((type, typeIndex) => {
                const filteredPoints = currentTrack.cuePoints
                    .filter(p => p.typeId === type.id)
                    .sort((a, b) => a.time - b.time);

                if (filteredPoints.length === 0) return;

                const cueListNum = typeIndex + 1;
                
                output += `$CueList ${cueListNum}
	Text ${type.name} ${timestamp}
	$$Data TimeCode 0

`;
                // Add cues
                filteredPoints.forEach((point, index) => {
                    output += `Cue ${index + 1} 1
	Text ${point.name || ''}

`;
                });

                // Add SMPTE list
                output += `$SCList ${cueListNum} 2 ! SMPTE
	Text ${type.name}
	$$FirstFrame  00:00:00:00
	$$LastFrame   ${formatTimecode(duration, frameRate)}
	$$FramesPerSecond ${frameRate}

`;
                // Add timecode entries
                filteredPoints.forEach((point, index) => {
                    output += `$TimeCode  ${point.timecode}
	Text ${point.name || ''}
	$$SCData C ${cueListNum}/${index + 1}

`;
                });
            });
        }

        // Download the file
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = typeId 
            ? `${cuePointTypes.find(t => t.id === typeId)?.name || 'CuePoints'}_${currentTrack.name}.asc`
            : `${currentTrack.name}_AllCuePoints.asc`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Keyboard event handler
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement) return;

            const type = cuePointTypes.find(t => t.key === e.key);
            if (type && wavesurferRef.current) {
                e.preventDefault();
                dropCuePoint(type.id);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [cuePointTypes, dropCuePoint]);

    // Render cue points on waveform
    useEffect(() => {
        if (!wavesurferRef.current || !waveformRef.current || !currentTrackId) return;

        const container = waveformRef.current;
        const existingMarkers = container.querySelectorAll('.cue-marker');
        existingMarkers.forEach(marker => marker.remove());

        // Get cue points from the current track
        const currentTrack = audioTracks.find(t => t.id === currentTrackId);
        if (!currentTrack) return;

        currentTrack.cuePoints.forEach(point => {
            const type = cuePointTypes.find(t => t.id === point.typeId);
            if (!type || duration === 0) return;

            const marker = document.createElement('div');
            marker.className = 'cue-marker';
            marker.style.position = 'absolute';
            marker.style.top = '0';
            marker.style.bottom = '0';
            marker.style.width = '2px';
            marker.style.backgroundColor = type.color;
            marker.style.left = `${(point.time / duration) * 100}%`;
            marker.style.cursor = 'pointer';
            marker.style.zIndex = '10';
            marker.style.transition = 'all 0.2s ease';
            marker.style.opacity = '0.8';
            marker.title = `${type.name} - ${point.timecode}`;

            marker.addEventListener('mouseenter', () => {
                marker.style.width = '4px';
                marker.style.opacity = '1';
            });

            marker.addEventListener('mouseleave', () => {
                marker.style.width = '2px';
                marker.style.opacity = '0.8';
            });

            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Delete cue point "${type.name}" at ${point.timecode}?`)) {
                    deleteCuePoint(point.id);
                }
            });

            container.style.position = 'relative';
            container.appendChild(marker);
        });
    }, [audioTracks, cuePointTypes, duration, currentTrackId, deleteCuePoint]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-2">
            {isMobile ? (
                <div className="flex flex-col items-center justify-center text-center px-6">
                    <div className="text-6xl mb-6">📱</div>
                    <h1 className="text-2xl font-light text-white mb-3">PointCue</h1>
                    <p className="text-sm text-white/60 max-w-xs">
                        PointCue is not available on mobile devices. Please visit on a desktop or laptop computer.
                    </p>
                </div>
            ) : (
            <div className="w-full h-[calc(100vh-1rem)] flex gap-4">
                {/* Left Sidebar - File List */}
                <div 
                    className="w-80 flex flex-col"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    {/* File List / Drop Zone */}
                    <div className={`flex-1 rounded-2xl backdrop-blur-xl border-2 border-dashed p-4 overflow-hidden flex flex-col transition-all ${
                        isDragging
                            ? 'border-white/60 bg-white/10'
                            : 'border-white/20 bg-white/5'
                    }`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-xs text-white/40">
                                {audioTracks.length} track{audioTracks.length !== 1 ? 's' : ''}
                            </div>
                            <label className="cursor-pointer">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="audio/mpeg,audio/wav,audio/flac,audio/x-wav,audio/x-flac"
                                    onChange={handleFileInput}
                                    className="hidden"
                                    multiple
                                />
                                <Plus className="w-4 h-4 text-white/40 hover:text-white/60 transition-colors" strokeWidth={1.5} />
                            </label>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {audioTracks.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <Upload className="w-12 h-12 mb-3 text-white/20" strokeWidth={1.5} />
                                    <div className="text-xs text-white/40">
                                        Drop files here or click + to upload
                                    </div>
                                </div>
                            ) : (
                                audioTracks.map((track) => (
                                    <div
                                        key={track.id}
                                        className={`group rounded-lg p-3 transition-all cursor-pointer ${
                                            currentTrackId === track.id
                                                ? 'bg-white/15 border border-white/20'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        }`}
                                        onClick={() => switchToTrack(track.id, track.file)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-white/80 truncate">
                                                    {track.name}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeTrack(track.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all flex-shrink-0"
                                            >
                                                <Trash2 className="w-3 h-3 text-white/40" strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {audioFile ? (
                    <div className="flex-1 flex gap-4">
                        {/* Center Column - Waveform & Controls */}
                        <div className="flex-1 flex flex-col space-y-4">
                            {/* Top Bar - Cue Type Icons & Controls */}
                            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 relative z-20">
                                {/* Cue Type Icons */}
                                <div className="flex items-center gap-2">
                                    {cuePointTypes.map((type) => {
                                        const IconComponent = ICON_MAP[type.icon];
                                        return (
                                            <Popover key={type.id}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        className="group relative"
                                                        title={`${type.name} (${type.key}) - Left click to edit, Right click to drop cue`}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            dropCuePoint(type.id);
                                                        }}
                                                    >
                                                        <div 
                                                            className="w-8 h-8 rounded-lg transition-all hover:scale-110 flex items-center justify-center"
                                                            style={{
                                                                backgroundColor: `${type.color}40`,
                                                                border: `1px solid ${type.color}60`
                                                            }}
                                                        >
                                                            {IconComponent && <IconComponent className="w-4 h-4" style={{ color: type.color }} strokeWidth={1.5} />}
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                                            <span className="text-[8px] font-mono text-white/80">{type.key}</span>
                                                        </div>
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-64 bg-black/95 backdrop-blur-xl border-white/20 p-3 z-[100]">
                                                    <div className="space-y-3">
                                                        <div className="text-xs text-white/40 tracking-wider uppercase">Edit {type.name}</div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={type.color}
                                                                    onChange={(e) => updateCuePointType(type.id, { color: e.target.value })}
                                                                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                                                                />
                                                                <select
                                                                    value={type.icon}
                                                                    onChange={(e) => updateCuePointType(type.id, { icon: e.target.value })}
                                                                    className="flex-1 h-8 px-2 bg-white/5 border border-white/20 rounded text-xs cursor-pointer focus:outline-none focus:border-white/40 text-white/80"
                                                                >
                                                                    {DEFAULT_ICONS.map((icon) => (
                                                                        <option key={icon} value={icon} className="bg-black">
                                                                            {icon}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <input
                                                                value={type.name}
                                                                onChange={(e) => updateCuePointType(type.id, { name: e.target.value })}
                                                                className="w-full px-2 py-1.5 bg-white/5 border border-white/20 rounded text-xs text-white/80 focus:outline-none focus:border-white/40 placeholder:text-white/30"
                                                                placeholder="Type name"
                                                            />
                                                            <button
                                                                onClick={() => deleteCuePointType(type.id)}
                                                                className="w-full px-2 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs text-red-400 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                                                                Delete Type
                                                            </button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        );
                                    })}
                                    {cuePointTypes.length < 10 && (
                                        <button
                                            onClick={addCuePointType}
                                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center"
                                            title="Add cue type"
                                        >
                                            <Plus className="w-4 h-4 text-white/40" strokeWidth={1.5} />
                                        </button>
                                    )}
                                </div>

                                {/* Right Controls */}
                                <div className="flex items-center gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                                                <Edit2 className="h-3.5 w-3.5 text-white/60" strokeWidth={1.5} />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 bg-black/95 backdrop-blur-xl border-white/20 p-4 z-[100]">
                                            <div className="space-y-3">
                                                <div className="text-xs text-white/40 tracking-wider uppercase">Edit Cue Types</div>
                                                {cuePointTypes.length === 0 ? (
                                                    <div className="text-xs text-white/30 text-center py-6">
                                                        No types yet
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                                        {cuePointTypes.map((type) => (
                                                            <div
                                                                key={type.id}
                                                                className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
                                                            >
                                                                <input
                                                                    type="color"
                                                                    value={type.color}
                                                                    onChange={(e) =>
                                                                        updateCuePointType(type.id, { color: e.target.value })
                                                                    }
                                                                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                                                                />
                                                                <select
                                                                    value={type.icon}
                                                                    onChange={(e) =>
                                                                        updateCuePointType(type.id, { icon: e.target.value })
                                                                    }
                                                                    className="w-8 h-6 bg-transparent border border-white/20 rounded text-xs cursor-pointer focus:outline-none focus:border-white/40"
                                                                >
                                                                    {DEFAULT_ICONS.map((icon) => (
                                                                        <option key={icon} value={icon} className="bg-black">
                                                                            {icon}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <input
                                                                    value={type.name}
                                                                    onChange={(e) =>
                                                                        updateCuePointType(type.id, { name: e.target.value })
                                                                    }
                                                                    className="flex-1 bg-transparent border-0 text-xs text-white/80 focus:outline-none placeholder:text-white/30"
                                                                    placeholder="Type name"
                                                                />
                                                                <div className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
                                                                    <span className="text-[10px] font-mono text-white/60">
                                                                        {type.key}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={() => deleteCuePointType(type.id)}
                                                                    className="p-1 rounded hover:bg-white/10 transition-all"
                                                                >
                                                                    <Trash2 className="w-3 h-3 text-white/40 hover:text-white/60" strokeWidth={1.5} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                                                <Settings className="h-3.5 w-3.5 text-white/60" strokeWidth={1.5} />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 bg-black/95 backdrop-blur-xl border-white/20 p-3 z-[100]">
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setFrameRate(24)}
                                                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs transition-all ${
                                                            frameRate === 24
                                                                ? 'bg-white text-black'
                                                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                                        }`}
                                                    >
                                                        24
                                                    </button>
                                                    <button
                                                        onClick={() => setFrameRate(30)}
                                                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs transition-all ${
                                                            frameRate === 30
                                                                ? 'bg-white text-black'
                                                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                                        }`}
                                                    >
                                                        30
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => setAudioFile(null)}
                                                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 transition-all"
                                                >
                                                    Change File
                                                </button>
                                                <div className="pt-2 border-t border-white/10">
                                                    <div className="text-xs text-white/40 mb-2">Export to EOS</div>
                                                    <button
                                                        onClick={() => exportToEOS()}
                                                        className="w-full px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Download className="w-3 h-3" strokeWidth={1.5} />
                                                        All Types
                                                    </button>
                                                    {cuePointTypes.length > 0 && (
                                                        <div className="mt-1 space-y-1">
                                                            {cuePointTypes.map(type => (
                                                                <button
                                                                    key={type.id}
                                                                    onClick={() => exportToEOS(type.id)}
                                                                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
                                                                    {type.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Waveform */}
                            <div className="flex-1 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 overflow-hidden touch-none" style={{ touchAction: 'none' }}>
                                <div ref={waveformRef} className="w-full overflow-x-auto touch-none mb-4" style={{ touchAction: 'none' }} />
                                
                                {/* Mini Timelines for each cue type */}
                                {cuePointTypes.length > 0 && (
                                    <div className="relative mt-4 border-t border-white/10 pt-4">
                                        {/* Global playback cursor - spans all timelines */}
                                        <div
                                            className="absolute top-0 bottom-0 w-[2px] bg-white/80 z-30 pointer-events-none shadow-lg"
                                            style={{ 
                                                left: `${((wavesurferRef.current?.getDuration() || 0) > 0 ? (currentTime / (wavesurferRef.current?.getDuration() || 1)) * 100 : 0)}%`
                                            }}
                                        />
                                        
                                        <div className="space-y-2">
                                            {cuePointTypes.map((type) => {
                                                const typeCuePoints = currentTrack?.cuePoints.filter(cp => cp.typeId === type.id) || [];
                                                const currentDuration = wavesurferRef.current?.getDuration() || 0;
                                                const IconComponent = ICON_MAP[type.icon];
                                                
                                                return (
                                                    <div key={type.id} className="relative h-8 bg-white/10 rounded border border-white/20 overflow-hidden">
                                                        {/* Cue point icons */}
                                                        {typeCuePoints.map((cuePoint) => {
                                                            const position = currentDuration > 0 ? (cuePoint.time / currentDuration) * 100 : 0;
                                                            return (
                                                                <div
                                                                    key={cuePoint.id}
                                                                    className="absolute top-0 bottom-0 flex items-center cursor-pointer hover:scale-125 transition-transform z-10"
                                                                    style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                                                                    title={`${cuePoint.name || 'Cue'} - ${cuePoint.timecode}`}
                                                                    onClick={() => {
                                                                        if (wavesurferRef.current) {
                                                                            wavesurferRef.current.setTime(cuePoint.time);
                                                                        }
                                                                    }}
                                                                >
                                                                    {IconComponent && <IconComponent className="w-4 h-4" style={{ color: type.color }} strokeWidth={1.5} />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Playback Controls */}
                            <div className="flex items-center justify-center py-2">
                                <button
                                    onClick={togglePlayPause}
                                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all flex items-center justify-center group"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-6 h-6 text-white/80 group-hover:text-white" strokeWidth={1.5} />
                                    ) : (
                                        <Play className="w-6 h-6 text-white/80 group-hover:text-white ml-0.5" strokeWidth={1.5} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Timecode & Cue Points */}
                        <div className="w-80 flex flex-col space-y-4">
                            {/* Timecode Display */}
                            <div className="px-4 py-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center relative z-10">
                                <div className="text-4xl font-mono font-light text-white tracking-[0.15em]">
                                    {formatTimecode(currentTime, frameRate)}
                                </div>
                                <div className="mt-2 text-xs text-white/30 tracking-wider">
                                    {formatTimecode(duration, frameRate)} · {frameRate}FPS
                                </div>
                            </div>

                            {/* Cue Points List */}
                            {(() => {
                                const currentTrack = audioTracks.find(t => t.id === currentTrackId);
                                const trackCuePoints = currentTrack?.cuePoints || [];
                                return trackCuePoints.length > 0 ? (
                                    <div className="flex-1 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 space-y-2 overflow-hidden flex flex-col">
                                        <div className="text-xs text-white/40">
                                            {trackCuePoints.length} point{trackCuePoints.length !== 1 ? 's' : ''}
                                        </div>
                                        <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
                                            {trackCuePoints.map((point) => {
                                                const type = cuePointTypes.find(t => t.id === point.typeId);
                                                if (!type) return null;
                                                return (
                                                    <div
                                                        key={point.id}
                                                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                                                    >
                                                        <div
                                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: type.color }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <input
                                                                value={point.name || ''}
                                                                onChange={(e) => updateCuePoint(point.id, { name: e.target.value })}
                                                                placeholder={type.name}
                                                                className="w-full bg-transparent border-0 text-xs text-white/80 focus:outline-none placeholder:text-white/40 truncate"
                                                            />
                                                            <div className="text-[10px] font-mono text-white/40">
                                                                {point.timecode}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteCuePoint(point.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all flex-shrink-0"
                                                        >
                                                            <Trash2 className="w-3 h-3 text-white/40" strokeWidth={1.5} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 flex items-center justify-center">
                                        <div className="text-xs text-white/30 text-center">
                                            No cue points yet<br />
                                            Press 1-0 to drop points
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Upload className="w-16 h-16 mx-auto mb-4 text-white/20" strokeWidth={1.5} />
                            <div className="text-sm text-white/40">
                                Upload audio files to get started
                            </div>
                        </div>
                    </div>
                )}
            </div>
            )}
        </div>
    );
}