import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import instanceService from "../services/instanceService";

function DownloadButton({ id }) {
  const [donwnloadStarted, setDonwnloadStarted] = useState(false);
  const downLoadLinkBtn = useRef(null);
  const [downLoadLink, setDownLoadLink] = useState("");
  const [progressStatus, setProgressStatus] = useState(0);

  const downLoadDocuments = async (event) => {
    setDonwnloadStarted(true);

    const accessToken = sessionStorage.getItem("accessToken");
    if (id) {
      try {
        const res = await axios.get(
          `${instanceService.baseURL}cashRequest/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: "blob",
            onDownloadProgress: function (progressEvent) {
              const downloadedSize = progressEvent.loaded;
              setProgressStatus(downloadedSize);
            },
          }
        );

        const blob = new Blob([res.data], { type: "application/zip" }); // Axios automatically parses the blob

        const objectURL = URL.createObjectURL(blob);
        setDownLoadLink(objectURL);

        downLoadLinkBtn.current.href = objectURL;
        downLoadLinkBtn.current.download = "Cash-Request-Documents.zip";
        downLoadLinkBtn.current.click();

        if (res.status === 200) {
          toast.success("Download success!");
          setDonwnloadStarted(false);
          setProgressStatus(0);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("error id");
    }
  };

  return (
    <div className="d-inline-flex">
      {" "}
      <button
        onClick={downLoadDocuments}
        className="btn btn-info btn-sm p-1 ms-1 align-items-center  justify-content-center  d-inline-flex"
      >
        {donwnloadStarted ? (
          <>
            <span className="text-center text-capitalize text-sm">
              {progressStatus} bytes downloaded{" "}
            </span>
            <div className="ms-1 spinner-border text-center" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </>
        ) : (
          <span className="material-symbols-rounded z-2">download</span>
        )}
      </button>
      <a hidden ref={downLoadLinkBtn} href={downLoadLink}></a>
    </div>
  );
}

export default DownloadButton;
