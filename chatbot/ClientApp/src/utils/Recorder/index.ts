interface Props {
  /**
   * Speech Recognition language
   * 
   * defaults to "pt-BR". You can use en-US, fr-FR, es-ES, etc...
   */
  language?: string;

  /**
   * setState for the chat input
   */
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
}

export class Recorder {
  language: string;
  audio_blob: Blob;
  transcription: string;
  media_recorder: MediaRecorder;
  status: "recording" | "stopped";

  private audio_chunks: Blob[];
  private recognition: SpeechRecognition;
  private audio_url: string;
  private setInput?: React.Dispatch<React.SetStateAction<string>>;

  // Constructor (class initializer)
  constructor(props?: Props) {
    this.status = "stopped";
    this.language = props?.language || "pt-BR";
    this.audio_chunks = [];
    this.transcription = "";
    this.setInput = props?.setChatInput;

    this.configureTranscription();
  }

  // Configuring microphone recorder
  async configureMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.media_recorder = new MediaRecorder(stream);
      this.media_recorder.ondataavailable = ({ data }) => {
        this.audio_chunks.push(data);
      };

      this.media_recorder.onstop = () => {
        // Stop recording on the browser
        stream.getTracks().forEach((track) => track.stop());

        // Create blob from audio chunks
        const chunks = new Blob(this.audio_chunks, {
          type: this.media_recorder.mimeType,
        });

        // Create blob URL
        this.audio_url = URL.createObjectURL(chunks);
      };
    } catch (error) {
      alert("Você precisa permitir o acesso ao microfone para continuar");
    }
  }

  // Configuring speech recognition
  configureTranscription() {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new Speech();
    this.recognition.lang = this.language;
    this.recognition.interimResults = true;
    this.recognition.continuous = true;
    this.recognition.onerror = console.error;
    this.recognition.onend = this.stop;

    this.recognition.onresult = ({ results }) => {
      // Gets all transcriptions from all results from all recognitions and puts it into `this.transcription`
      this.transcription = [...results]
        .flatMap((result) => [...result].map(({ transcript }) => transcript))
        // joining all array items with nothing to create a string
        .join("");

      // Updating input to what we speak
      if (this.setInput) this.setInput(this.transcription);
    };
  }

  // Stopping recording and returning audio URL and transcription.
  async stop() {
    if (this.setInput) this.setInput("");
    if (this.recognition) this.recognition.stop();
    if (this.media_recorder) this.media_recorder.stop();

    this.status = "stopped";

    // Waits 1ms (we need to wait for `this.media_recorder.onstop`)
    await new Promise((r) => setTimeout(r, 1));

    return {
      audio: this.audio_url,
      transcription: this.transcription,
    };
  }

  // Starting recording microphone and speech recognition
  async start() {
    if (this.setInput) this.setInput("");

    this.audio_chunks = [];
    this.transcription = "";
    await this.configureMicrophone();
    this.media_recorder.start();
    this.recognition.start();

    this.status = "recording";
  }

  reset() {
    if (this.setInput) this.setInput("");
    this.status = "stopped";
    this.audio_chunks = [];
    this.transcription = "";
  }
}
