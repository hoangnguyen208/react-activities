import React, { Fragment, useState, useEffect } from "react";
import { Header, Grid } from "semantic-ui-react";
import PhotoWidgetDropzone from "../../common/photoUpload/PhotoWidgetDropzone";
import PhotoWidgetCropper from "../../common/photoUpload/PhotoWidgetCropper";

export const PhotoUploadWidget = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      // revoke image URL from the memory after dropping the image
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  });

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={4}>
          <Header color="teal" sub content="Step 1 - Add Photo" />
          <PhotoWidgetDropzone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize image" />
          {files.length > 0 && <PhotoWidgetCropper setImage={setImage} imagePreview={files[0].preview} />}
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview & Upload" />
          {
            files.length > 0 && 
            <div className='img-preview' style={{minHeight: '200px', overflow: 'hidden'}} />
          }
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default PhotoUploadWidget;
