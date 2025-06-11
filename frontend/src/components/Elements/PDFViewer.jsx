import React from "react";

export default function PDFViewer({ url }) {
  return (
    <div className="shadow-md">
      <iframe
        src={url}
        width="700px"
        height="500px"
        style={{ border: "none" }}
        title="PDF Viewer"
      />
    </div>

  );
}