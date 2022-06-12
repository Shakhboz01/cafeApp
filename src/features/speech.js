import React from 'react';
import { useEffect } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';

export default function SpeechFeature() {
    
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    Required: false,
    useLegacyResults: false,
    Default: 500
  });
  

  if (error) return <p>Голосование не доступно на этом браузере 🤷‍</p>;

  return (
    <div>
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>
    </div>
  );
}