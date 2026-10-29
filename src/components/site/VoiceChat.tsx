import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { transcribeVoice } from "@/lib/voice";
import { Mic, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export function VoiceInput({
  onTranscript,
  language,
  disabled,
}: {
  onTranscript: (text: string) => void;
  language: string;
  disabled: boolean;
}) {
  const transcribe = useServerFn(transcribeVoice);
  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    setSupported(!!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined");
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
      if (recorder.current) {
        recorder.current.onstop = null;
        if (recorder.current.state === "recording") recorder.current.stop();
      }
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  async function start() {
    if (recording) {
      recorder.current?.stop();
      return;
    }
    setWorking(true);
    try {
      window.speechSynthesis?.cancel();
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) {
        audio.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = audio;
      const mime = (["audio/webm", "audio/mp4", "audio/ogg"] as const).find((type) =>
        MediaRecorder.isTypeSupported(type),
      );
      if (!mime) throw new Error("unsupported");
      const chunks: Blob[] = [];
      const instance = new MediaRecorder(audio, { mimeType: mime });
      recorder.current = instance;
      instance.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      instance.onstop = async () => {
        clearTimeout(timer.current);
        audio.getTracks().forEach((t) => t.stop());
        if (!mounted.current) return;
        setRecording(false);
        setWorking(true);
        setNotice("Transcribing your question…");
        try {
          const blob = new Blob(chunks, { type: mime });
          if (blob.size > 2900000) throw new Error("large");
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          const result = await transcribe({
            data: { audio: base64, mime, language: language === "kn" ? "kn" : "en" },
          });
          if (!mounted.current) return;
          if (result.error) setNotice(result.error);
          else {
            onTranscript(result.text);
            setNotice("Question transcribed. Review it, then press Ask career guide.");
          }
        } catch {
          if (mounted.current)
            setNotice("Unable to transcribe. Please try again or type your question.");
        } finally {
          if (mounted.current) setWorking(false);
        }
      };
      instance.start();
      setRecording(true);
      setWorking(false);
      setNotice("Recording… Press Stop when finished (up to 45 seconds).");
      timer.current = setTimeout(() => {
        if (instance.state === "recording") instance.stop();
      }, 45000);
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop());
      if (mounted.current) {
        setWorking(false);
        setNotice(
          "Microphone unavailable. Allow microphone access in your browser or type your question.",
        );
      }
    }
  }
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        disabled={disabled || working || !supported}
        aria-pressed={recording}
        onClick={start}
      >
        {recording ? <Square className="mr-2 size-4" /> : <Mic className="mr-2 size-4" />}
        {working ? "Processing voice…" : recording ? "Stop recording" : "Speak your question"}
      </Button>
      <p className="text-xs text-muted-foreground">
        {supported
          ? "Your recording is sent to Groq for transcription when you stop. Review the text before sending your question."
          : "Microphone recording is unavailable in this browser. You can still type."}
      </p>
      <p role="status" className="text-sm text-muted-foreground">
        {notice}
      </p>
    </div>
  );
}

export function ReadReply({ text, language }: { text: string; language: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported("speechSynthesis" in window);
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      disabled={!supported}
      className="mt-3"
      onClick={() => {
        const synth = window.speechSynthesis;
        if (!synth) return;
        if (speaking) {
          synth.cancel();
          setSpeaking(false);
          return;
        }
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`]/g, ""));
        utterance.lang = language === "kn" ? "kn-IN" : "en-IN";
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        synth.speak(utterance);
        setSpeaking(true);
      }}
    >
      <Volume2 className="mr-2 size-4" />
      {speaking ? "Stop reading" : "Read reply aloud"}
    </Button>
  );
}
