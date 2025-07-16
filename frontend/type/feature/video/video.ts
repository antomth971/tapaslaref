interface Video {
    id: string;
    title: string;
    link: string;
    description: string;
    transcription: string;
    duration: number | null;
    format: string;
    publicId: string;
    score: number;
}

export default Video;