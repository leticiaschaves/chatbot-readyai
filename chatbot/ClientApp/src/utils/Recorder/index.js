class Recorder {
  constructor(props) {
    this.status = "stopped";
    this.language = props?.language || "pt-BR";
    this.audio_chunks = [];
    this.transcription = "";
    this.setInput = props?.setChatInput;

    this.configureTranscription();
  }

  async configureMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.media_recorder = new MediaRecorder(stream);
      this.media_recorder.ondataavailable = ({ data }) => {
        this.audio_chunks.push(data);
      };

      this.media_recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());

        const chunks = new Blob(this.audio_chunks, {
          type: this.media_recorder.mimeType,
        });

        this.audio_url = URL.createObjectURL(chunks);
      };
    } catch (error) {
      alert("Você precisa permitir o acesso ao microfone para continuar");
    }
  }

  configureTranscription() {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new Speech();
    this.recognition.lang = this.language;
    this.recognition.interimResults = true;
    this.recognition.continuous = true;
    this.recognition.onerror = console.error;
    this.recognition.onend = this.stop.bind(this);

    this.recognition.onresult = ({ results }) => {
      this.transcription = [...results]
        .flatMap((result) => [...result].map(({ transcript }) => transcript))
        .join("");

      if (this.setInput) this.setInput(this.transcription);
    };
  }

  async stop() {
    if (this.setInput) this.setInput("");
    if (this.recognition) this.recognition.stop();
    if (this.media_recorder) this.media_recorder.stop();

    this.status = "stopped";

    await new Promise((r) => setTimeout(r, 1));

    return {
      audio: this.audio_url,
      transcription: this.transcription,
    };
  }

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

export default Recorder;
