interface Props {
  visible: boolean;
  onClose: () => void;
  videoId: string;
  uri?: string;
  title?: string;
  description?: string;
  transcription?: string;
  format?: string;
};

export default Props;