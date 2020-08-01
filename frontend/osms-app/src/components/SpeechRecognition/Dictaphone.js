import React from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const Dictaphone = () => {
  const { transcript, resetTranscript } = useSpeechRecognition()

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  return (
    <div>
        <p>If you have difficulty in typing or your speed is slow, please use the  below 'Start' button to start recording your answer and convert it to text. 
            Once done, please click on 'Stop' button. Then copy and paste the transcript in the above area. If you want to make any changes, please click on 'Reset' button
            and try again. 
        </p>
        <button className="btn btn-secondary btn-sm" onClick={SpeechRecognition.startListening}>Start</button> 
        | <button className="btn btn-secondary btn-sm" onClick={SpeechRecognition.stopListening}>Stop</button> 
        | <button className="btn btn-secondary btn-sm" onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>
    </div>
  )
}
export default Dictaphone