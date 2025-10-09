interface Props {
  _id: string;
  id: string;
  uri: string;
  format: string;
  cardSize: number;
  onPress: () => void;
  name?: string;
  description?: string;
  transcription?: string;
};

export default Props;
