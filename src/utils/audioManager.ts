/**
 * Global Audio Manager
 * Ensures only one audio source plays at a time across all components
 * Prevents duplicate/overlapping voices
 */

class AudioManager {
  private activeSource: AudioBufferSourceNode | null = null;
  private activeGainNode: GainNode | null = null;
  private audioContext: AudioContext | null = null;
  private isPlaying: boolean = false;

  constructor() {
    // Initialize audio context
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.audioContext = new AudioContextClass();
    }
  }

  /**
   * Stop all currently playing audio
   */
  async stopAll(): Promise<void> {
    if (this.activeSource) {
      try {
        this.activeSource.stop();
        this.activeSource.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
      this.activeSource = null;
    }

    if (this.activeGainNode) {
      try {
        this.activeGainNode.disconnect();
      } catch (e) {
        // Ignore if already disconnected
      }
      this.activeGainNode = null;
    }

    this.isPlaying = false;
    
    // Small delay to ensure audio is fully stopped
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Play audio, stopping any currently playing audio first
   */
  async playAudio(
    audioBuffer: AudioBuffer,
    onEnded?: () => void
  ): Promise<AudioBufferSourceNode | null> {
    if (!this.audioContext) {
      console.error("❌ Audio context not initialized");
      return null;
    }

    // Stop any existing audio first
    await this.stopAll();

    // Resume context if suspended
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {
        console.warn("⚠️ Could not resume audio context:", e);
      }
    }

    // Create gain node for volume control
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.05); // 50ms fade in
    gainNode.connect(this.audioContext.destination);

    // Create and connect source
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNode);

    // Handle ended event
    source.onended = () => {
      this.isPlaying = false;
      try {
        gainNode.disconnect();
      } catch (e) {
        // Ignore
      }
      if (this.activeSource === source) {
        this.activeSource = null;
      }
      if (this.activeGainNode === gainNode) {
        this.activeGainNode = null;
      }
      if (onEnded) {
        onEnded();
      }
    };

    // Store references
    this.activeSource = source;
    this.activeGainNode = gainNode;
    this.isPlaying = true;

    // Start playback
    try {
      source.start(0);
      return source;
    } catch (e) {
      console.error("❌ Error starting audio:", e);
      this.isPlaying = false;
      this.activeSource = null;
      this.activeGainNode = null;
      return null;
    }
  }

  /**
   * Check if audio is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get the audio context
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Close audio context (cleanup)
   */
  close(): void {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
  }
}

// Singleton instance
export const audioManager = new AudioManager();

