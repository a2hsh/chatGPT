import { useState, useEffect } from 'react';

const useAudioRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let timer = null;
    let startTime = null;

    const startRecording = () => {
      const chunks = [];
      const mediaStreamConstraints = { audio: true };

      navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (event) => chunks.push(event.data);
          recorder.start();
          setMediaRecorder(recorder);

          startTime = Date.now();
          timer = setInterval(() => {
            const newDuration = Math.floor((Date.now() - startTime) / 1000);
            setDuration(newDuration);
          }, 1000);
        })
        .catch((error) => console.error('Error accessing microphone:', error));
    };

    if (isRecording) {
      startRecording();
    } else if (mediaRecorder) {
      clearInterval(timer);
      setDuration(0);
      mediaRecorder.stop();
    }

    return () => {
      clearInterval(timer);
      setDuration(0);

      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    };
  }, [isRecording, mediaRecorder]);

  const start = () => setIsRecording(true);

  const pause = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    setIsRecording(false);
    setIsPaused(false);
    //chunks are recorded in mediaRecorder.ondataavailable
    //when recording is stopped, mediaRecorder.onstop is called
    mediaRecorder.onstop = () => {
      //log the type
      console.log(recordedChunks[0].type);
      const blob = new Blob(recordedChunks, { type: recordedChunks[0].type });
      const file = new File([blob], `recording.webm`, { type: blob.type });
      console.log(file);
    }
  }

  const reset = () => {
    setIsRecording(false);
    setDuration(0);
    setRecordedChunks([]);
  };

  const convertToBlob = () => {
    if (recordedChunks.length > 0) {
      //log the type
      console.log(recordedChunks[0].type);
      return new Blob(recordedChunks, { type: recordedChunks[0].type });
    }
    return null;
  };

  const convertToWebM = () => {
    const blob = convertToBlob();
    if (blob) {
      const file = new File([blob], `recording.webm`, { type: blob.type });
      return file;
    }
    return null;
  };

  const convertToMP3 = async () => {
    const blob = convertToBlob();
    if (blob) {
      const arrayBuffer = await blob.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const encoder = new lamejs.Mp3Encoder(1, audioBuffer.sampleRate, 128);
      const samples = audioBuffer.getChannelData(0) * 32767;
      const mp3Data = [];
      const sampleBlockSize = 1152;

      for (let i = 0; i < samples.length; i += sampleBlockSize) {
        const sampleChunk = samples.subarray(i, i + sampleBlockSize);
        const mp3buf = encoder.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }
      }

      const mp3buf = encoder.flush();
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }

      const blob = new Blob(mp3Data, { type: 'audio/mp3' });
      const file = new File([blob], `recording.mp3`, { type: blob.type });
      return file;
    }
    return null;
  };

  const convertToWAV = () => {
    const blob = convertToBlob();
    if (blob) {
      const file = new File([blob], `recording.wav`, { type: blob.type });
      return file;
    }
    return null;
  };

  return {
    isRecording,
    isPaused,
    recordedChunks,
    duration,
    start,
    pause,
    resume,
    stop,
    reset,
    convertToBlob,
    convertToWebM,
    convertToMP3,
    convertToWAV,
  };
};

export default useAudioRecorder;