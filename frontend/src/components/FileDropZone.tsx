import { DropzoneOptions, useDropzone } from 'react-dropzone';
interface FileDropZoneProps {
    dropZoneOptions: DropzoneOptions
}

const FileDropZone = (props: FileDropZoneProps) => {
    const { getRootProps, getInputProps } = useDropzone(props.dropZoneOptions);
    const fileExtentions = Object.values(props.dropZoneOptions.accept ?? {});
    const fileFormats = Object.keys(props.dropZoneOptions.accept ?? {});

    const color = fileFormats[0].startsWith("video/") ? 'green' : 'blue'
    const label = fileFormats[0].startsWith("video/") ? 'Video': 'Audio'

  return (
    <div
      {...getRootProps({
        className:
          `upload-area border-2 border-dashed border-${color}-500 p-10 bg-${color}-50 text-center rounded-lg cursor-pointer transition hover:bg-${color}-100 content-center flex-grow`,
      })}
    >
      <input {...getInputProps()} />
      <p className="mb-2 text-gray-600">
      {`Drag & Drop your ${label} file (${fileExtentions[0] ?? 'any media type'}) here or`}
      </p>
      <button className={`upload-button px-4 py-2 bg-${color}-500 text-white rounded-md hover:bg-${color}-600`}>
        Browse Files
      </button>
    </div>
  )
}

export default FileDropZone