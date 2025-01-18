export interface VideoPlayerProps {
    url: string
}
const VideoPlayer = (props: VideoPlayerProps) => {
  return (
    <div className="video-player">
    <video className="w-full rounded-md" controls>
      <source src={props.url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  )
}

export default VideoPlayer